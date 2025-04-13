import { useEffect, useState } from 'react';
import { BarChart, PieChart, ScatterChart, RadarChart } from '../Charts';
import mockResults from '../../mock_results 1.json';
import { ChartData } from 'chart.js';

function Analytics() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (mockResults && mockResults.data) {
        setData(mockResults.data);
      } else {
        setError('Mock results data is invalid or missing');
      }
    } catch (err) {
      setError('Error loading analytics data');
      console.error('Error loading analytics data:', err);
    }
  }, []);

  if (error) {
    return (
      <div className="p-8 text-center text-red-400">
        <p>Error: {error}</p>
        <p className="mt-4 text-sm text-gray-400">
          Please make sure the mock_results 1.json file is present and correctly formatted.
        </p>
      </div>
    );
  }

  if (!data) {
    return <div className="p-8 text-center text-gray-400">Loading data...</div>;
  }

  // Extract data for KPI distribution chart
  const kpiValues = data.simulated_summary?.simulated_data.map((scenario: any) => scenario.kpi_value) || [];
  const kpiName = data.simulated_summary?.simulated_data[0]?.kpi || 'KPI';

  // Calculate KPI statistics
  const kpiMin = Math.min(...kpiValues);
  const kpiMax = Math.max(...kpiValues);
  const kpiAvg = kpiValues.reduce((sum: number, val: number) => sum + val, 0) / kpiValues.length;

  // Create histogram data from KPI values
  const kpiHistogram = createHistogramData(kpiValues, 8);

  // Create data for variable impact chart
  const variableImpactData: ChartData<'bar'> = {
    labels: Object.keys(data.top_impact).map(key =>
      key === 'Others'
        ? 'Others'
        : key.split('.').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
    ),
    datasets: [
      {
        label: 'Impact Weightage',
        data: Object.values(data.top_impact) as number[],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Create scatter data for KPI by variable
  const selectedVariable = data.top_variables?.[0] || null;
  const scatterData: ChartData<'scatter'> = {
    datasets: [{
      label: selectedVariable
        ? `KPI vs ${selectedVariable.equipment} ${selectedVariable.name}`
        : 'No data',
      data: selectedVariable ? createScatterPoints(data, selectedVariable) : [],
      backgroundColor: 'rgba(53, 162, 235, 0.6)',
      borderColor: 'rgba(53, 162, 235, 1)',
      pointRadius: 6,
      pointHoverRadius: 8,
    }]
  };

  // Create radar data for scenario comparison
  const radarData = createRadarChartData(data);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-6">

      {/* KPI Distribution Chart */}
      <div className="bg-gray-800 rounded-lg p-4 shadow-md">
        <BarChart
          title="KPI Distribution"
          description={`Distribution of ${kpiName} values across all scenarios. 
              Range: ${kpiMin.toFixed(1)} to ${kpiMax.toFixed(1)}, Average: ${kpiAvg.toFixed(1)}`}
          data={kpiHistogram}
        />
      </div>

      {/* Top Variables Impact Chart */}
      <div className="bg-gray-800 rounded-lg p-4 shadow-md">
        <BarChart
          title="Top Variables Impact"
          description="Relative impact of key variables on the KPI performance, showing which factors have the greatest influence."
          data={variableImpactData}
          horizontal={true}
        />
      </div>

      {/* KPI by Variable Chart */}
      <div className="bg-gray-800 rounded-lg p-4 shadow-md">
        <ScatterChart
          title="KPI by Variable Value"
          description="Relationship between the selected variable's value and the resulting KPI value across scenarios."
          data={scatterData}
          xAxisLabel={selectedVariable ? `${selectedVariable.equipment} ${selectedVariable.name} (${selectedVariable.unit})` : ''}
          yAxisLabel={kpiName}
        />
      </div>

      {/* Scenario Comparison Chart */}
      <div className="bg-gray-800 rounded-lg p-4 shadow-md">
        <RadarChart
          title="Top Scenarios Comparison"
          description="Comparison of the top 5 scenarios across key variables, showing the relationship between variable values and KPI performance."
          data={radarData}
        />
      </div>

      {/* Variable Impact Distribution - Full width */}
      <div className="bg-gray-800 rounded-lg p-4 shadow-md">
        <PieChart
          title="Variable Impact Distribution"
          description={`${data.impact_summary_text || ''} The chart shows the proportional impact of each variable on the KPI.`}
          data={createPieData(data)}
        />
      </div>
      </div>
    </div>
  );
}

// Helper function to create histogram data
function createHistogramData(values: number[], binCount: number): ChartData<'bar'> {
  if (values.length === 0) {
    return {
      labels: [],
      datasets: [{
        label: 'Frequency',
        data: [],
        backgroundColor: 'rgba(53, 162, 235, 0.6)',
        borderColor: 'rgba(53, 162, 235, 1)',
        borderWidth: 1,
      }]
    };
  }

  // Find min and max values to create bins
  const min = Math.min(...values);
  const max = Math.max(...values);

  // Create bins
  const binWidth = (max - min) / binCount;
  const bins = Array(binCount).fill(0);
  const binLabels = Array(binCount).fill(0).map((_, i) =>
    `${(min + i * binWidth).toFixed(0)}-${(min + (i + 1) * binWidth).toFixed(0)}`
  );

  // Count values in each bin
  values.forEach(value => {
    const binIndex = Math.min(Math.floor((value - min) / binWidth), binCount - 1);
    bins[binIndex]++;
  });

  return {
    labels: binLabels,
    datasets: [
      {
        label: 'Frequency',
        data: bins,
        backgroundColor: 'rgba(53, 162, 235, 0.6)',
        borderColor: 'rgba(53, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };
}

// Helper function to create scatter chart points
function createScatterPoints(data: any, selectedVariable: any): { x: number; y: number }[] {
  if (!data?.simulated_summary?.simulated_data) {
    return [];
  }
  
  console.log('Selected variable:', selectedVariable);
  
  // Convert values to numbers and ensure they are valid
  const points = data.simulated_summary.simulated_data
    .map((scenario: any) => {
      let variableValue = null;
      
      // Iterate through all equipment specifications to find the right equipment
      for (const equipSpec of scenario.equipment_specification) {
        if (equipSpec.equipment === selectedVariable.equipment) {
          // Check all variables in this equipment spec
          for (const variable of equipSpec.variables) {
            // Check for different name formats that might be used
            const varName = variable.name.toLowerCase();
            const selectedVarName = selectedVariable.name.toLowerCase();
            
            // Match if names are the same or if one includes the other with equipment prefix
            if (
              varName === selectedVarName || 
              varName === `${selectedVariable.equipment.toLowerCase()} - ${selectedVarName}` ||
              varName.includes(selectedVarName)
            ) {
              variableValue = Number(variable.value);
              break;
            }
          }
        }
      }
      
      if (variableValue === null) return null;
      
      return {
        x: variableValue,
        y: Number(scenario.kpi_value)
      };
    })
    .filter((point: any) => point !== null) as { x: number; y: number }[];
  
  console.log('Scatter points:', points);
  return points;
}

// Helper function to create radar chart data
function createRadarChartData(data: any): ChartData<'radar'> {
  if (!data?.simulated_summary?.simulated_data || !data?.top_variables) {
    return { 
      labels: [], 
      datasets: [] 
    };
  }
  
  // Get the top 5 scenarios by KPI value
  const scenarios = [...data.simulated_summary.simulated_data]
    .sort((a: any, b: any) => b.kpi_value - a.kpi_value)
    .slice(0, 5);
  
  console.log('Top scenarios:', scenarios.map(s => s.scenario));
  
  // Get variables to display (use only top 3 variables for clearer visualization)
  const keyVariables = data.top_variables.slice(0, 3).map((variable: any) => 
    `${variable.equipment}.${variable.name}`
  );
  
  // Find min/max values for normalization
  const variableRanges = keyVariables.reduce((acc: Record<string, { min: number, max: number }>, variableKey: string) => {
    const [equipment, name] = variableKey.split('.');
    
    let min = Infinity;
    let max = -Infinity;
    let found = false;
    
    // Find min and max for normalization
    data.simulated_summary.simulated_data.forEach((scenario: any) => {
      // Search through all equipment specs
      for (const equipSpec of scenario.equipment_specification) {
        if (equipSpec.equipment === equipment) {
          // Search through all variables
          for (const variable of equipSpec.variables) {
            // Match with flexible name patterns
            const varName = variable.name.toLowerCase();
            const searchName = name.toLowerCase();
            
            if (
              varName === searchName || 
              varName === `${equipment.toLowerCase()} - ${searchName}` ||
              varName.includes(searchName)
            ) {
              const value = Number(variable.value);
              min = Math.min(min, value);
              max = Math.max(max, value);
              found = true;
            }
          }
        }
      }
    });
    
    // Use default range if no matching variables found
    acc[variableKey] = found ? { min, max } : { min: 0, max: 100 };
    return acc;
  }, {});
  
  // Add KPI to the variables for comparison
  keyVariables.push('kpi');
  const kpiValues = data.simulated_summary.simulated_data.map((s: any) => Number(s.kpi_value));
  variableRanges['kpi'] = {
    min: Math.min(...kpiValues),
    max: Math.max(...kpiValues)
  };
  
  console.log('Variable ranges:', variableRanges);
  
  // Format labels for the radar chart
  const labels = keyVariables.map((key: string) => {
    if (key === 'kpi') return 'KPI Value';
    const [equipment, name] = key.split('.');
    return `${equipment} ${name.replace(/_/g, ' ')}`;
  });
  
  // Colors for the different scenarios
  const colors = [
    'rgba(255, 99, 132, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(255, 206, 86, 0.6)',
    'rgba(75, 192, 192, 0.6)',
    'rgba(153, 102, 255, 0.6)',
  ];
  
  const borderColors = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
  ];
  
  // Create datasets for each scenario
  const datasets = scenarios.map((scenario: any, index: number) => {
    const radarData = keyVariables.map((key: string) => {
      if (key === 'kpi') {
        // Normalize KPI value
        const normalizedValue = (Number(scenario.kpi_value) - variableRanges.kpi.min) / 
          (variableRanges.kpi.max - variableRanges.kpi.min);
        return normalizedValue;
      }
      
      const [equipment, name] = key.split('.');
      let variableValue = null;
      
      // Find the variable in this scenario with flexible matching
      for (const equipSpec of scenario.equipment_specification) {
        if (equipSpec.equipment === equipment) {
          for (const variable of equipSpec.variables) {
            const varName = variable.name.toLowerCase();
            const searchName = name.toLowerCase();
            
            if (
              varName === searchName || 
              varName === `${equipment.toLowerCase()} - ${searchName}` ||
              varName.includes(searchName)
            ) {
              variableValue = Number(variable.value);
              break;
            }
          }
        }
      }
      
      if (variableValue === null) return 0;
      
      // Normalize the value
      const range = variableRanges[key];
      return (variableValue - range.min) / (range.max - range.min);
    });
    
    return {
      label: `${scenario.scenario} (KPI: ${Number(scenario.kpi_value).toFixed(1)})`,
      data: radarData,
      backgroundColor: colors[index % colors.length],
      borderColor: borderColors[index % borderColors.length],
      borderWidth: 1,
      pointBackgroundColor: borderColors[index % borderColors.length],
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: borderColors[index % borderColors.length],
    };
  });
  
  console.log('Radar datasets:', datasets);
  
  return {
    labels,
    datasets
  };
}

// Helper function to create pie chart data
function createPieData(data: any): ChartData<'pie'> {
  if (!data?.setpoint_impact_summary) {
    return {
      labels: [],
      datasets: [{
        label: 'Impact Weightage',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      }]
    };
  }

  // Combine setpoint and condition impact summaries
  const allImpacts = [
    ...(data.setpoint_impact_summary || []),
    ...(data.condition_impact_summary || [])
  ];

  // Sort by weightage (descending)
  allImpacts.sort((a: any, b: any) => b.weightage - a.weightage);

  // Create labels and values
  const labels = allImpacts.map((impact: any) =>
    `${impact.equipment} ${impact.setpoint || impact.condition || ''}`
  );

  const values = allImpacts.map((impact: any) => impact.weightage);

  return {
    labels,
    datasets: [
      {
        label: 'Impact Weightage',
        data: values,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
}

export default Analytics; 