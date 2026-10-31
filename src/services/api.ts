/**
 * EcoSense Real API Services
 * Fetches real-time and historical data from completely free, keyless public APIs.
 * Includes timeout handling, CORS fallback, and clear error logging.
 */

import { CityConfig, CountryConfig, AirQualityResponse, CountryDeforestationData, WorldBankDataPoint, SentimentAnalysisResult, WikiPageviewsData } from '../types';
import { calculateLinearRegression } from '../utils/math';
import { processSocialData } from '../utils/sentiment';

/**
 * 1. Open-Meteo Air Quality API
 * Real hourly data: PM2.5, Carbon Monoxide, Nitrogen Dioxide, Carbon Dioxide
 */
export async function fetchAirQuality(city: CityConfig): Promise<AirQualityResponse> {
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${city.latitude}&longitude=${city.longitude}&hourly=pm2_5,carbon_monoxide,nitrogen_dioxide,carbon_dioxide&past_days=3&forecast_days=2`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Open-Meteo API returned HTTP status ${res.status}`);
    }

    const data = await res.json();
    if (!data.hourly || !data.hourly.time || data.hourly.time.length === 0) {
      throw new Error('No hourly air quality data returned for this location.');
    }

    const hourly = data.hourly;
    const times: string[] = hourly.time;

    // Find the current or most recent non-null reading
    // Open-Meteo provides hourly timestamps like "2026-10-31T08:00"
    const nowIso = new Date().toISOString().slice(0, 13);
    let currentIndex = times.findIndex((t) => t.startsWith(nowIso));
    if (currentIndex === -1) {
      // Default to the middle or past_days transition point (hour 72 approx)
      currentIndex = Math.min(72, times.length - 1);
    }

    const currentPM25 = hourly.pm2_5 ? (hourly.pm2_5[currentIndex] ?? hourly.pm2_5.filter((v: number | null) => v !== null).pop() ?? null) : null;
    const currentCO = hourly.carbon_monoxide ? (hourly.carbon_monoxide[currentIndex] ?? hourly.carbon_monoxide.filter((v: number | null) => v !== null).pop() ?? null) : null;
    const currentNO2 = hourly.nitrogen_dioxide ? (hourly.nitrogen_dioxide[currentIndex] ?? hourly.nitrogen_dioxide.filter((v: number | null) => v !== null).pop() ?? null) : null;
    const currentCO2 = hourly.carbon_dioxide ? (hourly.carbon_dioxide[currentIndex] ?? hourly.carbon_dioxide.filter((v: number | null) => v !== null).pop() ?? null) : null;

    return {
      city,
      readings: {
        time: times,
        pm2_5: hourly.pm2_5 || [],
        carbon_monoxide: hourly.carbon_monoxide || [],
        nitrogen_dioxide: hourly.nitrogen_dioxide || [],
        carbon_dioxide: hourly.carbon_dioxide || [],
      },
      currentPM25: currentPM25 !== null ? Number(currentPM25.toFixed(1)) : null,
      currentCO: currentCO !== null ? Number(currentCO.toFixed(1)) : null,
      currentNO2: currentNO2 !== null ? Number(currentNO2.toFixed(1)) : null,
      currentCO2: currentCO2 !== null ? Number(currentCO2.toFixed(1)) : null,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const msg = err instanceof Error ? err.message : 'Failed to reach Open-Meteo Air Quality service';
    throw new Error(`Air Quality Fetch Error: ${msg}`);
  }
}

/**
 * 2. World Bank API: Deforestation & Forest Area
 * Indicator AG.LND.FRST.ZS = Forest area (% of land area)
 * Indicator AG.LND.FRST.K2 = Forest area (sq. km)
 */
export async function fetchDeforestation(country: CountryConfig): Promise<CountryDeforestationData> {
  const pctUrl = `https://api.worldbank.org/v2/country/${country.code}/indicator/AG.LND.FRST.ZS?format=json&per_page=100`;
  const sqkmUrl = `https://api.worldbank.org/v2/country/${country.code}/indicator/AG.LND.FRST.K2?format=json&per_page=100`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const [pctRes, sqkmRes] = await Promise.all([
      fetch(pctUrl, { signal: controller.signal }),
      fetch(sqkmUrl, { signal: controller.signal }).catch(() => null),
    ]);
    clearTimeout(timeoutId);

    if (!pctRes.ok) {
      throw new Error(`World Bank API returned status ${pctRes.status}`);
    }

    const pctJson = await pctRes.json();
    if (!Array.isArray(pctJson) || pctJson.length < 2 || !Array.isArray(pctJson[1])) {
      throw new Error('Invalid response structure from World Bank indicator API');
    }

    const rawRecords = pctJson[1];

    // Filter valid historical points from 1990 onwards
    const percentageHistory: WorldBankDataPoint[] = rawRecords
      .filter((item: { date: string; value: number | null }) => item.value !== null && !isNaN(item.value) && Number(item.date) >= 1990)
      .map((item: { date: string; value: number }) => ({
        year: Number(item.date),
        value: Number(item.value.toFixed(2)),
      }))
      .sort((a: WorldBankDataPoint, b: WorldBankDataPoint) => a.year - b.year);

    if (percentageHistory.length === 0) {
      throw new Error(`No historical forest percentage data found for ${country.name}`);
    }

    // Parse sq km history if available
    let sqKmHistory: WorldBankDataPoint[] = [];
    if (sqkmRes && sqkmRes.ok) {
      try {
        const sqkmJson = await sqkmRes.json();
        if (Array.isArray(sqkmJson) && sqkmJson.length >= 2 && Array.isArray(sqkmJson[1])) {
          sqKmHistory = sqkmJson[1]
            .filter((item: { date: string; value: number | null }) => item.value !== null && !isNaN(item.value) && Number(item.date) >= 1990)
            .map((item: { date: string; value: number }) => ({
              year: Number(item.date),
              value: Math.round(item.value),
            }))
            .sort((a: WorldBankDataPoint, b: WorldBankDataPoint) => a.year - b.year);
        }
      } catch {
        // graceful skip if sq km isn't available
      }
    }

    // Run linear regression on the real historical percentage points
    const regression = calculateLinearRegression(percentageHistory, 10);

    const latestPoint = percentageHistory[percentageHistory.length - 1];
    const baseline1990 = percentageHistory[0];
    const netChange = Number((latestPoint.value - baseline1990.value).toFixed(2));

    return {
      country,
      percentageHistory,
      sqKmHistory,
      regression,
      latestYear: latestPoint.year,
      latestValue: latestPoint.value,
      baseline1990Value: baseline1990.value,
      netChangeSince1990: netChange,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const msg = err instanceof Error ? err.message : 'World Bank service unreachable';
    throw new Error(`Deforestation Data Error: ${msg}`);
  }
}

/**
 * 3. Climate Awareness Social Posts
 * Tries Reddit (r/climatechange), falls back to Hacker News Algolia search if blocked by CORS
 */
export async function fetchSocialClimatePosts(): Promise<SentimentAnalysisResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  // Attempt Reddit first
  try {
    const redditRes = await fetch('https://www.reddit.com/r/climatechange/new.json?limit=50', {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    if (redditRes.ok) {
      clearTimeout(timeoutId);
      const data = await redditRes.json();
      if (data?.data?.children && data.data.children.length > 0) {
        const rawPosts = data.data.children.map((child: { data: { id: string; title: string; permalink: string; created_utc: number; author: string; score: number } }) => ({
          id: child.data.id,
          title: child.data.title,
          url: `https://reddit.com${child.data.permalink}`,
          source: 'Reddit (r/climatechange)' as const,
          created_utc: child.data.created_utc,
          author: child.data.author,
          score: child.data.score,
        }));
        return processSocialData(rawPosts, 'Reddit r/climatechange API');
      }
    }
  } catch {
    // If Reddit has CORS or network error, quietly fallback to HN Algolia
  }

  // Fallback: Hacker News Algolia Search API (CORS friendly, 100% reliable)
  try {
    const hnRes = await fetch('https://hn.algolia.com/api/v1/search?query=climate%20change&tags=story&hitsPerPage=60');
    if (!hnRes.ok) {
      throw new Error(`Hacker News Algolia returned ${hnRes.status}`);
    }

    const data = await hnRes.json();
    if (!data.hits || data.hits.length === 0) {
      throw new Error('No social discussions found for "climate change"');
    }

    const rawPosts = data.hits.map((hit: { objectID: string; title: string; url?: string; created_at_i: number; author: string; points: number }) => ({
      id: hit.objectID,
      title: hit.title || 'Climate discussion topic',
      url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
      source: 'Hacker News (Algolia API)' as const,
      created_utc: hit.created_at_i,
      author: hit.author || 'community',
      score: hit.points || 1,
    }));

    return processSocialData(rawPosts, 'Hacker News Public Search (Algolia API - Real-time Fallback)');
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Social API unreachable';
    throw new Error(`Climate Social Posts Error: ${msg}`);
  }
}

/**
 * 4. Wikimedia Pageviews API
 * Tracks daily page views for the English Wikipedia article "Climate change" for past 90 days
 */
export async function fetchWikiPageviews(): Promise<WikiPageviewsData> {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 1); // Yesterday

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 91); // 90 days span

  const formatWikiDate = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}${mm}${dd}00`;
  };

  const startStr = formatWikiDate(startDate);
  const endStr = formatWikiDate(endDate);

  const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/Climate_change/daily/${startStr}/${endStr}`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'EcoSenseProject/1.0 (College Environmental Analytics Project)',
      },
    });

    if (!res.ok) {
      throw new Error(`Wikimedia API returned ${res.status}`);
    }

    const json = await res.json();
    if (!json.items || json.items.length === 0) {
      throw new Error('No pageviews returned for Wikipedia "Climate change"');
    }

    let total = 0;
    const items = json.items.map((it: { timestamp: string; views: number }) => {
      total += it.views;
      // Convert "2026102500" to "2026-10-25"
      const y = it.timestamp.slice(0, 4);
      const m = it.timestamp.slice(4, 6);
      const d = it.timestamp.slice(6, 8);
      return {
        date: `${y}-${m}-${d}`,
        views: it.views,
      };
    });

    return {
      article: 'Climate change (en.wikipedia)',
      items,
      totalViews: total,
      averageDailyViews: Math.round(total / items.length),
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Wikimedia service error';
    throw new Error(`Wikipedia Pageviews Error: ${msg}`);
  }
}

/**
 * 5. Fetch comparison data for multiple countries simultaneously
 */
export async function fetchMultiCountryComparison(countryCodes: string[]): Promise<
  { code: string; name: string; latestYear: number; latestValue: number; baseline1990: number }[]
> {
  const results = await Promise.allSettled(
    countryCodes.map(async (code) => {
      const url = `https://api.worldbank.org/v2/country/${code}/indicator/AG.LND.FRST.ZS?format=json&per_page=60`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Fetch failed');
      const json = await res.json();
      const records = json[1] || [];
      const valid = records.filter((r: { value: number | null }) => r.value !== null);
      if (valid.length === 0) throw new Error('No data');
      const latest = valid[0];
      const oldest = valid[valid.length - 1];
      return {
        code,
        name: latest.country?.value || code,
        latestYear: Number(latest.date),
        latestValue: Number(latest.value.toFixed(1)),
        baseline1990: Number(oldest.value.toFixed(1)),
      };
    })
  );

  return results
    .filter((r): r is PromiseFulfilledResult<{ code: string; name: string; latestYear: number; latestValue: number; baseline1990: number }> => r.status === 'fulfilled')
    .map((r) => r.value);
}
