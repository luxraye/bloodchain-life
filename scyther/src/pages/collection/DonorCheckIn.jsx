import { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { findDonorByOmang, canDonate, daysSinceLastDonation } from '../../lib/collectionHelpers.js';
import {
    QrCode,
    Search,
    UserCheck,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Droplets,
    ArrowRight,
    ShieldAlert,
    Scan,
} from 'lucide-react';

export default function DonorCheckIn() {
    const { donors, donorsLoading, setActiveDonor, addNotification } = useApp();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [donor, setDonor] = useState(null);
    const [searchError, setSearchError] = useState('');
    const [scanFlash, setScanFlash] = useState('');
    const inputRef = useRef(null);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchError('');
        setScanFlash('');
        const found = findDonorByOmang(donors, searchQuery.trim());
        if (found) {
            setDonor(found);
            setScanFlash('green');
            setTimeout(() => setScanFlash(''), 600);
        } else {
            setDonor(null);
            setSearchError('No donor found with this Omang ID. Please verify and try again.');
            setScanFlash('red');
            setTimeout(() => setScanFlash(''), 600);
        }
    };

    const handleQRScan = () => {
        // Simulate QR scan → picks a random donor from current list if any
        if (!donors?.length) {
            setSearchError('No donors in system. Add donors via High Command first.');
            return;
        }
        const randomDonor = donors[Math.floor(Math.random() * donors.length)];
        const randomOmang = randomDonor.omang || randomDonor.id;
        setSearchQuery(randomOmang);
        const found = findDonorByOmang(donors, randomOmang);
        if (found) {
            setDonor(found);
            setScanFlash('green');
            addNotification(`QR Scanned: ${found.firstName} ${found.lastName}`, 'success');
            setTimeout(() => setScanFlash(''), 600);
        }
    };

    const handleProceed = () => {
        setActiveDonor(donor);
        navigate('/collection/screening');
    };

    const eligible = donor ? canDonate(donor) : false;
    const daysSince = donor ? daysSinceLastDonation(donor) : 0;

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#F0F4F8] flex items-center gap-2">
                    <UserCheck className="w-6 h-6 text-[#D96070]" />
                    Donor Check-In
                </h1>
                <p className="text-sm text-[#8899A8] mt-1">Scan Digital ID or search by Omang to begin the donation process.</p>
            </div>

            {/* Search & Scan Area */}
            <div className={`card p-6 mb-6 transition-all duration-300 ${scanFlash === 'green' ? 'flash-green' : scanFlash === 'red' ? 'flash-red' : ''
                }`}>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-[rgba(168,31,56,0.12)] flex items-center justify-center">
                        <Search className="w-4 h-4 text-[#D96070]" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-[#F0F4F8]">Donor Identification</h2>
                        <p className="text-xs text-[#4A5568]">Scan QR code from the Azure Public App or enter Omang ID manually</p>
                    </div>
                </div>

                {donorsLoading && (
                    <div className="flex items-center gap-2 text-sm text-[#8899A8] mb-3">
                        <span className="inline-block w-4 h-4 border-2 border-brand-red-500 border-t-transparent rounded-full animate-spin" />
                        Loading donors…
                    </div>
                )}
                <form onSubmit={handleSearch} className="flex gap-3">
                    <div className="flex-1 relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Enter Omang ID (e.g., 345612789)"
                            className={`input-field pr-10 ${searchError ? 'border-red-400 shake-input' : ''}`}
                            autoFocus
                            tabIndex={1}
                            disabled={donorsLoading}
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5568]" />
                    </div>
                    <button type="submit" className="btn-primary" tabIndex={2} disabled={donorsLoading}>
                        Lookup
                    </button>
                    <button
                        type="button"
                        onClick={handleQRScan}
                        className="btn-outline flex items-center gap-2"
                        tabIndex={3}
                    >
                        <Scan className="w-4 h-4" />
                        Scan QR
                    </button>
                </form>

                {searchError && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-[#FF2D55] bg-[rgba(255,45,85,0.08)] px-3 py-2 rounded-lg animate-shake">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        {searchError}
                    </div>
                )}
            </div>

            {/* Donor Profile Card */}
            {donor && (
                <div className="card overflow-hidden animate-slide-in">
                    {/* Card Header */}
                    <div className={`px-6 py-4 border-b ${eligible ? 'bg-[rgba(0,255,136,0.08)] border-[rgba(0,255,136,0.2)]' : 'bg-[rgba(255,45,85,0.08)] border-[rgba(255,45,85,0.2)]'}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${eligible ? 'bg-emerald-600' : 'bg-red-600'
                                    }`}>
                                    {eligible ? (
                                        <CheckCircle2 className="w-5 h-5 text-white" />
                                    ) : (
                                        <ShieldAlert className="w-5 h-5 text-white" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-[#F0F4F8]">
                                        {donor.firstName} {donor.lastName}
                                    </h3>
                                    <p className="text-xs text-[#8899A8]">Omang: {donor.omang} · ID: {donor.id}</p>
                                </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${eligible
                                    ? 'bg-[rgba(0,255,136,0.15)] text-[#00FF88]'
                                    : 'bg-[rgba(255,45,85,0.15)] text-[#FF2D55]'
                                }`}>
                                {eligible ? 'ELIGIBLE' : 'DEFERRED'}
                            </div>
                        </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-[#111422] rounded-lg p-3">
                                <p className="text-[10px] uppercase tracking-wider text-[#4A5568] font-semibold mb-1">Blood Type</p>
                                <div className="flex items-center gap-1.5">
                                    <Droplets className="w-4 h-4 text-[#C4304E]" />
                                    <span className="text-lg font-bold text-[#F0F4F8]">{donor.bloodType}</span>
                                </div>
                            </div>
                            <div className="bg-[#111422] rounded-lg p-3">
                                <p className="text-[10px] uppercase tracking-wider text-[#4A5568] font-semibold mb-1">Gender</p>
                                <span className="text-lg font-bold text-[#F0F4F8]">{donor.gender}</span>
                            </div>
                            <div className="bg-[#111422] rounded-lg p-3">
                                <p className="text-[10px] uppercase tracking-wider text-[#4A5568] font-semibold mb-1">Total Donations</p>
                                <span className="text-lg font-bold text-[#F0F4F8]">{donor.totalDonations}</span>
                            </div>
                            <div className={`rounded-lg p-3 ${daysSince < 56 ? 'bg-[rgba(255,45,85,0.08)]' : 'bg-[#111422]'}`}>
                                <p className="text-[10px] uppercase tracking-wider text-[#4A5568] font-semibold mb-1">Days Since Last</p>
                                <div className="flex items-center gap-1.5">
                                    <Clock className={`w-4 h-4 ${daysSince < 56 ? 'text-[#FF2D55]' : 'text-[#00FF88]'}`} />
                                    <span className={`text-lg font-bold ${daysSince < 56 ? 'text-[#FF2D55]' : 'text-[#F0F4F8]'}`}>
                                        {daysSince}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {!eligible && (
                            <div className="mb-6 bg-[rgba(255,45,85,0.08)] border border-[rgba(255,45,85,0.25)] rounded-lg p-4 flex items-start gap-3">
                                <ShieldAlert className="w-5 h-5 text-[#FF2D55] flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-[#FF2D55]">Safety Blocker Active</p>
                                    <p className="text-xs text-[#FF2D55] mt-0.5">
                                        Donor last donated {daysSince} days ago. The minimum interval between donations is 56 days.
                                        {56 - daysSince > 0 && ` ${56 - daysSince} more days required before next donation.`}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between border-t border-white/[0.06] pt-4">
                            <div className="text-xs text-[#4A5568]">
                                Last donation: {new Date(donor.lastDonation).toLocaleDateString('en-GB', {
                                    day: 'numeric', month: 'short', year: 'numeric'
                                })}
                            </div>
                            <button
                                onClick={handleProceed}
                                disabled={!eligible}
                                className="btn-primary flex items-center gap-2"
                                tabIndex={4}
                            >
                                Proceed to Screening
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!donor && !searchError && (
                <div className="card p-12 text-center">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-[rgba(255,255,255,0.05)] flex items-center justify-center mb-4">
                        <QrCode className="w-8 h-8 text-[#4A5568]" />
                    </div>
                    {!donorsLoading && donors.length === 0 ? (
                        <>
                            <h3 className="text-base font-semibold text-[#E2E8F0] mb-1">No donors found</h3>
                            <p className="text-sm text-[#4A5568] max-w-md mx-auto">
                                No donors are in the system yet. Provision donors via High Command first, then try check-in again.
                            </p>
                        </>
                    ) : (
                        <>
                            <h3 className="text-base font-semibold text-[#E2E8F0] mb-1">Waiting for Donor</h3>
                            <p className="text-sm text-[#4A5568] max-w-md mx-auto">
                                Scan a donor's QR code from the Azure Public App or search by their Omang ID to begin the check-in process.
                            </p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
