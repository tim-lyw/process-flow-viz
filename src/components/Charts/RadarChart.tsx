import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import ChartWrapper from './ChartWrapper';
import { RadarChartProps } from '../../types';

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

/**
 * A reusable radar chart component
 */
function RadarChart({ 
  title, 
  description, 
  data, 
  options,
  height = 300,
  fill = true
}: RadarChartProps) {
  
  // Default options if none provided
  const defaultOptions: ChartOptions<'radar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      }
    },
    scales: {
      r: {
        angleLines: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
        pointLabels: {
          color: 'rgba(255, 255, 255, 0.8)',
        },
        ticks: {
          backdropColor: 'transparent',
          color: 'rgba(255, 255, 255, 0.7)',
        }
      }
    }
  };
  
  // Apply fill setting to all datasets
  const chartData = fill !== undefined ? {
    ...data,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      fill
    }))
  } : data;

  return (
    <ChartWrapper title={title} description={description}>
      <div style={{ height }}>
        <Radar data={chartData} options={options || defaultOptions} />
      </div>
    </ChartWrapper>
  );
}

export default RadarChart; 