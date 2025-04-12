import './App.css';
import Table from './components/Table';
import PageTabs from './components/PageTabs';
import tableData from './mockTableData.json';

function App() {
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
      label: 'Task 2',
      content: (<></>)
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
