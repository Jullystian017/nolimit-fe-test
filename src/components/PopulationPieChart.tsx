"use client";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { PopulationData } from '@/lib/api';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface Props {
  data: PopulationData[];
}

// Generate beautiful, high-contrast vibrant colors for the pie chart
const PIE_COLORS = [
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#8b5cf6', // violet-500
  '#f43f5e', // rose-500
  '#06b6d4', // cyan-500
  '#f97316', // orange-500
  '#d946ef', // fuchsia-500
  '#14b8a6', // teal-500
  '#84cc16', // lime-500
  '#6366f1', // indigo-500
  '#ec4899', // pink-500
];

export default function PopulationPieChart({ data }: Props) {
  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Populasi AS',
        data: data.map(item => item.value),
        backgroundColor: data.map((_, i) => PIE_COLORS[i % PIE_COLORS.length]),
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#334155', // slate-700
          font: {
            family: "'Inter', sans-serif",
            size: 12
          },
          padding: 12
        }
      },
      title: {
        display: false,
        text: 'Proporsi Populasi per Tahun (Pie Chart)',
        color: '#0f172a', // slate-900
        font: {
          family: "'Inter', sans-serif",
          size: 16,
          weight: 'bold' as const
        },
        padding: {
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)', // slate-900
        titleColor: '#f8fafc',
        bodyColor: '#e2e8f0',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function(context: any) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += new Intl.NumberFormat('en-US').format(context.parsed);
            }
            return label;
          }
        }
      }
    }
  };

  return <Pie data={chartData} options={options} />;
}
