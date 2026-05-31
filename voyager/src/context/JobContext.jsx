import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { fetchJobs, scanAsset } from '../lib/assetsApi.js';
import { DEMO_COORDINATOR } from '../data/seedVoyager.js';
import { isDemoSession } from '../lib/isDemoSession.js';
import { setDemoJobs } from '../lib/demoJobsStore.js';

const JobContext = createContext(null);

const defaultDriver = isDemoSession()
    ? {
        id: DEMO_COORDINATOR.id,
        name: DEMO_COORDINATOR.name,
        callsign: DEMO_COORDINATOR.callsign,
        vehicle: DEMO_COORDINATOR.vehicle,
        region: DEMO_COORDINATOR.region,
        totalDeliveries: DEMO_COORDINATOR.totalDeliveries,
        activeJobId: 'job-voy-001',
    }
    : {
        id: 'courier',
        name: 'Courier',
        callsign: 'Voyager',
        vehicle: '—',
        region: '—',
        totalDeliveries: 0,
        activeJobId: null,
    };

const initialState = {
    jobs: [],
    driver: defaultDriver,
    activeJobId: null,
    jobsLoading: true,
    jobsError: null,
};

function withJobs(state, jobs) {
    if (isDemoSession()) setDemoJobs(jobs);
    return { ...state, jobs, jobsLoading: false, jobsError: null };
}

function updateJob(jobs, jobId, updater) {
    return jobs.map((job) => (job.id === jobId ? updater(job) : job));
}

function jobReducer(state, action) {
    switch (action.type) {
        case 'ACCEPT_JOB':
            return withJobs(state, updateJob(state.jobs, action.payload.jobId, (job) => ({
                ...job,
                status: 'IN_TRANSIT',
                custodyLog: {
                    ...job.custodyLog,
                    pickupTime: new Date().toISOString(),
                    pickupBy: state.driver.name,
                    pickupLocation: job.route.source,
                },
            })));

        case 'ASSIGN_COURIER':
            return withJobs(state, updateJob(state.jobs, action.payload.jobId, (job) => ({
                ...job,
                courierId: action.payload.courierLabel,
                assignedAt: new Date().toISOString(),
                assignedBy: action.payload.assignedBy,
            })));

        case 'EXPEDITE_STAT':
            return withJobs(state, updateJob(state.jobs, action.payload.jobId, (job) => ({
                ...job,
                priority: 'STAT',
                expeditedAt: new Date().toISOString(),
            })));

        case 'ACKNOWLEDGE_COLD_CHAIN':
            return withJobs(state, updateJob(state.jobs, action.payload.jobId, (job) => ({
                ...job,
                coldChain: {
                    ...job.coldChain,
                    acknowledgedAt: new Date().toISOString(),
                    acknowledgedBy: action.payload.acknowledgedBy,
                },
            })));

        case 'CONFIRM_PICKUP':
            return withJobs(state, updateJob(state.jobs, action.payload.jobId, (job) => ({
                ...job,
                status: 'IN_TRANSIT',
                custodyLog: {
                    ...job.custodyLog,
                    pickupTime: new Date().toISOString(),
                    pickupBy: action.payload.handoverFrom || state.driver.name,
                    pickupLocation: job.route.source,
                },
            })));

        case 'CONFIRM_DELIVERY': {
            const jobs = updateJob(state.jobs, action.payload.jobId, (job) => ({
                ...job,
                status: 'DELIVERED',
                custodyLog: {
                    ...job.custodyLog,
                    deliveryTime: new Date().toISOString(),
                    deliveryBy: action.payload.handoverTo || 'Lab Tech',
                    deliveryLocation: job.route.destination,
                },
            }));
            return {
                ...withJobs(state, jobs),
                activeJobId: state.activeJobId === action.payload.jobId ? null : state.activeJobId,
            };
        }

        case 'REPORT_INCIDENT':
            return withJobs(state, updateJob(state.jobs, action.payload.jobId, (job) => ({
                ...job,
                status: 'FLAGGED',
                incidents: [
                    ...job.incidents,
                    {
                        type: action.payload.incident.type,
                        severity: action.payload.incident.severity,
                        timestamp: new Date().toISOString(),
                        note: action.payload.incident.note,
                    },
                ],
            })));

        case 'SET_ACTIVE_JOB':
            return { ...state, activeJobId: action.payload.jobId };

        case 'SET_JOBS':
            if (isDemoSession()) setDemoJobs(action.payload.jobs);
            return { ...state, jobs: action.payload.jobs, jobsLoading: false, jobsError: null };
        case 'SET_JOBS_LOADING':
            return { ...state, jobsLoading: true, jobsError: null };
        case 'SET_JOBS_ERROR':
            return { ...state, jobsLoading: false, jobsError: action.payload.message };

        default:
            return state;
    }
}

export function JobProvider({ children }) {
    const [state, dispatch] = useReducer(jobReducer, initialState);

    const refreshJobs = useCallback(async () => {
        dispatch({ type: 'SET_JOBS_LOADING' });
        try {
            const jobs = await fetchJobs();
            dispatch({ type: 'SET_JOBS', payload: { jobs } });
        } catch (err) {
            dispatch({ type: 'SET_JOBS_ERROR', payload: { message: err?.message || 'Failed to load jobs' } });
        }
    }, []);

    useEffect(() => {
        refreshJobs();
    }, [refreshJobs]);

    const acceptJob = useCallback(async (jobId) => {
        try {
            if (!isDemoSession()) {
                await scanAsset(jobId, 'IN_TRANSIT', 'Courier Vehicle');
            }
            dispatch({ type: 'ACCEPT_JOB', payload: { jobId } });
            if (!isDemoSession()) await refreshJobs();
        } catch (err) {
            console.error('Accept job failed:', err);
        }
    }, [refreshJobs]);

    const assignCourier = useCallback((jobId, courierLabel, assignedBy) => {
        dispatch({ type: 'ASSIGN_COURIER', payload: { jobId, courierLabel, assignedBy } });
    }, []);

    const expediteStat = useCallback((jobId) => {
        dispatch({ type: 'EXPEDITE_STAT', payload: { jobId } });
    }, []);

    const acknowledgeColdChain = useCallback((jobId, acknowledgedBy) => {
        dispatch({ type: 'ACKNOWLEDGE_COLD_CHAIN', payload: { jobId, acknowledgedBy } });
    }, []);

    const confirmPickup = useCallback((jobId, handoverFrom) => {
        dispatch({ type: 'CONFIRM_PICKUP', payload: { jobId, handoverFrom } });
    }, []);

    const confirmDelivery = useCallback(async (jobId, handoverTo) => {
        try {
            const job = state.jobs.find((j) => j.id === jobId);
            const destination = job?.route?.destination ?? 'Hospital Blood Bank';
            if (!isDemoSession()) {
                await scanAsset(jobId, 'RELEASED', destination);
            }
            dispatch({ type: 'CONFIRM_DELIVERY', payload: { jobId, handoverTo } });
            if (!isDemoSession()) await refreshJobs();
        } catch (err) {
            console.error('Confirm delivery failed:', err);
        }
    }, [refreshJobs, state.jobs]);

    const reportIncident = useCallback((jobId, incident) => {
        dispatch({ type: 'REPORT_INCIDENT', payload: { jobId, incident } });
    }, []);

    const setActiveJob = useCallback((jobId) => {
        dispatch({ type: 'SET_ACTIVE_JOB', payload: { jobId } });
    }, []);

    const getActiveJob = useCallback(() => {
        return state.jobs.find((j) => j.id === state.activeJobId) || null;
    }, [state.jobs, state.activeJobId]);

    const value = {
        ...state,
        acceptJob,
        assignCourier,
        expediteStat,
        acknowledgeColdChain,
        confirmPickup,
        confirmDelivery,
        reportIncident,
        setActiveJob,
        getActiveJob,
        refreshJobs,
    };

    return (
        <JobContext.Provider value={value}>
            {children}
        </JobContext.Provider>
    );
}

export function useJobs() {
    const ctx = useContext(JobContext);
    if (!ctx) throw new Error('useJobs must be used within a JobProvider');
    return ctx;
}
