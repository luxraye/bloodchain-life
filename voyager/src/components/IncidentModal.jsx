import { useState } from 'react';
import { X, AlertTriangle, Send } from 'lucide-react';
import { INCIDENT_TYPES, SEVERITY_LEVELS } from '../data/schemas';
import { useJobs } from '../context/JobContext';

export default function IncidentModal({ jobId, onClose }) {
    const { reportIncident } = useJobs();
    const [selectedType, setSelectedType] = useState(null);
    const [severity, setSeverity] = useState(null);
    const [note, setNote] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const canSubmit = selectedType && severity && note.trim().length > 0;

    const handleSubmit = () => {
        if (!canSubmit) return;
        reportIncident(jobId, {
            type: selectedType,
            severity: severity,
            note: note.trim(),
        });
        setSubmitted(true);
        setTimeout(() => onClose(), 1500);
    };

    if (submitted) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
                <div className="glass-card p-8 mx-4 text-center animate-slide-up max-w-sm w-full">
                    <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-8 h-8 text-red-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Incident Reported</h3>
                    <p className="text-sm text-slate-400">Job flagged. Sender and receiver have been alerted.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="glass-card w-full max-w-md mx-4 mb-4 sm:mb-0 animate-slide-up overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-700">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4 text-yellow-400" />
                        </div>
                        <h2 className="text-lg font-bold text-white">Report Incident</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center hover:bg-slate-600 transition-colors"
                    >
                        <X className="w-4 h-4 text-slate-400" />
                    </button>
                </div>

                <div className="p-4 space-y-5 max-h-[70vh] overflow-y-auto">
                    {/* Issue Type */}
                    <div>
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                            Issue Type
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {INCIDENT_TYPES.map(type => (
                                <button
                                    key={type.value}
                                    onClick={() => setSelectedType(type.value)}
                                    className={`p-3 rounded-xl border text-left transition-all ${selectedType === type.value
                                            ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                                            : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600'
                                        }`}
                                >
                                    <span className="text-lg block mb-1">{type.icon}</span>
                                    <span className="text-xs font-semibold">{type.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Severity */}
                    <div>
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                            Severity
                        </label>
                        <div className="flex gap-2">
                            {SEVERITY_LEVELS.map(level => (
                                <button
                                    key={level.value}
                                    onClick={() => setSeverity(level.value)}
                                    className={`flex-1 py-3 rounded-xl border text-center text-sm font-bold transition-all ${severity === level.value
                                            ? `${level.color} bg-opacity-10 border-current`
                                            : 'border-slate-700 text-slate-500 hover:border-slate-600'
                                        }`}
                                    style={severity === level.value ? {
                                        backgroundColor: level.value === 'LOW' ? 'rgba(148,163,184,0.1)' :
                                            level.value === 'MEDIUM' ? 'rgba(250,204,21,0.1)' :
                                                'rgba(239,68,68,0.1)'
                                    } : {}}
                                >
                                    {level.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                            Notes
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Describe the incident... (voice-to-text friendly)"
                            rows={3}
                            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 resize-none"
                        />
                    </div>
                </div>

                {/* Submit */}
                <div className="p-4 border-t border-slate-700">
                    <button
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${canSubmit
                                ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20'
                                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            }`}
                    >
                        <Send className="w-4 h-4" />
                        Flag Job & Alert Network
                    </button>
                </div>
            </div>
        </div>
    );
}
