import { useState, useEffect } from 'react';
import { Node, NODE_TYPES, NodeModalProps } from '../../../types';
import { FiChevronDown } from 'react-icons/fi';

function NodeModal({ isOpen, onClose, onSave, node }: NodeModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<Node['type']>('type1');
  const [nameError, setNameError] = useState('');

  // Reset form when modal opens/closes or node changes
  useEffect(() => {
    if (isOpen) {
      setName(node?.name || '');
      setType(node?.type || 'type1');
      setNameError('');
    }
  }, [isOpen, node]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!name.trim()) {
      setNameError('Name is required');
      return;
    }
    
    onSave({ name: name.trim(), type });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">
          {node ? 'Edit Node' : 'Add Node'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Node Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError('');
              }}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter node name"
            />
            {nameError && (
              <p className="mt-1 text-sm text-red-500">{nameError}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1">
              Node Type
            </label>
            <div className="relative">
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as Node['type'])}
                className="w-full p-2 pr-8 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                {NODE_TYPES.map((nodeType) => (
                  <option key={nodeType} value={nodeType}>
                    {nodeType}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                <FiChevronDown size={16} />
              </div>
            </div>
          </div>
          
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

export default NodeModal; 