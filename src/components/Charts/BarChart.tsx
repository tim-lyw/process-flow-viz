import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import ChartWrapper from './ChartWrapper';
import { BarChartProps } from '../../types';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

/**
 * A reusable bar chart component
 */
function BarChart({ 
  title, 
  description, 
  data, 
  options, 
  height = 300,
  horizontal = false 
}: BarChartProps) {
  
  // Default options if none provided
  const defaultOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? 'y' : 'x',
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
      x: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        }
      },
      y: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        }
      }
    }
  };

  return (
    <ChartWrapper title={title} description={description}>
      <div style={{ height }}>
        <Bar data={data} options={options || defaultOptions} />
      </div>
    </ChartWrapper>
  );
}

export default BarChart; 