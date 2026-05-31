/**
 * Pure helpers for collection flow — no mock data.
 * Used by MedicalScreening, DonorCheckIn, InventoryDashboard.
 */

export function generateUnitId() {
    return `unit_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 4)}`;
}

export function daysUntilExpiry(unit) {
    if (!unit?.expiresAt) return null;
    const expiry = new Date(unit.expiresAt);
    const now = new Date();
    return Math.floor((expiry - now) / (1000 * 60 * 60 * 24));
}

export function canDonate(donor) {
    if (!donor?.lastDonation) return true;
    const last = new Date(donor.lastDonation);
    const now = new Date();
    const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));
    return diffDays >= 56;
}

export function daysSinceLastDonation(donor) {
    if (!donor?.lastDonation) return 999;
    const last = new Date(donor.lastDonation);
    const now = new Date();
    return Math.floor((now - last) / (1000 * 60 * 60 * 24));
}

/** Find donor by omang (if present) or by id / email / name */
export function findDonorByOmang(donors, omang) {
    if (!donors?.length || !omang) return null;
    return donors.find(d => d.omang === omang || d.id === omang) || null;
}

/** Derive inventory counts by blood type from units list */
export function getInventoryByType(units) {
    const counts = {};
    (units || []).filter(u => u.status === 'AVAILABLE').forEach(u => {
        const t = u.bloodType || u.type;
        counts[t] = (counts[t] || 0) + 1;
    });
    const types = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
    return types.map(type => ({
        type,
        units: counts[type] || 0,
        color: type === 'O+' ? '#dc2626' : '#64748b',
    }));
}
