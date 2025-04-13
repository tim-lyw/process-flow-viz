import { useState, useEffect } from 'react';
import { EdgeModalProps } from '../../../types';
import { FiChevronDown } from 'react-icons/fi';

function EdgeModal({ isOpen, onClose, onSave, edge, nodes }: EdgeModalProps) {
  const [upstreamNodeId, setUpstreamNodeId] = useState('');
  const [downstreamNodeId, setDownstreamNodeId] = useState('');
  const [error, setError] = useState('');

  // Reset form when modal opens/closes or edge changes
  useEffect(() => {
    if (isOpen) {
      setUpstreamNodeId(edge?.upstreamNodeId || '');
      setDownstreamNodeId(edge?.downstreamNodeId || '');
      setError('');
    }
  }, [isOpen, edge]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!upstreamNodeId) {
      setError('Upstream node is required');
      return;
    }
    
    if (!downstreamNodeId) {
      setError('Downstream node is required');
      return;
    }
    
    if (upstreamNodeId === downstreamNodeId) {
      setError('Upstream and downstream nodes must be different');
      return;
    }
    
    onSave({ upstreamNodeId, downstreamNodeId });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">
          {edge ? 'Edit Edge' : 'Add Edge'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="upstreamNode" className="block text-sm font-medium text-gray-300 mb-1">
              Upstream Node
            </label>
            <div className="relative">
              <select
                id="upstreamNode"
                value={upstreamNodeId}
                onChange={(e) => {
                  setUpstreamNodeId(e.target.value);
                  setError('');
                }}
                className="w-full p-2 pr-8 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="">Select Upstream Node</option>
                {nodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.name} ({node.type})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                <FiChevronDown size={16} />
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="downstreamNode" className="block text-sm font-medium text-gray-300 mb-1">
              Downstream Node
            </label>
            <div className="relative">
              <select
                id="downstreamNode"
                value={downstreamNodeId}
                onChange={(e) => {
                  setDownstreamNodeId(e.target.value);
                  setError('');
                }}
                className="w-full p-2 pr-8 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="">Select Downstream Node</option>
                {nodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.name} ({node.type})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                <FiChevronDown size={16} />
              </div>
            </div>
          </div>
          
          {error && (
            <p className="mb-4 text-sm text-red-500">{error}</p>
          )}
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EdgeModal; 