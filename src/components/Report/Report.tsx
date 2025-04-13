import { useState, useRef, useEffect } from 'react';
import { FiLoader, FiInfo, FiCheck, FiUpload, FiEdit, FiEye, FiRefreshCw, FiAlertTriangle, FiCheckCircle, FiDatabase } from 'react-icons/fi';
import mockResultsData from '../../mock_results 1.json';
import { ReportProps } from '../../types';

// Get API URL from environment variable or use default
const API_URL = import.meta.env.VITE_API_URL;

function Report({ prompt, onPromptChange, reportData, onReportDataChange }: ReportProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingLLM, setIsGeneratingLLM] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);
  const [promptAndData, setPromptAndData] = useState<string>('');
  const [apiCallStatus, setApiCallStatus] = useState<string | null>(null);
  const [reportGenerated, setReportGenerated] = useState(false);

  // Add loading state for sample data
  const [isLoadingSampleData, setIsLoadingSampleData] = useState(false);

  useEffect(() => {
    if (prompt && reportData) {
      setPromptAndData(`${prompt}\n\n${JSON.stringify(reportData)}`);
    }
  }, [prompt, reportData]);
  
  // State for prompt editing modal visibility
  const [showPromptEditor, setShowPromptEditor] = useState(false);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileUploadError(null);
    
    if (!file) {
      return;
    }

    if (file.type !== 'application/json') {
      setFileUploadError('Please upload a JSON file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonContent = JSON.parse(e.target?.result as string);
        onReportDataChange(jsonContent);
        console.log('JSON data loaded successfully:', jsonContent);
      } catch (error: any) {
        console.error('Error parsing JSON:', error);
        setFileUploadError(`Error parsing JSON: ${error.message}`);
      }
    };
    
    reader.onerror = () => {
      setFileUploadError('Error reading file');
    };
    
    reader.readAsText(file);
  };

  // Trigger the file input click
  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Update the handler to show loading state
  const handleLoadMockData = () => {
    setFileUploadError(null);
    setIsLoadingSampleData(true);
    
    try {
      // Use setTimeout to give UI time to update with loading state
      setTimeout(() => {
        onReportDataChange(mockResultsData);
        console.log('Mock data loaded successfully');
        setIsLoadingSampleData(false);
      }, 500);
    } catch (error: any) {
      console.error('Error loading mock data:', error);
      setFileUploadError(`Failed to load sample data: ${error.message}`);
      setIsLoadingSampleData(false);
    }
  };

  // Call the LLM API to generate HTML content
  const generateHtmlFromLLM = async () => {
    if (!promptAndData) {
      setErrorMessage("Prompt and data are required");
      return false;
    }

    setIsGeneratingLLM(true);
    setApiCallStatus("Generating report...");
    setErrorMessage(null);
    
    // Reset report state when generating a new one
    setReportGenerated(false);

    try {
      const response = await fetch(`${API_URL}/api/generate-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: promptAndData
        }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        setErrorMessage(result.error || "Failed to generate report from LLM");
        setIsGeneratingLLM(false);
        setApiCallStatus(null);
        return false;
      }
      
      setHtmlContent(result.data);
      setApiCallStatus("Report generated successfully!");
      setIsGeneratingLLM(false);
      setReportGenerated(true);
      return true;
    } catch (error: any) {
      console.error("Error calling LLM API:", error);
      setErrorMessage(`Error calling LLM API: ${error.message || "Unknown error"}`);
      setIsGeneratingLLM(false);
      setApiCallStatus(null);
      return false;
    }
  };

  // Generate report from the LLM
  const generateReport = async () => {
    if (!reportData) {
      setErrorMessage("Please upload JSON data first");
      return;
    }

    await generateHtmlFromLLM();
  };

  // Open the PDF in a new window
  const viewReport = () => {
    if (!contentRef.current) {
      setErrorMessage("Report content reference not available");
      return;
    }
    
    try {
      setIsGenerating(true);
      setErrorMessage(null);
      setApiCallStatus("Opening report...");
      
      // Open a new window with the content optimized for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        setErrorMessage("Please allow pop-ups to view the report");
        setIsGenerating(false);
        setApiCallStatus(null);
        return;
      }
      
      // Add print-optimized styles to the content
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>KPI Optimization Experiment Report</title>
          <style>
            @page {
              size: A4;
              margin: 20mm; /* Consistent margins on all sides */
            }
            body {
              font-family: Arial, sans-serif;
              font-size: 12pt;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
              background-color: white;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            .print-button {
              position: fixed;
              top: 15pt;
              right: 15pt;
              padding: 8pt 15pt;
              background-color: #0056b3;
              color: white;
              border: none;
              border-radius: 4pt;
              font-size: 12pt;
              cursor: pointer;
              z-index: 1000;
            }
            .content-wrapper {
              margin-top: 60pt; /* Only for screen view to accommodate the print button */
              padding: 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              page-break-inside: auto;
              margin-bottom: 10mm;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            th {
              background-color: #0056b3 !important;
              color: white !important;
              font-weight: bold;
              text-align: left;
              padding: 8pt;
              border: 1px solid #ddd;
            }
            td {
              padding: 8pt;
              border: 1px solid #ddd;
              text-align: left;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9 !important;
            }
            h1, h2, h3, h4 {
              color: #0056b3;
              page-break-after: avoid;
            }
            h1 {
              font-size: 20pt;
              text-align: center;
              margin-bottom: 15pt;
              padding-bottom: 10pt;
              border-bottom: 2px solid #0056b3;
            }
            h2 {
              font-size: 16pt;
              margin-top: 15pt;
            }
            p {
              margin-bottom: 10pt;
              page-break-inside: avoid;
            }
            /* Fix for bar charts */
            div[style*="background-color"] {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            @media print {
              .print-button {
                display: none;
              }
              .content-wrapper {
                margin-top: 0; /* Reset margin for print */
              }
              /* Ensure background colors print */
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
            }
          </style>
        </head>
        <body>
          <button class="print-button" onclick="window.print(); setTimeout(() => window.close(), 500);">
            Print / Save as PDF
          </button>
          <div class="content-wrapper">
            ${contentRef.current.innerHTML}
          </div>
        </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // Set a timeout to finish the generating state
      setTimeout(() => {
        setIsGenerating(false);
        setApiCallStatus(null);
        console.log("Print window opened");
      }, 1500);
      
    } catch (error: any) {
      console.error("PDF generation failed:", error);
      setErrorMessage(`PDF generation failed: ${error.message}`);
      setIsGenerating(false);
      setApiCallStatus(null);
    }
  };

  // Update the isStepActive function to keep Step 3 active during generation
  const isStepActive = (stepNumber: number) => {
    switch (stepNumber) {
      case 1: // Upload JSON - always active
        return true;
      case 2: // Edit Prompt - active if JSON is uploaded
        return !!reportData;
      case 3: // Generate Report - active if JSON is uploaded
        return !!reportData;
      case 4: // View Report - active if report is generated
        return reportGenerated && !isGenerating;
      default:
        return false;
    }
  };

  // Helper function to determine if a step is complete
  const isStepComplete = (stepNumber: number) => {
    switch (stepNumber) {
      case 1: // Upload JSON
        return !!reportData;
      case 2: // Edit Prompt - always considered "complete" if JSON is uploaded
        return !!reportData;
      case 3: // Generate Report
        return reportGenerated;
      case 4: // View Report - never marked as complete
        return false;
      default:
        return false;
    }
  };

  return (
    <div className="font-sans">
      
      {/* Step 1: Upload JSON */}
      <div className={`mb-6 p-6 rounded-lg border ${reportData ? 'border-green-500 bg-gray-800/30' : 'border-gray-700 bg-gray-800/50'}`}>
        <div className="flex items-center mb-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${reportData ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'}`}>
            {reportData ? <FiCheck className="w-5 h-5" /> : '1'}
          </div>
          <h2 className="text-xl font-semibold">Upload JSON Data</h2>
        </div>
        
        <p className="text-gray-300 mb-4 ml-11">
          Upload a JSON file containing your data for the report.
        </p>
        
        <div className="ml-11 flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json"
            className="hidden"
          />
          <button 
            onClick={handleUploadButtonClick}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded px-4 py-2 flex items-center cursor-pointer"
          >
            <FiUpload className="mr-2" />
            {reportData ? 'Replace JSON File' : 'Upload JSON File'}
          </button>
          <span className="text-gray-400 px-2">or</span>
          <button 
            onClick={handleLoadMockData}
            disabled={isLoadingSampleData}
            className={`${
              isLoadingSampleData ? 
                'bg-blue-500 text-blue-200 cursor-not-allowed' : 
                'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
            } rounded px-4 py-2 flex items-center`}
          >
            {isLoadingSampleData ? (
              <>
                <FiLoader className="animate-spin mr-2" />
                Loading...
              </>
            ) : (
              <>
                <FiDatabase className="mr-2" />
                Load Sample Data
              </>
            )}
          </button>
        </div>
        
        {/* File upload error message */}
        {fileUploadError && (
          <div className="bg-red-900/40 border border-red-800 text-red-300 px-4 py-3 rounded mt-4 ml-11">
            <p className="font-bold flex items-center">
              <FiAlertTriangle className="mr-2" />
              Upload Error
            </p>
            <p>{fileUploadError}</p>
          </div>
        )}
        
        {/* Data preview if available */}
        {reportData && (
          <div className="mt-4 ml-11 p-4 bg-gray-800 rounded-lg border border-gray-700 overflow-auto max-h-40">
            <div className="flex justify-between items-center mb-2">
              <p className="text-green-400 font-bold">JSON Data Preview:</p>
              <span className="text-gray-400 text-xs">Showing first 300 characters</span>
            </div>
            <pre className="text-xs text-gray-300 whitespace-pre-wrap">
              {JSON.stringify(reportData.data ? reportData.data : reportData, null, 2).substring(0, 300)}
              {JSON.stringify(reportData.data ? reportData.data : reportData, null, 2).length > 300 ? '...' : ''}
            </pre>
          </div>
        )}
      </div>
      
      {/* Step 2: Edit Prompt */}
      <div className={`mb-6 p-6 rounded-lg border ${!isStepActive(2) ? 'border-gray-700 bg-gray-900/50 opacity-70' : isStepComplete(2) ? 'border-green-500 bg-gray-800/30' : 'border-gray-700 bg-gray-800/50'}`}>
        <div className="flex items-center mb-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${!isStepActive(2) ? 'bg-gray-700 text-gray-500' : 'bg-blue-600 text-white'}`}>
            2
          </div>
          <h2 className={`text-xl font-semibold ${!isStepActive(2) ? 'text-gray-500' : 'text-white'}`}>Edit Prompt</h2>
        </div>
        
        <p className={`text-gray-300 mb-4 ml-11 ${!isStepActive(2) ? 'text-gray-500' : ''}`}>
          Customize the prompt that will be used by the AI to generate your report. The default prompt is already optimized, but you can adjust it if needed.
        </p>
        
        <div className="ml-11">
          <button 
            onClick={() => setShowPromptEditor(true)}
            disabled={!isStepActive(2)}
            className={`${isStepActive(2) ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer' : 'bg-gray-700 text-gray-500 cursor-not-allowed'} rounded px-4 py-2 flex items-center`}
          >
            <FiEdit className="mr-2" />
            Edit Prompt
          </button>
        </div>
      </div>
      
      {/* Step 3: Generate Report */}
      <div className={`mb-6 p-6 rounded-lg border ${!reportData ? 'border-gray-700 bg-gray-900/50 opacity-70' : reportGenerated ? 'border-green-500 bg-gray-800/30' : 'border-gray-700 bg-gray-800/50'}`}>
        <div className="flex items-center mb-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${!reportData ? 'bg-gray-700 text-gray-500' : reportGenerated ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'}`}>
            {reportGenerated ? <FiCheck className="w-5 h-5" /> : '3'}
          </div>
          <h2 className="text-xl font-semibold text-white">Generate Report</h2>
        </div>
        
        <p className="text-gray-300 mb-4 ml-11">
          Generate the report with AI. This process may take up to 5 minutes, depending on the complexity of your data.
        </p>
        
        <div className="ml-11">
          <button 
            onClick={generateReport} 
            disabled={!reportData || isGeneratingLLM}
            className={`${
              !reportData ? 
                'bg-gray-700 text-gray-500 cursor-not-allowed' : 
                isGeneratingLLM ? 
                  'bg-gray-600 text-gray-300 cursor-not-allowed' : 
                  'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
            } rounded px-4 py-2 flex items-center`}
          >
            {isGeneratingLLM ? (
              <>
                <FiLoader className="animate-spin mr-2" />
                Generating...
              </>
            ) : reportGenerated ? (
              <>
                <FiRefreshCw className="mr-2" />
                Regenerate Report
              </>
            ) : (
              <>
                <FiCheck className="mr-2" />
                Generate Report
              </>
            )}
          </button>
          {reportGenerated && !isGeneratingLLM && !apiCallStatus && (
            <div className="bg-green-900/30 border border-green-800 text-green-300 px-4 py-3 rounded mt-4">
              <p className="font-bold flex items-center">
                <FiCheckCircle className="mr-2" />
                Success!
              </p>
              <p>Report has been generated successfully. Proceed to Step 4 to view and save your report.</p>
            </div>
          )}
        </div>
        
        {/* Error message display */}
        {errorMessage && (
          <div className="bg-red-900/40 border border-red-800 text-red-300 px-4 py-3 rounded mt-4 ml-11">
            <p className="font-bold flex items-center">
              <FiAlertTriangle className="mr-2" />
              Error
            </p>
            <p>{errorMessage}</p>
          </div>
        )}
      </div>
      
      {/* Step 4: View Report */}
      <div className={`mb-6 p-6 rounded-lg border ${!isStepActive(4) ? 'border-gray-700 bg-gray-900/50 opacity-70' : 'border-amber-500 bg-gray-800/30'}`}>
        <div className="flex items-center mb-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${!isStepActive(4) ? 'bg-gray-700 text-gray-500' : 'bg-amber-500 text-white'}`}>
            4
          </div>
          <h2 className={`text-xl font-semibold ${!isStepActive(4) ? 'text-gray-500' : 'text-white'}`}>View Report</h2>
        </div>
        
        <p className={`text-gray-300 mb-4 ml-11 ${!isStepActive(4) ? 'text-gray-500' : ''}`}>
          View your generated report in a new window where you can review, print, or save it as a PDF.
        </p>
        
        <div className="ml-11">
          <button 
            onClick={viewReport} 
            disabled={!isStepActive(4)}
            className={`${isStepActive(4) ? 'bg-amber-500 hover:bg-amber-600 text-white cursor-pointer' : 'bg-gray-700 text-gray-500 cursor-not-allowed'} rounded px-4 py-2 flex items-center`}
          >
            {isGenerating ? (
              <>
                <FiLoader className="animate-spin mr-2" />
                Opening...
              </>
            ) : (
              <>
                <FiEye className="mr-2" />
                View Report PDF
              </>
            )}
          </button>
          {apiCallStatus && isGenerating && (
            <span className="ml-2 text-blue-400 text-sm flex items-center">
              <FiLoader className="animate-spin mr-2" />
              {apiCallStatus}
            </span>
          )}
        </div>
        
        <div className="mt-4 ml-11 text-gray-400 text-sm">
          <p className="flex items-center">
            <FiInfo className="w-4 h-4 mr-2" />
            Make sure pop-ups are allowed in your browser to view the report.
          </p>
        </div>
      </div>
      
      {/* Prompt Editor Modal */}
      {showPromptEditor && (
        <div className="fixed inset-0 backdrop-blur-xs flex justify-center items-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-6xl w-full border border-gray-700 max-h-[90vh] overflow-auto">
            <h2 className="text-xl font-bold text-white mb-4">Edit Prompt</h2>
            
            <textarea
              value={prompt}
              onChange={(e) => onPromptChange(e.target.value)}
              className="w-full h-[60vh] p-3 bg-gray-700 border border-gray-600 rounded-md text-white font-mono text-sm leading-normal resize-y cursor-text focus:ring-blue-500 focus:border-blue-500"
            />
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowPromptEditor(false)}
                className="px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Hidden container for PDF generation */}
      <div className="absolute -left-[9999px] top-0">
        <div ref={contentRef} dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    </div>
  );
}

export default Report;