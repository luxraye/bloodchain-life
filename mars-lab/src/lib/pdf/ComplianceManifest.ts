import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { BloodUnit } from '../../components/laboratory/BatchProcessingGrid';

export function generateCustodyManifest(batchId: string, units: BloodUnit[], supervisorName: string) {
    const doc = new jsPDF();
    const dateStr = new Date().toLocaleString();

    // Headers
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text(`MoH Regulatory Custody Manifest`, 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Batch Reference: ${batchId}`, 14, 32);
    doc.text(`Timestamp: ${dateStr}`, 14, 38);
    doc.text(`Supervising Tech: ${supervisorName}`, 14, 44);

    // Grid Mapping
    const tableData = units.map(u => {
        const isReactive = u.hiv === 'REACTIVE' || u.hbsag === 'REACTIVE' || u.hcv === 'REACTIVE' || u.syphilis === 'REACTIVE';
        const ttiStatus = isReactive ? 'FAIL (BIOHAZARD)' : (u.hiv === 'NEGATIVE' ? 'PASS (SAFE)' : 'PENDING');
        return [
            u.id, 
            u.bloodGroup, 
            ttiStatus,
            u.status
        ];
    });

    // AutoTable Injection
    autoTable(doc, {
        startY: 50,
        headStyles: { fillColor: [15, 23, 42] }, // Slate-950 matched
        head: [['Unit UUID', 'Blood Group', 'TTI Screen Status', 'Final Disposition']],
        body: tableData,
    });

    // Signatures
    const finalY = (doc as any).lastAutoTable.finalY || 50;
    
    doc.setLineWidth(0.5);
    doc.line(14, finalY + 30, 80, finalY + 30);
    doc.text('Digital Signature / Supervisor Sign-off', 14, finalY + 38);
    
    doc.text(`Authorized by: ${supervisorName}`, 14, finalY + 44);

    // Save triggers native browser download client-side instantly
    doc.save(`MoH_Manifest_${batchId}.pdf`);
}
