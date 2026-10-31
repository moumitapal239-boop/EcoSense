/**
 * Client-Side Sentiment Analysis & NLP Topic Extraction
 * EcoSense College Project
 * 
 * Explains how natural language processing works in the browser without server/GPU:
 * 1. Tokenization: Breaking text into individual words.
 * 2. Stop-word Removal: Discarding meaningless frequent words (is, the, at).
 * 3. Lexicon Scoring: Comparing tokens against a calibrated environmental dictionary.
 * 4. Negation Handling: Inverting polarity when preceded by negation ("not", "never", "no").
 */

import { SENTIMENT_LEXICON, STOP_WORDS } from '../constants';
import { SocialPost, TrendingWord, SentimentAnalysisResult } from '../types';

interface RawPost {
  id: string;
  title: string;
  url: string;
  source: 'Reddit (r/climatechange)' | 'Reddit (r/environment)' | 'Hacker News (Algolia API)';
  created_utc: number;
  author: string;
  score: number;
}

const NEGATION_WORDS = new Set(['not', 'never', 'no', 'hardly', 'barely', 'scarcely', 'neither', 'nor']);

/**
 * Analyze sentiment of a single headline or sentence
 */
export function analyzeTextSentiment(text: string): {
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number;
} {
  if (!text || text.trim().length === 0) {
    return { sentiment: 'neutral', score: 0 };
  }

  // Clean and split words by non-alphanumeric characters
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1);

  if (words.length === 0) {
    return { sentiment: 'neutral', score: 0 };
  }

  let totalScore = 0;
  let scoredWordsCount = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const prevWord = i > 0 ? words[i - 1] : '';
    const hasNegation = NEGATION_WORDS.has(prevWord);

    if (word in SENTIMENT_LEXICON) {
      let wordScore = SENTIMENT_LEXICON[word];
      if (hasNegation) {
        wordScore = -wordScore * 0.8; // flip polarity
      }
      totalScore += wordScore;
      scoredWordsCount++;
    }
  }

  // Normalize score between -1 and +1
  const finalScore = scoredWordsCount > 0 ? totalScore / scoredWordsCount : 0;

  let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
  if (finalScore >= 0.15) {
    sentiment = 'positive';
  } else if (finalScore <= -0.15) {
    sentiment = 'negative';
  }

  return {
    sentiment,
    score: Number(Math.max(-1, Math.min(1, finalScore)).toFixed(2)),
  };
}

/**
 * Extract trending keywords from a collection of headlines
 */
export function extractTrendingKeywords(titles: string[], topN: number = 12): TrendingWord[] {
  const wordCounts = new Map<string, number>();

  for (const title of titles) {
    const words = title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 3 && !STOP_WORDS.has(w) && !/^\d+$/.test(w));

    for (const word of words) {
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    }
  }

  return Array.from(wordCounts.entries())
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
}

/**
 * Process a batch of raw social posts and aggregate sentiment statistics
 */
export function processSocialData(rawPosts: RawPost[], sourceName: string): SentimentAnalysisResult {
  let positiveCount = 0;
  let neutralCount = 0;
  let negativeCount = 0;
  let totalScoreSum = 0;

  const posts: SocialPost[] = rawPosts.map((post) => {
    const { sentiment, score } = analyzeTextSentiment(post.title);

    if (sentiment === 'positive') positiveCount++;
    else if (sentiment === 'negative') negativeCount++;
    else neutralCount++;

    totalScoreSum += score;

    return {
      ...post,
      sentiment,
      sentimentScore: score,
    };
  });

  const total = posts.length || 1;
  const averageScore = Number((totalScoreSum / total).toFixed(2));
  const titles = posts.map((p) => p.title);
  const trendingWords = extractTrendingKeywords(titles, 12);

  return {
    positiveCount,
    neutralCount,
    negativeCount,
    totalPosts: posts.length,
    averageScore,
    posts,
    trendingWords,
    sourceUsed: sourceName,
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
}
