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

// Generate beautiful, vibrant colors for the pie chart
const PIE_COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f43f5e', // rose
  '#f59e0b', // amber
  '#10b981', // emerald
  '#0ea5e9', // sky
  '#6366f1', // indigo
];

export default function PopulationPieChart({ data }: Props) {
  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'US Population',
        data: data.map(item => item.value),
        backgroundColor: PIE_COLORS.slice(0, data.length),
        borderColor: '#1e293b',
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
        position: 'right' as const,
        labels: {
          color: '#f8fafc',
          font: {
            family: "'Inter', sans-serif",
            size: 13
          },
          padding: 20
        }
      },
      title: {
        display: true,
        text: 'Population Share by Year (Pie Chart)',
        color: '#f8fafc',
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
        backgroundColor: 'rgba(30, 41, 59, 0.9)',
        titleColor: '#f8fafc',
        bodyColor: '#e2e8f0',
        borderColor: '#334155',
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
