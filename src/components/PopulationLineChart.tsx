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

const crosshairPlugin = {
  id: 'crosshair',
  afterDraw: (chart: any) => {
    if (chart.tooltip?._active?.length) {
      const activePoint = chart.tooltip._active[0];
      const ctx = chart.ctx;
      const x = activePoint.element.x;
      const topY = chart.scales.y.top;
      const bottomY = chart.scales.y.bottom;
      
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, topY);
      ctx.lineTo(x, bottomY);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#94a3b8'; // slate-400
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.restore();
    }
  }
};

export default function PopulationLineChart({ data }: Props) {
  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Populasi AS',
        data: data.map(item => item.value),
        borderColor: '#2563eb', // blue-600
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        pointBackgroundColor: '#2563eb',
        pointBorderColor: '#ffffff',
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: '#2563eb',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#334155', // slate-700
          font: {
            family: "'Inter', sans-serif",
            size: 14
          }
        }
      },
      title: {
        display: false,
        text: 'Pertumbuhan Populasi AS (Line Chart)',
        color: '#0f172a', // slate-900
        font: {
          family: "'Inter', sans-serif",
          size: 16,
          weight: 'bold' as const
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
          color: '#64748b', // slate-500
          callback: function(value: any) {
            return new Intl.NumberFormat('en-US', {
              notation: "compact",
              compactDisplay: "short"
            }).format(value);
          }
        },
        grid: {
          color: '#f1f5f9', // slate-100
        }
      },
      x: {
        ticks: {
          color: '#64748b', // slate-500
        },
        grid: {
          color: '#f1f5f9', // slate-100
        }
      }
    }
  };

  return <Line data={chartData} options={options} plugins={[crosshairPlugin]} />;
}
