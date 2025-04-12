import { useEffect, useMemo } from 'react';
import ReactFlow, {
  Background,
  Edge as ReactFlowEdge,
  Node as ReactFlowNode,
  Position,
  MarkerType,
  useReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';
import { ProcessFlowCanvasProps } from '../../types';

// Map node types to colors for visual distinction
const typeColors: Record<string, string> = {
  type1: '#3498db', // Blue
  type2: '#2ecc71', // Green
  type3: '#e74c3c', // Red
};

// Node style based on type
const getNodeStyle = (nodeType: string) => {
  return {
    background: typeColors[nodeType] || '#6b7280',
    color: 'white',
    border: '1px solid #374151',
    borderRadius: '5px',
    padding: '10px',
    width: 150,
  };
};

// Helper function to apply a hierarchical layout using dagre
const getLayoutedElements = (nodes: ReactFlowNode[], edges: ReactFlowEdge[], direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction });

  // Set node dimensions and positions
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 170, height: 60 });
  });

  // Add edges to the graph
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Calculate layout
  dagre.layout(dagreGraph);

  // Apply layout to nodes
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWithPosition.width / 2,
        y: nodeWithPosition.y - nodeWithPosition.height / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

// Actual Flow component
function Flow({ nodes, edges }: ProcessFlowCanvasProps) {
  const { fitView } = useReactFlow();
  // Using a fixed LR (left to right) direction
  const direction = 'LR';

  // Convert our nodes to React Flow nodes
  const initialNodes = useMemo<ReactFlowNode[]>(() => {
    return nodes.map((node) => ({
      id: node.id,
      data: { 
        label: (
          <div>
            <div style={{ fontWeight: 'bold' }}>{node.name}</div>
            <div style={{ fontSize: '0.8rem' }}>{node.type}</div>
          </div>
        ) 
      },
      type: 'default',
      position: { x: 0, y: 0 }, // Will be set by dagre layout
      style: getNodeStyle(node.type),
      // For LR layout, source is right and target is left
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    }));
  }, [nodes]);

  // Convert our edges to React Flow edges
  const initialEdges = useMemo<ReactFlowEdge[]>(() => {
    return edges.map(edge => ({
      id: edge.id,
      source: edge.upstreamNodeId,
      target: edge.downstreamNodeId,
      type: 'smoothstep',
      animated: false,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: '#9ca3af',
      },
      style: { stroke: '#9ca3af', strokeWidth: 2 },
    }));
  }, [edges]);

  // Apply layout
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    return getLayoutedElements(initialNodes, initialEdges, direction);
  }, [initialNodes, initialEdges]);

  // Use state for React Flow nodes and edges
  const [reactFlowNodes, setReactFlowNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [reactFlowEdges, setReactFlowEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  // Update nodes and edges when our data changes
  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = getLayoutedElements(
      initialNodes,
      initialEdges,
      direction
    );
    setReactFlowNodes(newNodes);
    setReactFlowEdges(newEdges);
    
    // Fit view after a short delay to ensure layout is ready
    setTimeout(() => {
      fitView({ padding: 0.2 });
    }, 100);
  }, [initialNodes, initialEdges, setReactFlowNodes, setReactFlowEdges, fitView]);

  return (
    <ReactFlow
      nodes={reactFlowNodes}
      edges={reactFlowEdges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
      fitView
      attributionPosition="top-right"
      zoomOnScroll={true}
      panOnScroll={false}
      zoomOnDoubleClick={false}
    >
      <Background color="#374151" gap={16} />
    </ReactFlow>
  );
}

// Wrapper component with provider
function ProcessFlowCanvas({ nodes, edges }: ProcessFlowCanvasProps) {
  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 h-64">
        <p className="text-gray-400">Add nodes and edges to visualize the process flow</p>
      </div>
    );
  }

  return (
    <div style={{ height: 500 }}>
      <ReactFlowProvider>
        <Flow nodes={nodes} edges={edges} />
      </ReactFlowProvider>
    </div>
  );
}

export default ProcessFlowCanvas; 