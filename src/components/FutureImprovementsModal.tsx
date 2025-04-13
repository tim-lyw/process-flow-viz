interface FutureImprovementsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

function FutureImprovementsModal({ isOpen, onClose }: FutureImprovementsModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-xs">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-6xl w-full border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-4">Just some thoughts</h2>

                <div className="text-gray-300 mb-6 space-y-3">
                    <p>Hi! Thanks for taking the time to look through my implementation of the tasks. There's definitely a lot of things that could be improved - I left a bunch of them out to focus on the most important ones.</p>
                    <p>Given more time, here's what I would do to improve on the implementation:</p>

                    <ol className="list-decimal pl-6 space-y-2">
                        <li>Implement custom hooks for state management (useProcessFlow, useReportGenerator) to reduce App.tsx complexity and separate concerns.</li>
                        <li>Currently, navigating out of the report page and back in will reset the process flow. This is not ideal from a UX perspective - a custom hook will solve this.</li>
                        <li>Extract the initial process flow data (nodes and edges) into a separate configuration file for better maintainability and testing.</li>
                        <li>Optimize handler functions with useCallback to prevent unnecessary re-renders when state objects change.</li>
                        <li>Generally moving more reused logic and css into reusable components</li>
                        <li>Create a dedicated Context provider, or a state management library like Zustand, for shared state that multiple components need to access, reducing prop drilling.</li>
                        <li>Implement better error handling and validation for node/edge operations and report data processing.</li>
                        <li>Extract the large reportPrompt string into a separate configuration file to improve readability of the main component.</li>
                        <li>Implement a more robust state persistence mechanism (localStorage or backend) to preserve user-created process flows between sessions.</li>
                        <li>Optimize the prompt for report generation to alleviate the non-deterministic nature of the report generation, and reduce the time it takes to generate the report.</li>
                        <li>Implement more user-friendly dynamic loading states (especially for the report generation), possibly with SSE and a progress bar.</li>
                        <li>Proper usage of themeing and styling of the app, including a more consistent color scheme and font.</li>
                    </ol>
                </div>

                <div className="flex justify-center">
                    <button
                        className="px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
                        onClick={onClose}
                    >
                        Ok
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FutureImprovementsModal; 