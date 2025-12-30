import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function generateTicketPDF(element: HTMLElement, filename: string = 'ticket.pdf') {
    if (typeof window === 'undefined') return;

    try {
        // Temp unhide if necessary, but we assume it's rendered but off-screen
        // html2canvas works on visible (even if off-screen) elements
        
        // Wait a tiny bit for any remaining image loads or reflows
        await new Promise(resolve => setTimeout(resolve, 100));

        const canvas = await html2canvas(element, {
            scale: 2, // High DPI for crisp printing
            useCORS: true,
            allowTaint: false,
            backgroundColor: '#ffffff',
            logging: false,
        });

        const imgData = canvas.toDataURL('image/png');
        
        // A4 Landscape dimensions in mm
        const pageWidth = 297;
        const pageHeight = 210;

        const pdf = new jsPDF({
            orientation: 'l',
            unit: 'mm',
            format: 'a4'
        });

        // Calculate aspect ratio to fit image on A4
        const canvasAspectRatio = canvas.width / canvas.height;
        const pageAspectRatio = pageWidth / pageHeight;

        let renderWidth, renderHeight;
        if (canvasAspectRatio > pageAspectRatio) {
            renderWidth = pageWidth - 10; // 5mm margin each side
            renderHeight = renderWidth / canvasAspectRatio;
        } else {
            renderHeight = pageHeight - 10;
            renderWidth = renderHeight * canvasAspectRatio;
        }

        // Center the image
        const x = (pageWidth - renderWidth) / 2;
        const y = (pageHeight - renderHeight) / 2;

        pdf.addImage(imgData, 'PNG', x, y, renderWidth, renderHeight);
        
        // Open in new tab
        const pdfOutput = pdf.output('bloburl');
        window.open(pdfOutput, '_blank');
        
        return true;
    } catch (error) {
        console.error('Error generating ticket PDF:', error);
        return false;
    }
}
