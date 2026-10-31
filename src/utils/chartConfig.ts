/**
 * Chart.js Registration & Theme Configuration
 * EcoSense Project
 */

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js';

// Register all required Chart.js controllers and plugins once
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * Common color theme tokens
 */
export function getChartColors(isDark: boolean) {
  return {
    textColor: isDark ? '#94a3b8' : '#64748b', // slate-400 / slate-500
    gridColor: isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)', // slate-700 / slate-200
    tooltipBg: isDark ? '#0f172a' : '#ffffff', // slate-900 / white
    tooltipText: isDark ? '#f8fafc' : '#0f172a',
  };
}

/**
 * Returns Chart.js Line chart options
 */
export function getLineChartOptions(isDark: boolean): ChartOptions<'line'> {
  const { textColor, gridColor, tooltipBg, tooltipText } = getChartColors(isDark);

  return {
    responsive: true,
    maintainAspectRatio: false,
    color: textColor,
    plugins: {
      legend: {
        labels: {
          color: textColor,
          font: {
            family: 'Plus Jakarta Sans',
            size: 12,
            weight: 500,
          },
          usePointStyle: true,
          boxWidth: 8,
          boxHeight: 8,
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: tooltipText,
        bodyColor: tooltipText,
        borderColor: isDark ? '#334155' : '#e2e8f0',
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        cornerRadius: 8,
        titleFont: {
          family: 'Plus Jakarta Sans',
          size: 13,
          weight: 'bold',
        },
        bodyFont: {
          family: 'Plus Jakarta Sans',
          size: 12,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
          font: {
            family: 'Plus Jakarta Sans',
            size: 11,
          },
          maxRotation: 45,
          autoSkip: true,
          maxTicksLimit: 12,
        },
      },
      y: {
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
          font: {
            family: 'Plus Jakarta Sans',
            size: 11,
          },
        },
      },
    },
  };
}

/**
 * Returns Chart.js Bar chart options
 */
export function getBarChartOptions(isDark: boolean): ChartOptions<'bar'> {
  const { textColor, gridColor, tooltipBg, tooltipText } = getChartColors(isDark);

  return {
    responsive: true,
    maintainAspectRatio: false,
    color: textColor,
    plugins: {
      legend: {
        labels: {
          color: textColor,
          font: {
            family: 'Plus Jakarta Sans',
            size: 12,
            weight: 500,
          },
          usePointStyle: true,
          boxWidth: 8,
          boxHeight: 8,
          padding: 14,
        },
      },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: tooltipText,
        bodyColor: tooltipText,
        borderColor: isDark ? '#334155' : '#e2e8f0',
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
          font: {
            family: 'Plus Jakarta Sans',
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
          font: {
            family: 'Plus Jakarta Sans',
            size: 11,
          },
        },
      },
    },
  };
}
