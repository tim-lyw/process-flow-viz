import { useState } from 'react';
import Table from '../Table';
import { Column } from '../../types';
import ProcessFlowCanvas from './ProcessFlowCanvas';
import NodeModal from './modals/NodeModal';
import EdgeModal from './modals/EdgeModal';
import ConfirmationDialog from './modals/ConfirmationDialog';
import { Node, Edge, ProcessFlowProps } from '../../types';
import { FiPlus } from 'react-icons/fi';

function ProcessFlow({
    nodes,
    edges,
    onAddNode,
    onUpdateNode,
    onDeleteNode,
    onAddEdge,
    onUpdateEdge,
    onDeleteEdge
}: ProcessFlowProps) {
    // State for modals
    const [isNodeModalOpen, setIsNodeModalOpen] = useState(false);
    const [isEdgeModalOpen, setIsEdgeModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingNode, setEditingNode] = useState<Node | undefined>(undefined);
    const [editingEdge, setEditingEdge] = useState<Edge | undefined>(undefined);
    const [itemToDelete, setItemToDelete] = useState<{ type: 'node' | 'edge', id: string } | undefined>(undefined);

    // Table columns definition
    const nodeColumns: Column[] = [
        { key: 'name', header: 'Name', sortable: true },
        { key: 'type', header: 'Type', sortable: true },
        { key: 'actions', header: 'Actions', sortable: false },
    ];

    const edgeColumns: Column[] = [
        { key: 'upstreamNode', header: 'Upstream Node', sortable: true },
        { key: 'downstreamNode', header: 'Downstream Node', sortable: true },
        { key: 'actions', header: 'Actions', sortable: false },
    ];

    // Format nodes data for the table
    const nodesTableData = nodes.map(node => ({
        id: node.id,
        name: node.name,
        type: node.type,
        actions: (
            <div className="flex space-x-2">
                <button
                    onClick={() => handleEditNode(node)}
                    className="text-blue-400 hover:text-blue-300 p-1 cursor-pointer"
                >
                    Edit
                </button>
                <button
                    onClick={() => handleDeleteClick('node', node.id)}
                    className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                >
                    Delete
                </button>
            </div>
        ),
    }));

    // Create a mapping of node ids to node names for edge table
    const nodeNamesById = nodes.reduce<Record<string, string>>((acc, node) => {
        acc[node.id] = node.name;
        return acc;
    }, {});

    // Format edges data for the table
    const edgesTableData = edges.map(edge => ({
        id: edge.id,
        upstreamNode: nodeNamesById[edge.upstreamNodeId] || 'Unknown',
        downstreamNode: nodeNamesById[edge.downstreamNodeId] || 'Unknown',
        upstreamNodeId: edge.upstreamNodeId,
        downstreamNodeId: edge.downstreamNodeId,
        actions: (
            <div className="flex space-x-2">
                <button
                    onClick={() => handleEditEdge(edge)}
                    className="text-blue-400 hover:text-blue-300 p-1 cursor-pointer"
                >
                    Edit
                </button>
                <button
                    onClick={() => handleDeleteClick('edge', edge.id)}
                    className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                >
                    Delete
                </button>
            </div>
        ),
    }));

    // Handle opening the node modal for adding a new node
    const handleAddNode = () => {
        setEditingNode(undefined);
        setIsNodeModalOpen(true);
    };

    // Handle opening the node modal for editing an existing node
    const handleEditNode = (node: Node) => {
        setEditingNode(node);
        setIsNodeModalOpen(true);
    };

    // Handle saving a node (add or edit)
    const handleSaveNode = (nodeData: Omit<Node, 'id'>) => {
        if (editingNode) {
            // Edit existing node
            onUpdateNode(editingNode.id, nodeData);
        } else {
            // Add new node
            onAddNode(nodeData);
        }
        setIsNodeModalOpen(false);
    };

    // Handle opening the edge modal for adding a new edge
    const handleAddEdge = () => {
        setEditingEdge(undefined);
        setIsEdgeModalOpen(true);
    };

    // Handle opening the edge modal for editing an existing edge
    const handleEditEdge = (edge: Edge) => {
        setEditingEdge(edge);
        setIsEdgeModalOpen(true);
    };

    // Handle saving an edge (add or edit)
    const handleSaveEdge = (edgeData: Omit<Edge, 'id'>) => {
        if (editingEdge) {
            // Edit existing edge
            onUpdateEdge(editingEdge.id, edgeData);
        } else {
            // Add new edge
            onAddEdge(edgeData);
        }
        setIsEdgeModalOpen(false);
    };

    // Handle opening the delete confirmation dialog
    const handleDeleteClick = (type: 'node' | 'edge', id: string) => {
        setItemToDelete({ type, id });
        setIsDeleteModalOpen(true);
    };

    // Handle confirming deletion
    const handleConfirmDelete = () => {
        if (!itemToDelete) return;

        if (itemToDelete.type === 'node') {
            onDeleteNode(itemToDelete.id);
        } else {
            onDeleteEdge(itemToDelete.id);
        }

        setIsDeleteModalOpen(false);
        setItemToDelete(undefined);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col lg:flex-row gap-8">

                {/* Process Flow Visualization */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-4">Process Flow Visualization</h2>
                    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                        <ProcessFlowCanvas
                            nodes={nodes}
                            edges={edges}
                        />
                    </div>
                </div>

                <div className="flex flex-row gap-16 w-full justify-between">
                    {/* Node Table Section */}
                    <div className="w-1/2">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">Nodes</h2>
                            <button
                                onClick={handleAddNode}
                                className="w-7 h-7 flex items-center justify-center bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors cursor-pointer"
                                title="Add Node"
                                aria-label="Add Node"
                            >
                                <FiPlus size={16} />
                            </button>
                        </div>
                        <Table
                            data={nodesTableData}
                            columns={nodeColumns}
                            itemsPerPage={5}
                        />
                    </div>

                    {/* Edge Table Section */}
                    <div className="w-1/2">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">Edges</h2>
                            <button
                                type="button"
                                onClick={handleAddEdge}
                                className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors ${nodes.length < 2
                                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                    : 'bg-gray-800 text-white hover:bg-gray-700 cursor-pointer'}`}
                                disabled={nodes.length < 2}
                                title="Add Edge"
                                aria-label="Add Edge"
                            >
                                <FiPlus size={16} />
                            </button>
                        </div>
                        <Table
                            data={edgesTableData}
                            columns={edgeColumns}
                            itemsPerPage={5}
                        />
                    </div>

                </div>

            </div>



            {/* Modals */}
            <NodeModal
                isOpen={isNodeModalOpen}
                onClose={() => setIsNodeModalOpen(false)}
                onSave={handleSaveNode}
                node={editingNode}
            />

            <EdgeModal
                isOpen={isEdgeModalOpen}
                onClose={() => setIsEdgeModalOpen(false)}
                onSave={handleSaveEdge}
                edge={editingEdge}
                nodes={nodes}
            />

            <ConfirmationDialog
                isOpen={isDeleteModalOpen}
                title={`Delete ${itemToDelete?.type === 'node' ? 'Node' : 'Edge'}`}
                message={`Are you sure you want to delete this ${itemToDelete?.type}? ${itemToDelete?.type === 'node' ? 'This will also delete all connected edges.' : ''
                    }`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
            />
        </div>
    );
}

export default ProcessFlow; 