/**
 * Scyther App Context — collection workflow state only.
 * Clinical state (requests, transfusions, standby donors) lives in Transfuse.
 */
import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { getUsers, getAssets } from '../lib/api.js';
import apiClient from '../lib/apiClient';

const AppContext = createContext(null);

function mapUserToDonor(user) {
  const name  = user.name || user.email || 'Donor';
  const parts = name.split(' ');
  return {
    id:             user.id,
    omang:          user.omang || '',
    firstName:      parts[0] || '',
    lastName:       parts.slice(1).join(' ') || '',
    gender:         user.gender || '',
    dateOfBirth:    user.dateOfBirth || '',
    bloodType:      user.bloodType || '',
    phone:          user.phone || '',
    email:          user.email || '',
    lastDonation:   user.lastDonation || null,
    totalDonations: user.totalDonations ?? 0,
    status:         user.status || 'ELIGIBLE',
  };
}

export function AppProvider({ children }) {
  const [donors,          setDonors]          = useState([]);
  const [donorsLoading,   setDonorsLoading]   = useState(true);
  const [bloodUnits,      setBloodUnits]      = useState([]);
  const [activeDonor,     setActiveDonor]     = useState(null);
  const [activeScreening, setActiveScreening] = useState(null);
  const [notifications,   setNotifications]   = useState([]);
  const [shiftSyncAt,     setShiftSyncAt]     = useState(null);
  const shiftSyncBusy = useRef(false);

  /** Poll shift activity silently — no sidebar panel; Navbar shows live status only */
  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      if (shiftSyncBusy.current) return;
      shiftSyncBusy.current = true;
      try {
        await apiClient.get('/activity/shift-sync');
        if (!cancelled) setShiftSyncAt(new Date());
      } catch {
        /* core offline — ignore */
      } finally {
        shiftSyncBusy.current = false;
      }
    };
    poll();
    const interval = setInterval(poll, 30_000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  useEffect(() => {
    let cancelled = false;
    getUsers()
      .then(res => { if (!cancelled && res?.data) setDonors((res.data || []).map(mapUserToDonor)); })
      .catch(() => { if (!cancelled) setDonors([]); })
      .finally(() => { if (!cancelled) setDonorsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    getAssets()
      .then(res => {
        if (!cancelled && res?.data) {
          setBloodUnits((res.data || []).map(a => ({
            id: a.id, type: a.bloodType, donorId: a.donorId,
            collectedAt: a.createdAt, expiresAt: a.expiresAt || null,
            status: a.status, location: a.currentLocation,
          })));
        }
      })
      .catch(() => { if (!cancelled) setBloodUnits([]); });
    return () => { cancelled = true; };
  }, []);

  const addNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
  }, []);

  const addBloodUnit = useCallback((unit) => {
    setBloodUnits(prev => [...prev, unit]);
    addNotification(`Unit ${unit.id} added to quarantine`, 'success');
  }, [addNotification]);

  return (
    <AppContext.Provider value={{
      donors, donorsLoading,
      bloodUnits, setBloodUnits, addBloodUnit,
      activeDonor, setActiveDonor,
      activeScreening, setActiveScreening,
      notifications, addNotification,
      shiftSyncAt,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be within AppProvider');
  return ctx;
}
