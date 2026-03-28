import React from 'react';
import Button from '../common/Button.jsx';

/**
 * Button that triggers the browser's print dialog to save/print the report as PDF.
 */
function ReportDownload({ predictionId }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="report-download no-print">
      <Button variant="secondary" onClick={handlePrint}>
        🖨️ Download / Print Report
      </Button>
      <p className="report-download-hint">
        Use your browser's &quot;Save as PDF&quot; option to save a copy.
      </p>
    </div>
  );
}

export default ReportDownload;
