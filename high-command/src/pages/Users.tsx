import { useState, useMemo } from 'react';
import { Trash2, UserPlus, KeyRound } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
    createColumnHelper,
    type SortingState,
} from '@tanstack/react-table';
import { adminService, type User, type CreateUserPayload } from '../services/adminService';

const columnHelper = createColumnHelper<User>();

const EMPTY_USERS: User[] = [];
const INITIAL_PAGINATION = { pageSize: 15 };
const SKELETON_WIDTHS = [50, 90, 70, 60, 80, 75];

function RoleBadge({ role }: { role: string }) {
    const styles: Record<string, string> = {
        ADMIN: 'bg-[rgba(168,31,56,0.12)] text-[#D96070] ring-1 ring-[rgba(168,31,56,0.25)]',
        SUPER_ADMIN: 'bg-[rgba(168,31,56,0.12)] text-[#D96070] ring-1 ring-[rgba(168,31,56,0.25)]',
        MOH_AUDITOR: 'bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20',
        LOGISTICS_COMMAND: 'bg-lime-500/10 text-lime-400 ring-1 ring-lime-500/20',
        MEDICAL: 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20',
        LAB: 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20',
        TRANSIT: 'bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20',
        PUBLIC: 'bg-neutral-500/10 text-neutral-400 ring-1 ring-neutral-500/20',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium font-mono ${styles[role] || styles.PUBLIC}`}>
            {role}
        </span>
    );
}

function StatusDot({ status }: { status: string }) {
    const config: Record<string, { bg: string; text: string; dot: string }> = {
        ACTIVE: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-500' },
        SUSPENDED: { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-500' },
    };
    const c = config[status] || config.SUSPENDED;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${c.bg} ${c.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
            {status}
        </span>
    );
}

function SkeletonRow({ index }: { index: number }) {
    return (
        <tr className="border-b border-surface-400/20">
            {SKELETON_WIDTHS.map((w, i) => (
                <td key={i} className="px-4 py-3">
                    <div className="h-4 skeleton" style={{ width: w + (index * 7 + i * 13) % 30 }}></div>
                </td>
            ))}
        </tr>
    );
}

// ─── Toast Notification ──────────────────────────────

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
    const bg = type === 'success'
        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
        : 'bg-red-500/10 border-red-500/30 text-red-400';
    return (
        <div className={`fixed top-6 right-6 z-[60] px-5 py-3 rounded-lg border ${bg} backdrop-blur-xl animate-slide-up flex items-center gap-3 shadow-2xl`}>
            <span className="text-sm font-medium">{message}</span>
            <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity">✕</button>
        </div>
    );
}

// ─── Create User Modal ───────────────────────────────

function CreateUserModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: (msg: string) => void }) {
    const queryClient = useQueryClient();
    const [form, setForm] = useState<CreateUserPayload>({ email: '', name: '', role: 'PUBLIC' });
    const [errorMsg, setErrorMsg] = useState('');
    const [tempPassword, setTempPassword] = useState<string | null>(null);

    const mutation = useMutation({
        mutationFn: adminService.createUser,
        onSuccess: (user: any) => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            onSuccess(`User "${user.name}" provisioned successfully`);
            // Show the temp password for the admin to copy — don't close yet
            if (user.tempPassword) {
                setTempPassword(user.tempPassword);
            } else {
                onClose();
            }
        },
        onError: (error: any) => {
            const msg = error.response?.data?.error || error.message || 'Failed to create user';
            setErrorMsg(msg);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        mutation.mutate(form);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div
                className="glass-card-gold w-full max-w-lg p-6 animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-white">Provision New User</h3>
                        <p className="text-xs text-neutral-500 mt-1">Assign access to the Bloodchain ecosystem</p>
                    </div>
                    <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors text-lg">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-neutral-400 mb-1.5 font-medium">Full Name</label>
                            <input
                                type="text"
                                className="command-input"
                                placeholder="e.g. Dr. Kealeboga Ntse"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-neutral-400 mb-1.5 font-medium">Email</label>
                            <input
                                type="email"
                                className="command-input"
                                placeholder="user@bw.health"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-neutral-400 mb-1.5 font-medium">Role Assignment</label>
                        <select
                            className="command-select"
                            value={form.role}
                            onChange={(e) => setForm({ ...form, role: e.target.value, facilityId: undefined })}
                        >
                            <option value="PUBLIC">Public (Donor)</option>
                            <option value="MEDICAL">Medical Staff</option>
                            <option value="LAB">Lab Technician</option>
                            <option value="TRANSIT">Transit / Courier</option>
                            <option value="LOGISTICS_COMMAND">Logistics Command</option>
                            <option value="MOH_AUDITOR">MoH Auditor</option>
                            <option value="ADMIN">Administrator</option>
                            <option value="SUPER_ADMIN">Super Admin</option>
                        </select>
                    </div>

                    {/* Dynamic Role Fields → all map to facilityId */}
                    {form.role === 'MEDICAL' && (
                        <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10 animate-slide-up">
                            <label className="block text-xs text-emerald-400 mb-1.5 font-medium">Hospital / Facility</label>
                            <input
                                type="text"
                                className="command-input"
                                placeholder="e.g. Princess Marina Hospital"
                                value={form.facilityId || ''}
                                onChange={(e) => setForm({ ...form, facilityId: e.target.value })}
                                required
                            />
                        </div>
                    )}

                    {form.role === 'TRANSIT' && (
                        <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/10 animate-slide-up">
                            <label className="block text-xs text-purple-400 mb-1.5 font-medium">Base / Depot</label>
                            <input
                                type="text"
                                className="command-input"
                                placeholder="e.g. NBTS Gaborone Depot"
                                value={form.facilityId || ''}
                                onChange={(e) => setForm({ ...form, facilityId: e.target.value })}
                                required
                            />
                        </div>
                    )}

                    {form.role === 'LAB' && (
                        <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/10 animate-slide-up">
                            <label className="block text-xs text-blue-400 mb-1.5 font-medium">NBTS Center</label>
                            <input
                                type="text"
                                className="command-input"
                                placeholder="e.g. NBTS Francistown"
                                value={form.facilityId || ''}
                                onChange={(e) => setForm({ ...form, facilityId: e.target.value })}
                                required
                            />
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t border-surface-400/30">
                        <button type="button" onClick={onClose} className="command-button-ghost">Cancel</button>
                        <button type="submit" className="command-button" disabled={mutation.isPending}>
                            {mutation.isPending ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                                    Provisioning...
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5">
                                    <UserPlus size={14} /> Provision User
                                </span>
                            )}
                        </button>
                    </div>

                    {errorMsg && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 animate-slide-up">
                            <span className="text-red-400 text-sm">⚠</span>
                            <p className="text-xs text-red-400">{errorMsg}</p>
                        </div>
                    )}
                </form>

                {/* Temp password reveal — shown after successful provision */}
                {tempPassword && (
                    <div className="mt-4 p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20 animate-slide-up space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="text-emerald-400 text-sm">✓</span>
                            <p className="text-xs font-semibold text-emerald-400">User provisioned — share these credentials once</p>
                        </div>
                        <div>
                            <p className="text-[11px] text-neutral-500 mb-1 font-medium">TEMPORARY PASSWORD</p>
                            <p className="font-mono text-base text-white tracking-widest bg-black/40 px-4 py-2 rounded-lg border border-surface-400/20 select-all">
                                {tempPassword}
                            </p>
                            <p className="text-[10px] text-neutral-600 mt-1.5">User will be required to change this on first login.</p>
                        </div>
                        <button onClick={onClose} className="w-full command-button text-sm mt-2">
                            Done
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Users Page ──────────────────────────────────────

export default function Users() {
    const queryClient = useQueryClient();
    const [showCreate, setShowCreate] = useState(false);
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    const deleteMutation = useMutation({
        mutationFn: (id: string) => adminService.deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            showToast('User removed from system and Supabase Auth');
            setConfirmDeleteId(null);
        },
        onError: (error: any) => {
            const msg = error.response?.data?.error || error.message || 'Failed to delete user';
            showToast(msg, 'error');
            setConfirmDeleteId(null);
        },
    });

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const { data, isLoading } = useQuery({
        queryKey: ['users', roleFilter],
        queryFn: () => adminService.fetchUsers({ role: roleFilter, limit: 50 }),
    });

    const columns = useMemo(
        () => [
            columnHelper.accessor('id', {
                header: 'ID',
                cell: (info) => <span className="font-mono text-[11px] text-neutral-500">{info.getValue().slice(0, 8)}…</span>,
                size: 90,
            }),
            columnHelper.accessor('name', {
                header: 'Name',
                cell: (info) => <span className="text-sm text-white font-medium">{info.getValue()}</span>,
            }),
            columnHelper.accessor('email', {
                header: 'Email',
                cell: (info) => <span className="text-xs text-neutral-400 font-mono">{info.getValue()}</span>,
            }),
            columnHelper.accessor('role', {
                header: 'Role',
                cell: (info) => <RoleBadge role={info.getValue()} />,
                size: 120,
            }),
            columnHelper.accessor('facilityId', {
                header: 'Facility',
                cell: (info) => {
                    const val = info.getValue();
                    return val
                        ? <span className="text-xs text-neutral-400">{val}</span>
                        : <span className="text-xs text-neutral-600">—</span>;
                },
                size: 160,
            }),
            columnHelper.accessor('status', {
                header: 'Status',
                cell: (info) => <StatusDot status={info.getValue()} />,
                size: 110,
            }),
            columnHelper.accessor('createdAt', {
                header: 'Created',
                cell: (info) => (
                    <span className="text-xs text-neutral-500 font-mono">
                        {new Date(info.getValue()).toLocaleDateString()}
                    </span>
                ),
                size: 110,
            }),
            columnHelper.display({
                id: 'actions',
                header: '',
                size: 100,
                cell: (info) => {
                    const id = info.row.original.id;
                    const isConfirming = confirmDeleteId === id;
                    const isDeleting = deleteMutation.isPending && confirmDeleteId === id;
                    if (isConfirming) {
                        return (
                            <div className="flex items-center gap-1">
                                <button
                                    className="text-[11px] px-2 py-0.5 rounded bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-colors"
                                    disabled={isDeleting}
                                    onClick={() => deleteMutation.mutate(id)}
                                >
                                    {isDeleting ? '…' : 'Confirm'}
                                </button>
                                <button
                                    className="text-[11px] px-2 py-0.5 rounded bg-surface-400/20 text-neutral-500 hover:text-white transition-colors"
                                    onClick={() => setConfirmDeleteId(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        );
                    }
                    return (
                        <button
                            className="text-neutral-600 hover:text-red-400 transition-colors px-2 py-1 rounded"
                            title="Remove user"
                            onClick={() => setConfirmDeleteId(id)}
                        >
                            <Trash2 size={13} />
                        </button>
                    );
                },
            }),
        ],
        [confirmDeleteId, deleteMutation.isPending]
    );

    const tableData = data?.users ?? EMPTY_USERS;
    const tableState = useMemo(() => ({ sorting }), [sorting]);

    const table = useReactTable({
        data: tableData,
        columns,
        state: tableState,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: INITIAL_PAGINATION },
    });



    return (
        <div className="space-y-6 animate-fade-in">
            {/* Toast */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <KeyRound size={18} className="text-command-gold" /> Keymaster
                    </h2>
                    <p className="text-xs text-neutral-500 mt-1 font-mono">USER PROVISIONING & ACCESS CONTROL</p>
                </div>
                <button className="command-button" onClick={() => setShowCreate(true)}>
                    + Provision New User
                </button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
                {['ALL', 'SUPER_ADMIN', 'ADMIN', 'MOH_AUDITOR', 'LOGISTICS_COMMAND', 'MEDICAL', 'LAB', 'TRANSIT', 'PUBLIC'].map((role) => (
                    <button
                        key={role}
                        onClick={() => setRoleFilter(role)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${roleFilter === role
                            ? 'bg-command-gold/10 text-command-gold border border-command-gold/20'
                            : 'text-neutral-500 hover:text-white bg-surface-100 border border-surface-400'
                            }`}
                    >
                        {role}
                    </button>
                ))}
                <div className="ml-auto text-xs text-neutral-500 font-mono">
                    {data?.total ?? '—'} total users
                </div>
            </div>

            {/* Table */}
            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            {table.getHeaderGroups().map((hg) => (
                                <tr key={hg.id} className="border-b border-surface-400/50">
                                    {hg.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="px-4 py-3 text-left text-[11px] text-neutral-500 font-semibold tracking-wider uppercase cursor-pointer hover:text-white transition-colors"
                                            style={{ width: header.getSize() }}
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            <div className="flex items-center gap-1">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {{ asc: ' ▲', desc: ' ▼' }[header.column.getIsSorted() as string] ?? ''}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {isLoading
                                ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} index={i} />)
                                : table.getRowModel().rows.length === 0
                                    ? (
                                        <tr>
                                            <td colSpan={columns.length} className="px-4 py-12 text-center">
                                                <div className="text-neutral-600 text-sm">No users found</div>
                                                <p className="text-neutral-700 text-xs mt-1">Provision your first user to get started</p>
                                            </td>
                                        </tr>
                                    )
                                    : table.getRowModel().rows.map((row) => (
                                        <tr
                                            key={row.id}
                                            className="border-b border-surface-400/20 hover:bg-surface-100/50 transition-colors"
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <td key={cell.id} className="px-4 py-3">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-surface-400/50">
                    <span className="text-xs text-neutral-500 font-mono">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </span>
                    <div className="flex gap-2">
                        <button
                            className="command-button-ghost text-xs"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            ← Previous
                        </button>
                        <button
                            className="command-button-ghost text-xs"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next →
                        </button>
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            {showCreate && (
                <CreateUserModal
                    onClose={() => setShowCreate(false)}
                    onSuccess={(msg) => showToast(msg, 'success')}
                />
            )}
        </div>
    );
}
