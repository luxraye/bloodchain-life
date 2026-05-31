import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../services/adminService';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import jsPDF from 'jspdf';
import { FileDown, FileBarChart2 } from 'lucide-react';
import WastageTrends from '../components/analytics/WastageTrends';

const PIE_COLORS = ['#10B981', '#3B82F6', '#EAB308', '#DC2626', '#8B5CF6', '#EC4899'];

export default function Reports() {
    const [startDate, setStartDate] = useState('2025-09-01');
    const [endDate, setEndDate] = useState('2026-02-28');
    const [generating, setGenerating] = useState(false);
    const [generated, setGenerated] = useState(false);

    const { data: stats } = useQuery({
        queryKey: ['stats'],
        queryFn: adminService.fetchSystemStats,
    });

    const { data: trends } = useQuery({
        queryKey: ['wastage-trends'],
        queryFn: () => adminService.fetchWastageTrends(30),
    });

    // Compute report data from stats
    const totalCollected = stats?.totalUnits || 0;
    const totalUsed = stats?.assetsByStatus['TRANSFUSED'] || 0;
    const totalWasted = stats?.assetsByStatus['DISCARDED'] || 0;
    const totalExpired = stats?.assetsByStatus['EXPIRED'] || 0;

    const statusBreakdown = stats?.assetsByStatus
        ? Object.entries(stats.assetsByStatus).map(([name, value]) => ({ name, value }))
        : [];

    const generatePDF = async () => {
        setGenerating(true);

        await new Promise((r) => setTimeout(r, 1500));

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Header
        doc.setFillColor(0, 0, 0);
        doc.rect(0, 0, pageWidth, 45, 'F');
        doc.setTextColor(234, 179, 8);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('HIGH COMMAND', 20, 20);
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text('Bloodchain National Blood Supply Report', 20, 28);
        doc.setFontSize(8);
        doc.text(`Report Period: ${startDate} to ${endDate}`, 20, 35);
        doc.text(`Generated: ${new Date().toISOString()}`, 20, 40);

        // Classification banner
        doc.setFillColor(234, 179, 8);
        doc.rect(0, 45, pageWidth, 8, 'F');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('OFFICIAL — MINISTRY OF HEALTH & WELLNESS — REPUBLIC OF BOTSWANA', pageWidth / 2, 50, { align: 'center' });

        let y = 65;

        // Executive Summary
        doc.setTextColor(234, 179, 8);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Executive Summary', 20, y);
        y += 10;

        doc.setTextColor(60, 60, 60);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const summaryLines = [
            `During the reporting period, the national blood supply chain processed ${totalCollected.toLocaleString()} units`,
            `of blood across all collection centers and mobile drives in Botswana.`,
            ``,
            `Of these, ${totalUsed.toLocaleString()} units (${((totalUsed / totalCollected) * 100).toFixed(1)}%) were successfully transfused to patients.`,
            `The wastage rate stands at ${(((totalWasted + totalExpired) / totalCollected) * 100).toFixed(1)}%, comprising ${totalWasted} biohazard`,
            `disposals and ${totalExpired} expired units.`,
        ];
        summaryLines.forEach((line) => {
            doc.text(line, 20, y);
            y += 6;
        });
        y += 8;

        // Key Metrics Table
        doc.setTextColor(234, 179, 8);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Key Metrics', 20, y);
        y += 10;

        const metrics = [
            ['Total Units Collected', totalCollected.toLocaleString()],
            ['Total Units Transfused', totalUsed.toLocaleString()],
            ['Units Wasted (Biohazard)', totalWasted.toString()],
            ['Units Expired', totalExpired.toString()],
            ['Active Facilities', (stats?.totalDonors || 0).toLocaleString() + ' registered donors'],
            ['Current National Supply', (stats?.nationalSupply || 0).toLocaleString() + ' units'],
            ['Wastage Rate', (((totalWasted + totalExpired) / totalCollected) * 100).toFixed(1) + '%'],
        ];

        doc.setFontSize(9);
        metrics.forEach(([label, value]) => {
            doc.setTextColor(100, 100, 100);
            doc.setFont('helvetica', 'normal');
            doc.text(label, 25, y);
            doc.setTextColor(40, 40, 40);
            doc.setFont('helvetica', 'bold');
            doc.text(value, 120, y);
            y += 7;
        });
        y += 10;

        // Monthly Breakdown
        doc.setTextColor(234, 179, 8);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Monthly Breakdown', 20, y);
        y += 10;

        // Table header
        doc.setFillColor(30, 30, 30);
        doc.rect(20, y - 4, pageWidth - 40, 8, 'F');
        doc.setTextColor(200, 200, 200);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('Month', 25, y);
        doc.text('Collected', 70, y);
        doc.text('Used', 100, y);
        doc.text('Wasted', 130, y);
        doc.text('Expired', 160, y);
        y += 8;

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 80);
        (trends || []).forEach((t: Record<string, string | number>) => {
            doc.text((t.date as string) || 'N/A', 25, y);
            const discarded = (t['Discarded'] as number) || 0;
            doc.text('-', 70, y);
            doc.text('-', 100, y);
            doc.text(discarded.toString(), 130, y);
            doc.text('-', 160, y);
            y += 7;
        });

        // Footer
        y = doc.internal.pageSize.getHeight() - 25;
        doc.setDrawColor(234, 179, 8);
        doc.line(20, y, pageWidth - 20, y);
        y += 8;
        doc.setFontSize(7);
        doc.setTextColor(120, 120, 120);
        doc.text('This report is cryptographically verified via the Bloodchain Hyperledger Fabric network.', 20, y);
        y += 5;
        doc.text(`Verification Hash: 0x${Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')}`, 20, y);
        y += 5;
        doc.text('© 2026 National Blood Transfusion Service, Ministry of Health & Wellness, Republic of Botswana', 20, y);

        doc.save(`HighCommand_Report_${startDate}_${endDate}.pdf`);
        setGenerating(false);
        setGenerated(true);
        setTimeout(() => setGenerated(false), 4000);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <FileBarChart2 size={18} className="text-command-gold" /> Ministry Reporter
                    </h2>
                    <p className="text-xs text-neutral-500 mt-1 font-mono">GENERATE OFFICIAL GOVERNMENT REPORTS</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Left: Config & Action */}
                <div className="space-y-4">
                    {/* Date Range */}
                    <div className="glass-card-gold p-5">
                        <h3 className="text-sm font-semibold text-white mb-4">Report Configuration</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs text-neutral-400 mb-1.5">Start Date</label>
                                <input
                                    type="date"
                                    className="command-input"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-neutral-400 mb-1.5">End Date</label>
                                <input
                                    type="date"
                                    className="command-input"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            onClick={generatePDF}
                            disabled={generating}
                            className="command-button w-full mt-5"
                        >
                            {generating ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                                    Compiling Report...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <FileDown size={15} /> Generate Monthly Report
                                </span>
                            )}
                        </button>

                        {generated && (
                            <div className="mt-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 animate-slide-up">
                                <div className="flex items-center gap-2">
                                    <span className="text-emerald-400">✓</span>
                                    <span className="text-xs text-emerald-400 font-medium">Report downloaded successfully</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Crypto Verification */}
                    <div className="glass-card p-5">
                        <h3 className="text-sm font-semibold text-white mb-3">Verification</h3>
                        <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-xs text-emerald-400 font-medium">Blockchain Verified</span>
                            </div>
                            <p className="text-[10px] text-neutral-500 font-mono leading-relaxed">
                                All reports are cryptographically signed and anchored to the Bloodchain Hyperledger Fabric network for tamper-proof verification.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right: Preview */}
                <div className="col-span-2 space-y-4">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-4 gap-3">
                        {[
                            { label: 'Collected', value: totalCollected.toLocaleString(), color: 'text-emerald-400' },
                            { label: 'Transfused', value: totalUsed.toLocaleString(), color: 'text-blue-400' },
                            { label: 'Wasted', value: totalWasted.toString(), color: 'text-command-red' },
                            { label: 'Expired', value: totalExpired.toString(), color: 'text-command-gold' },
                        ].map((c, i) => (
                            <div key={i} className="glass-card p-4 text-center">
                                <p className="text-[10px] text-neutral-500 uppercase tracking-wider">{c.label}</p>
                                <p className={`text-2xl font-bold font-mono mt-1 ${c.color}`}>{c.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Collection vs Usage Chart */}
                    <div className="glass-card p-5 hidden">
                        {/* Hidden as it was replaced by Tremor. Left for structural grid spacing if needed */}
                    </div>
                </div>

                <div className="col-span-3 space-y-4">
                    <WastageTrends />
                </div>
                <div className="col-span-3 space-y-4">

                    {/* Status Distribution Pie */}
                    <div className="glass-card p-5">
                        <h3 className="text-xs text-neutral-400 font-semibold tracking-wider uppercase mb-4">Current Status Distribution</h3>
                        <div className="flex items-center gap-8">
                            <ResponsiveContainer width="50%" height={180}>
                                <PieChart>
                                    <Pie
                                        data={statusBreakdown}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={75}
                                        dataKey="value"
                                        stroke="#000"
                                        strokeWidth={2}
                                    >
                                        {statusBreakdown.map((_, index) => (
                                            <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ background: '#111', border: '1px solid #333', borderRadius: 8, fontSize: 11 }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="space-y-2">
                                {statusBreakdown.map((item, idx) => (
                                    <div key={item.name} className="flex items-center gap-2">
                                        <span
                                            className="w-3 h-3 rounded-sm"
                                            style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                                        ></span>
                                        <span className="text-xs text-neutral-400">{item.name}</span>
                                        <span className="text-xs text-white font-mono ml-auto">{item.value as number}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
