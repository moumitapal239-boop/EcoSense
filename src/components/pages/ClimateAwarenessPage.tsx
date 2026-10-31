/**
 * Page 4: CLIMATE AWARENESS (Social Media & Public Interest)
 * - Real live posts from Reddit r/climatechange (with automatic fallback to HN Algolia)
 * - In-browser sentiment analysis (positive, neutral, negative pie chart)
 * - Trending topics word frequency analysis (stop words removed)
 * - Wikimedia Pageviews API (90 days of daily views for "Climate change" article)
 * - Latest 10 real post titles with sentiment badges and links
 */

import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import {
  MessageSquareText,
  TrendingUp,
  Globe,
  Tag,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Search,
  BookOpen,
} from 'lucide-react';
import { DataSourceFooter } from '../common/DataSourceFooter';
import { ErrorMessage } from '../common/ErrorMessage';
import { ChartSkeleton } from '../common/SkeletonLoader';
import { getLineChartOptions, getBarChartOptions } from '../../utils/chartConfig';

export const ClimateAwarenessPage: React.FC = () => {
  const {
    isDark,
    socialSentiment,
    socialLoading,
    socialError,
    refreshSocial,
    wikiViews,
    wikiLoading,
    wikiError,
    refreshWiki,
  } = useApp();

  // 1. Sentiment Breakdown Doughnut Chart
  const sentimentChartData = useMemo(() => {
    if (!socialSentiment) return { labels: [], datasets: [] };
    return {
      labels: [
        `Positive (${socialSentiment.positiveCount})`,
        `Neutral (${socialSentiment.neutralCount})`,
        `Negative / Alarm (${socialSentiment.negativeCount})`,
      ],
      datasets: [
        {
          data: [
            socialSentiment.positiveCount,
            socialSentiment.neutralCount,
            socialSentiment.negativeCount,
          ],
          backgroundColor: [
            '#059669', // emerald-600
            '#64748b', // slate-500
            '#e11d48', // rose-600
          ],
          borderColor: isDark ? '#0f172a' : '#ffffff',
          borderWidth: 2,
        },
      ],
    };
  }, [socialSentiment, isDark]);

  // 2. Trending Topics Bar Chart
  const topicsBarData = useMemo(() => {
    if (!socialSentiment?.trendingWords) return { labels: [], datasets: [] };
    return {
      labels: socialSentiment.trendingWords.map((w) => w.word),
      datasets: [
        {
          label: 'Keyword Frequency (In Live Climate Headlines)',
          data: socialSentiment.trendingWords.map((w) => w.count),
          backgroundColor: '#0284c7', // sky-600
          borderRadius: 6,
        },
      ],
    };
  }, [socialSentiment]);

  const topicsBarOptions = useMemo(() => {
    return getBarChartOptions(isDark);
  }, [isDark]);

  // 3. Wikimedia Pageviews Line Chart
  const wikiLineData = useMemo(() => {
    if (!wikiViews?.items) return { labels: [], datasets: [] };
    return {
      labels: wikiViews.items.map((i) => {
        // e.g. "2026-10-25" -> "Oct 25"
        const parts = i.date.split('-');
        if (parts.length === 3) {
          const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
          return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
        return i.date;
      }),
      datasets: [
        {
          label: 'Daily English Wikipedia Page Views ("Climate change")',
          data: wikiViews.items.map((i) => i.views),
          borderColor: '#059669', // emerald-600
          backgroundColor: 'rgba(5, 150, 105, 0.1)',
          borderWidth: 2,
          pointRadius: 1,
          pointHoverRadius: 5,
          tension: 0.3,
          fill: true,
        },
      ],
    };
  }, [wikiViews]);

  const wikiLineOptions = useMemo(() => {
    return getLineChartOptions(isDark);
  }, [isDark]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Public Discourse & Engagement
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
            Climate Awareness & Public Sentiment Analytics
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Mines live discussions from social forums with in-browser sentiment analysis and correlates them with 90-day Wikimedia search volume.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              refreshSocial();
              refreshWiki();
            }}
            disabled={socialLoading || wikiLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${(socialLoading || wikiLoading) ? 'animate-spin text-emerald-500' : ''}`} />
            Refresh Social Feeds
          </button>
        </div>
      </div>

      {/* Row 1: Sentiment Breakdown + Trending Topics Word Frequency */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sentiment Pie / Breakdown */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquareText className="w-4 h-4 text-emerald-500" />
                Social Media Sentiment Tone
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Rule-based lexicon scoring of {socialSentiment?.totalPosts ?? 0} live discussions
              </p>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              Avg: {socialSentiment?.averageScore ?? 0}
            </span>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            {socialLoading ? (
              <ChartSkeleton />
            ) : socialError ? (
              <ErrorMessage message={socialError} onRetry={refreshSocial} />
            ) : (
              <Doughnut
                data={sentimentChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        color: isDark ? '#94a3b8' : '#64748b',
                        font: { family: 'Plus Jakarta Sans', size: 11 },
                      },
                    },
                  },
                }}
              />
            )}
          </div>

          {/* Sentiment Stats Row */}
          {socialSentiment && (
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
                <span className="text-emerald-700 dark:text-emerald-300 font-bold block">
                  {Math.round((socialSentiment.positiveCount / socialSentiment.totalPosts) * 100)}%
                </span>
                <span className="text-[10px] text-slate-500">Positive / Action</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                <span className="text-slate-700 dark:text-slate-300 font-bold block">
                  {Math.round((socialSentiment.neutralCount / socialSentiment.totalPosts) * 100)}%
                </span>
                <span className="text-[10px] text-slate-500">Neutral News</span>
              </div>
              <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40">
                <span className="text-rose-700 dark:text-rose-300 font-bold block">
                  {Math.round((socialSentiment.negativeCount / socialSentiment.totalPosts) * 100)}%
                </span>
                <span className="text-[10px] text-slate-500">Crisis / Threat</span>
              </div>
            </div>
          )}

          <DataSourceFooter
            sourceName={socialSentiment?.sourceUsed || 'Reddit r/climatechange / HN Algolia Fallback'}
            lastUpdated={socialSentiment?.lastUpdated}
            notes="Analyzed on client side via environmental dictionary matching"
          />
        </div>

        {/* Trending Words Frequency */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-sky-500" />
                Trending Keywords & Topics
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Extracted after tokenizing and stripping common English stop-words
              </p>
            </div>
          </div>

          <div className="h-56 w-full">
            {socialLoading ? (
              <ChartSkeleton />
            ) : (
              <Bar data={topicsBarData} options={topicsBarOptions} />
            )}
          </div>

          {/* Quick topic pills */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {socialSentiment?.trendingWords.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/50"
              >
                <span>#{item.word}</span>
                <span className="text-[10px] opacity-75">({item.count})</span>
              </span>
            ))}
          </div>

          <DataSourceFooter
            sourceName="Client-Side NLP Frequency Analyzer"
            notes="Filtered against 100+ standard English stop-words"
          />
        </div>
      </div>

      {/* Row 2: Wikimedia Pageviews 90-Day Trendline */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Public Interest Indicator: Wikipedia Pageviews (Last 90 Days)
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Daily readership statistics for the Wikipedia article "Climate change" from the Wikimedia REST API.
            </p>
          </div>
          {wikiViews && (
            <div className="flex items-center gap-3 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800/60">
                Avg: {wikiViews.averageDailyViews.toLocaleString()} views/day
              </span>
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                Total: {wikiViews.totalViews.toLocaleString()} reads
              </span>
            </div>
          )}
        </div>

        <div className="mt-4">
          {wikiLoading ? (
            <ChartSkeleton />
          ) : wikiError ? (
            <ErrorMessage message={wikiError} onRetry={refreshWiki} />
          ) : (
            <div className="h-[280px] w-full">
              <Line data={wikiLineData} options={wikiLineOptions} />
            </div>
          )}
        </div>

        <DataSourceFooter
          sourceName="Wikimedia Pageviews REST API"
          sourceUrl="https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/Climate_change/daily"
          lastUpdated={wikiViews?.lastUpdated}
          notes="Official Wikimedia Foundation metric for global information-seeking behaviour"
        />
      </div>

      {/* Row 3: Latest 10 Real Posts with Sentiment Label */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              Latest 10 Real Social Discussions & Sentiment Tagging
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live titles retrieved from public communities with their client-side sentiment score
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {socialSentiment?.posts.slice(0, 10).map((post) => {
            const sentimentBadge = {
              positive: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
              neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
              negative: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
            }[post.sentiment];

            return (
              <div
                key={post.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 px-2 rounded-xl transition-colors"
              >
                <div className="space-y-1 flex-1 min-w-0 pr-2">
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-xs sm:text-sm text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5 line-clamp-2"
                  >
                    <span>{post.title}</span>
                    <ExternalLink className="w-3 h-3 shrink-0 opacity-60" />
                  </a>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>Source: {post.source}</span>
                    <span>•</span>
                    <span>Score: {post.score}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border capitalize ${sentimentBadge}`}
                  >
                    {post.sentiment} ({post.sentimentScore > 0 ? `+${post.sentimentScore}` : post.sentimentScore})
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
