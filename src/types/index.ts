// Table Types
export interface Column {
  key: string;
  header: string;
  sortable: boolean;
}

export interface TableProps {
  data: Record<string, any>[];
  columns: Column[];
  itemsPerPage?: number;
  title?: string;
}

export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  column: string | null;
  direction: SortDirection;
}

// Process Flow Types
export interface Node {
  id: string;
  name: string;
  type: 'type1' | 'type2' | 'type3';
}

export interface Edge {
  id: string;
  upstreamNodeId: string;
  downstreamNodeId: string;
}

export const NODE_TYPES = ['type1', 'type2', 'type3'] as const;

// Utility type for node lookup by ID
export type NodesById = Record<string, Node>;

// PageTabs Types
export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface PageTabsProps {
  tabs: Tab[];
  defaultActiveTab?: string;
}

// ProcessFlow Component Props
export interface ProcessFlowProps {
  nodes: Node[];
  edges: Edge[];
  onAddNode: (nodeData: Omit<Node, 'id'>) => void;
  onUpdateNode: (id: string, nodeData: Omit<Node, 'id'>) => void;
  onDeleteNode: (id: string) => void;
  onAddEdge: (edgeData: Omit<Edge, 'id'>) => void;
  onUpdateEdge: (id: string, edgeData: Omit<Edge, 'id'>) => void;
  onDeleteEdge: (id: string) => void;
}

// Modal Props
export interface NodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (node: Omit<Node, 'id'>) => void;
  node?: Node;
}

export interface EdgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (edge: Omit<Edge, 'id'>) => void;
  edge?: Edge;
  nodes: Node[];
}

export interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// ProcessFlowCanvas Props
export interface ProcessFlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
} 