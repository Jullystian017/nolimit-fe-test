"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { PopulationData } from '@/lib/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Props {
  data: PopulationData[];
}

export default function PopulationLineChart({ data }: Props) {
  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'US Population',
        data: data.map(item => item.value),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#8b5cf6',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#f8fafc',
          font: {
            family: "'Inter', sans-serif",
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: 'US Population Growth (Line Chart)',
        color: '#f8fafc',
        font: {
          family: "'Inter', sans-serif",
          size: 16,
          weight: 'bold' as const
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
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US').format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          color: '#94a3b8',
          callback: function(value: any) {
            return new Intl.NumberFormat('en-US', {
              notation: "compact",
              compactDisplay: "short"
            }).format(value);
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        }
      },
      x: {
        ticks: {
          color: '#94a3b8',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        }
      }
    }
  };

  return <Line data={chartData} options={options} />;
}
