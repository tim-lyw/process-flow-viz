import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import ChartWrapper from './ChartWrapper';
import { PieChartProps } from '../../types';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

/**
 * A reusable pie chart component
 */
function PieChart({ 
  title, 
  description, 
  data, 
  options, 
  height = 300,
  showPercentages = true 
}: PieChartProps) {
  
  // Default options if none provided
  const defaultOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        callbacks: showPercentages ? {
          label: (context) => {
            const total = context.dataset.data.reduce((sum: number, value: number) => sum + value, 0);
            const value = context.raw as number;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value.toFixed(1)} (${percentage}%)`;
          }
        } : undefined
      }
    }
  };

  return (
    <ChartWrapper title={title} description={description}>
      <div style={{ height }}>
        <Pie data={data} options={options || defaultOptions} />
      </div>
    </ChartWrapper>
  );
}

export default PieChart; 