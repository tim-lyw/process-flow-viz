import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import ChartWrapper from './ChartWrapper';
import { ScatterChartProps } from '../../types';

// Register Chart.js components
ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

/**
 * A reusable scatter chart component
 */
function ScatterChart({ 
  title, 
  description, 
  data, 
  options, 
  height = 300,
  xAxisLabel,
  yAxisLabel
}: ScatterChartProps) {
  
  // Default options if none provided
  const defaultOptions: ChartOptions<'scatter'> = {
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
      x: {
        title: {
          display: !!xAxisLabel,
          text: xAxisLabel || '',
          color: 'rgba(255, 255, 255, 0.8)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        }
      },
      y: {
        title: {
          display: !!yAxisLabel,
          text: yAxisLabel || '',
          color: 'rgba(255, 255, 255, 0.8)',
        },
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
        <Scatter data={data} options={options || defaultOptions} />
      </div>
    </ChartWrapper>
  );
}

export default ScatterChart; 