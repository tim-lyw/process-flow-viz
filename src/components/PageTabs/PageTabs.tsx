import { useState } from 'react';
import { PageTabsProps } from '../../types';

function PageTabs({ tabs, defaultActiveTab }: PageTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0]?.id);

  // Get the currently active tab content
  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className="flex flex-col h-full">
      {/* Tab navigation */}
      <div className="border-b border-gray-700 mb-4">
        <nav className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-medium text-sm hover:cursor-pointer transition-colors duration-200 ease-in-out ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-400'
                  : 'text-gray-400 hover:text-gray-200 hover:border-b-2 hover:border-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div className="flex-grow p-4">
        {activeTabContent}
      </div>
    </div>
  );
}

export default PageTabs; 