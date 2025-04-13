import { useState, useEffect } from 'react';
import './App.css';
import Table from './components/Table';
import PageTabs from './components/PageTabs';
import ProcessFlow from './components/ProcessFlow';
import tableData from './mockTableData.json';
import { Node, Edge } from './types';
import { v4 as uuidv4 } from 'uuid';
import Report from './components/Report/Report';
import Analytics from './components/Analytics';
import FutureImprovementsModal from './components/FutureImprovementsModal';

function App() {
  // State to control the modal visibility
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Initialize the report prompt directly in state
  const [reportPrompt, setReportPrompt] = useState<string>(`
   You are an expert report generator. Your task is to create a professional and cohesive HTML report based on the provided JSON data. I will attach the json data at the bottom of this instruction set. The goal of this report is to summarize the results of experiments run to tune a Key Performance Indicator (KPI) and identify the variables that contributed the most to improving it. The generated HTML should be valid and directly usable for conversion to a PDF document or printing from a browser.

**Crucially, ensure the report is consistent in structure and style across different runs, provides meaningful insights, has professional styling, uses consistent titles, and displays all data from the JSON in some form. Furthermore, analyze the data to determine the most insightful way to visually represent key findings using appropriate charts or graphs within the report. Ensure that all generated charts effectively communicate the data, have clear titles, and all necessary axes and legends are appropriately labeled based on the data being visualized.**

**Detailed Instructions:**

1.  **Analyze the Data and Structure the Report Consistently:**
    * Carefully analyze the provided JSON data to understand its content and relationships.
    * The main title of the report should be "KPI Optimization Report".
    * Structure the report into the following sections with these exact titles:
        * **Executive Summary**
        * **Top KPI Influencers**
        * **Variable Analysis**
        * **Experimental Results**
        * **Conclusion**
    * Maintain this section order and naming convention in every report generated.
    * These titles should be left aligned.

2.  **Generate Insightful Content and Visualizations:**
    * **Executive Summary:**
        * Use 'main_summary_text' and 'top_summary_text' to provide a concise overview of the experiment's purpose and key findings.
        * Go beyond simply stating the summaries; interpret them. For example, highlight the overall trend in KPI improvement, the significance of the top variables, and any limitations or caveats mentioned.
        * Mention the number of scenarios analyzed and the range of KPI values observed.
        * **Analyze the data to determine the most insightful chart or graph to represent the range or distribution of KPI values across all scenarios.** Consider options like histograms, box plots, or other appropriate visualizations.
    * **Top KPI Influencers:**
        * Analyze the 'top_impact' and 'top_variables' data to identify the most critical variables affecting the KPI.
        * Present this analysis in a table (as specified below).
        * Provide insight into the *relative importance* of each variable based on its weightage. Discuss the practical implications of these findings.
        * **Analyze the 'top_impact' and 'top_variables' data to choose the best chart or graph to visualize the relative impact of the top variables.** Bar charts are a likely candidate, but consider other options if the data suggests them.
    * **Variable Analysis:**
        * Use 'impact_summary_text', 'setpoint_impact_summary', and 'condition_impact_summary' to give a detailed analysis of how different types of variables (setpoints and conditions) affect the KPI.
        * If possible, identify any interactions or dependencies between variables.
        * Present the details from 'setpoint_impact_summary' and 'condition_impact_summary' in separate tables.
        * **Analyze the data within 'setpoint_impact_summary' and 'condition_impact_summary' to determine if charts or graphs can effectively visualize the impact of specific setpoints or conditions on the KPI.** Consider bar charts, line charts, or other suitable visualizations based on the data structure.
    * **Experimental Results:**
        * Display *all* scenarios and their corresponding data from the main 'data' array in a comprehensive table.
        * **Analyze the 'data' array to determine if a scatter plot or other type of chart could effectively visualize the relationship between key variables and the KPI value across all scenarios.** Decide which variables would be most informative to visualize.
    * **Conclusion:**
        * Summarize the key findings and provide recommendations for future experiments or adjustments to the process.

3.  **Apply Professional and Consistent Styling:**
    * Use inline CSS styles to format the report for a professional appearance suitable for printing or PDF conversion.
    * **Consistent Font Family and Size:** Use a serif font (e.g., "Georgia", "Times New Roman") for body text and a sans-serif font (e.g., "Arial", "Helvetica") for headings. Set the base font size to 12pt for body text and adjust heading sizes accordingly.
    * **Heading Styles:**
        * Use '<h1>' for main section titles (e.g., "Executive Summary").
        * Use '<h2>' for table titles or sub-section titles, as well as titles for any generated charts or graphs.
        * Use '<h3>' for any further sub-divisions within tables (if needed).
        * Ensure consistent use of font weight, color, and spacing for headings.
    * **Table Styles:**
        * Use borders, padding, and alternating row colors for tables to improve readability.
        * Ensure table headers are clearly distinguishable (e.g., using a different background color or font weight).
        * Specify column widths appropriately to prevent content overflow.
    * **Chart/Graph Styling:**
        * **For simplicity and compatibility with PDF conversion, consider using text-based or simple SVG charts/graphs rendered directly in the HTML.** If SVG is used, ensure it's embedded directly within the HTML.
        * **Ensure all generated charts have clear titles (using <h2>) that describe the visualization. All necessary axes must be labeled with the variable or metric they represent, and legends should be included if multiple data series are present.** The labels should be derived directly from the data being visualized.
        * Maintain a consistent color scheme for all visualizations.
    * **Page Layout (A4):**
        * Control line height and spacing for better readability.
    * **Emphasis:** Use bold or italic text sparingly for emphasis.
    * **Color Palette:** Use a limited and professional color palette (e.g., shades of gray, with a subtle accent color if desired).
    * **Spacing:** Use consistent spacing between paragraphs, headings, and table elements, as well as around charts and graphs.

4.  **Ensure Comprehensive Data Display:**
    * The report *must* include all relevant data from the JSON.
    * Do not include any hidden elements (like in scrollable containers) in the report, as the report will be printed.
    * The 'Experimental Results' section, in particular, should present all scenarios and their data points from the 'data' array in a table. The charts and graphs should *supplement* this data, not replace it entirely.

5.  **Generate HTML Code:**
    * Write the HTML code for the report, enclosed within a single \`<div>\` element.
    * Apply all CSS styling directly as inline styles to each HTML element.
    * Do not include \`<!DOCTYPE html>\`, \`<html>\`, \`<head>\`, or \`<body>\` tags.
  `);

  // State for the uploaded JSON data
  const [reportData, setReportData] = useState<any>(null);

  // State for process flow visualization (moved from ProcessFlow component)
  const [nodes, setNodes] = useState<Node[]>([
    // Add some initial test nodes in a hierarchical structure
    {
      id: 'A',
      name: 'A',
      type: 'type1'
    },
    {
      id: 'B1',
      name: 'B1',
      type: 'type1'
    },
    {
      id: 'B2',
      name: 'B2',
      type: 'type1'
    },
    {
      id: 'B3',
      name: 'B3',
      type: 'type1'
    },
    {
      id: 'C1',
      name: 'C1',
      type: 'type2'
    },
    {
      id: 'C2',
      name: 'C2',
      type: 'type3'
    },
    {
      id: 'D',
      name: 'D',
      type: 'type3'
    }
  ]);

  const [edges, setEdges] = useState<Edge[]>([
    // Add edges to create a hierarchical flow
    {
      id: 'e1',
      upstreamNodeId: 'A',
      downstreamNodeId: 'B1'
    },
    {
      id: 'e2',
      upstreamNodeId: 'A',
      downstreamNodeId: 'B2'
    },
    {
      id: 'e3',
      upstreamNodeId: 'A',
      downstreamNodeId: 'B3'
    },
    {
      id: 'e4',
      upstreamNodeId: 'B1',
      downstreamNodeId: 'C1'
    },
    {
      id: 'e5',
      upstreamNodeId: 'B2',
      downstreamNodeId: 'C2'
    },
    {
      id: 'e6',
      upstreamNodeId: 'B3',
      downstreamNodeId: 'C2'
    },
    {
      id: 'e7',
      upstreamNodeId: 'C2',
      downstreamNodeId: 'D'
    },
    {
      id: 'e8',
      upstreamNodeId: 'C1',
      downstreamNodeId: 'D'
    }
  ]);

  useEffect(() => {
    setTimeout(() => {
      setIsModalOpen(true)
    }, 1000);
  }, []);

  // Handler for adding a new node
  const handleAddNode = (nodeData: Omit<Node, 'id'>) => {
    const newNode: Node = {
      id: uuidv4(),
      ...nodeData,
    };
    setNodes(prevNodes => [...prevNodes, newNode]);
  };

  // Handler for updating an existing node
  const handleUpdateNode = (id: string, nodeData: Omit<Node, 'id'>) => {
    setNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === id ? { ...node, ...nodeData } : node
      )
    );
  };

  // Handler for deleting a node
  const handleDeleteNode = (id: string) => {
    setNodes(prevNodes => prevNodes.filter(node => node.id !== id));
  };

  // Handler for adding a new edge
  const handleAddEdge = (edgeData: Omit<Edge, 'id'>) => {
    const newEdge: Edge = {
      id: uuidv4(),
      ...edgeData,
    };
    setEdges(prevEdges => [...prevEdges, newEdge]);
  };

  // Handler for updating an existing edge
  const handleUpdateEdge = (id: string, edgeData: Omit<Edge, 'id'>) => {
    setEdges(prevEdges =>
      prevEdges.map(edge =>
        edge.id === id ? { ...edge, ...edgeData } : edge
      )
    );
  };

  // Handler for deleting an edge
  const handleDeleteEdge = (id: string) => {
    setEdges(prevEdges => prevEdges.filter(edge => edge.id !== id));
  };

  // When a node is deleted, remove all edges connected to it
  const handleNodeDeletion = (id: string) => {
    handleDeleteNode(id);

    // Remove all edges connected to this node
    const nodeIds = new Set(nodes.filter(node => node.id !== id).map(node => node.id));
    setEdges(prevEdges =>
      prevEdges.filter(edge =>
        nodeIds.has(edge.upstreamNodeId) &&
        nodeIds.has(edge.downstreamNodeId)
      )
    );
  };

  // Define the tabs for the different tasks
  const tabs = [
    {
      id: 'task1',
      label: 'Task 1: Reusable AIO Table',
      content: (
        <Table
          data={tableData.data}
          columns={tableData.columns}
          itemsPerPage={8}
          title="Simulation Data"
        />
      )
    },
    {
      id: 'task2',
      label: 'Task 2: Process Flow Visualization',
      content: (
        <ProcessFlow
          nodes={nodes}
          edges={edges}
          onAddNode={handleAddNode}
          onUpdateNode={handleUpdateNode}
          onDeleteNode={handleNodeDeletion}
          onAddEdge={handleAddEdge}
          onUpdateEdge={handleUpdateEdge}
          onDeleteEdge={handleDeleteEdge}
        />
      )
    },
    {
      id: 'task3',
      label: 'Task 3: Report Generator',
      content: (
        <Report
          prompt={reportPrompt}
          onPromptChange={setReportPrompt}
          reportData={reportData}
          onReportDataChange={setReportData}
        />
      )
    },
    {
      id: 'task4',
      label: 'Task 4: Analytics Dashboard',
      content: (<Analytics />)
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col text-gray-200">
      <header className="py-6 px-8 bg-gray-800 border-b border-gray-700">
        <h1 className="text-3xl font-bold text-white">Process First LLC</h1>
      </header>

      <main className="flex-grow px-8 py-6">
        <PageTabs tabs={tabs} defaultActiveTab="task1" />
      </main>

      {/* Future Improvements Modal */}
      <FutureImprovementsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}

export default App;
