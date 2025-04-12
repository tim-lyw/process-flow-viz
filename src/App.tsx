import { useState } from 'react';
import './App.css';
import Table from './components/Table';
import PageTabs from './components/PageTabs';
import ProcessFlow from './components/ProcessFlow';
import tableData from './mockTableData.json';
import { Node, Edge } from './types';
import { v4 as uuidv4 } from 'uuid';

function App() {
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
      label: 'Task 3',
      content: (<></>)
    },
    {
      id: 'task4',
      label: 'Task 4',
      content: (<></>)
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
    </div>
  );
}

export default App;
