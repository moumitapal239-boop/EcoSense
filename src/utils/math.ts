/**
 * Mathematical & Statistical Utilities for EcoSense
 * Specially commented for 2nd-year Computer Science Students
 * 
 * Includes: Ordinary Least Squares (OLS) Linear Regression for Deforestation Forecasting
 */

import { WorldBankDataPoint, RegressionResult } from '../types';

/**
 * Perform Ordinary Least Squares (OLS) Linear Regression
 * 
 * Mathematical Formulation:
 * A straight line is defined by:  y = m * x + c
 * where:
 *   x = year (independent variable)
 *   y = forest area percentage (dependent variable)
 *   m = slope (rate of forest cover change per year)
 *   c = y-intercept (theoretical value when x = 0)
 * 
 * Formulas:
 *   m = [ n * Σ(xy) - (Σx)(Σy) ] / [ n * Σ(x²) - (Σx)² ]
 *   c = [ Σy - m * Σx ] / n
 * 
 * R² (Coefficient of Determination):
 *   R² = 1 - (SS_res / SS_tot)
 *   measures the proportion of variation in y explained by x (0 to 1).
 */
export function calculateLinearRegression(
  data: WorldBankDataPoint[],
  forecastYearsAhead: number = 10
): RegressionResult {
  // If insufficient data, return a safe fallback
  if (!data || data.length < 2) {
    return {
      slope: 0,
      intercept: 0,
      rSquared: 0,
      direction: 'stable',
      annualChangePct: 0,
      forecast: [],
      riskLevel: 'MODERATE',
      riskDescription: 'Insufficient historical data points for regression modeling.',
    };
  }

  // Filter out any invalid numbers
  const validPoints = data
    .filter((d) => typeof d.year === 'number' && typeof d.value === 'number' && !isNaN(d.value))
    .sort((a, b) => a.year - b.year);

  const n = validPoints.length;

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  for (let i = 0; i < n; i++) {
    const x = validPoints[i].year;
    const y = validPoints[i].value;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  }

  // Calculate slope (m) and intercept (c)
  const denominator = n * sumX2 - sumX * sumX;
  if (denominator === 0) {
    return {
      slope: 0,
      intercept: sumY / n,
      rSquared: 0,
      direction: 'stable',
      annualChangePct: 0,
      forecast: [],
      riskLevel: 'MODERATE',
      riskDescription: 'Data has zero variance across years.',
    };
  }

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  // Calculate R² (Goodness of Fit)
  const meanY = sumY / n;
  let ssTot = 0;
  let ssRes = 0;

  for (let i = 0; i < n; i++) {
    const x = validPoints[i].year;
    const actualY = validPoints[i].value;
    const predictedY = slope * x + intercept;

    ssTot += Math.pow(actualY - meanY, 2);
    ssRes += Math.pow(actualY - predictedY, 2);
  }

  const rSquared = ssTot > 0 ? Math.max(0, Math.min(1, 1 - ssRes / ssTot)) : 1;

  // Determine direction
  let direction: 'increasing' | 'decreasing' | 'stable' = 'stable';
  if (slope > 0.01) direction = 'increasing';
  else if (slope < -0.01) direction = 'decreasing';

  // Calculate 10-year forward predictions
  const lastRecordedYear = validPoints[validPoints.length - 1].year;
  const forecast: { year: number; predictedValue: number }[] = [];

  for (let i = 1; i <= forecastYearsAhead; i++) {
    const futureYear = lastRecordedYear + i;
    // Cap forecast between 0% and 100% of land
    const rawPrediction = slope * futureYear + intercept;
    const predictedValue = Number(Math.max(0, Math.min(100, rawPrediction)).toFixed(2));
    forecast.push({ year: futureYear, predictedValue });
  }

  // Risk categorization based on deforestation slope
  let riskLevel: 'LOW' | 'MODERATE' | 'HIGH' = 'LOW';
  let riskDescription = '';

  if (slope < -0.15) {
    riskLevel = 'HIGH';
    riskDescription = `High Deforestation Risk: Forest cover is declining sharply at an alarming rate of ${Math.abs(slope).toFixed(3)}% per year.`;
  } else if (slope < 0) {
    riskLevel = 'MODERATE';
    riskDescription = `Moderate Deforestation Risk: Mild decline in forest area at approximately ${Math.abs(slope).toFixed(3)}% per year.`;
  } else {
    riskLevel = 'LOW';
    riskDescription = `Low Risk / Positive Trend: Forest cover is stabilizing or expanding at +${slope.toFixed(3)}% per year due to conservation/afforestation.`;
  }

  return {
    slope: Number(slope.toFixed(4)),
    intercept: Number(intercept.toFixed(2)),
    rSquared: Number(rSquared.toFixed(3)),
    direction,
    annualChangePct: Number((slope).toFixed(3)),
    forecast,
    riskLevel,
    riskDescription,
  };
}

/**
 * Format numbers with unit abbreviations
 */
export function formatNumber(num: number, decimals: number = 1): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(decimals) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(decimals) + 'k';
  return num.toFixed(decimals);
}
