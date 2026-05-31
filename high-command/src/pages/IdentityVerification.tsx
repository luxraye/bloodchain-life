import { useState, useMemo } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useReactTable, getCoreRowModel, flexRender, type ColumnDef } from '@tanstack/react-table';
import apiClient from '../lib/api';
import { isDemoSession } from '../lib/isDemoSession';
import { DEMO_KYC_QUEUE } from '../data/seedHighCommand';

interface VerificationUser {
    id: string;
    name: string;
    email: string;
    trustLevel: number;
    verificationDocUrl: string;
    createdAt: string;
}
interface AdminUsersResponse {
    data?: VerificationUser[];
    users?: VerificationUser[];
}

export default function IdentityVerification() {
    const queryClient = useQueryClient();
    const [selectedUser, setSelectedUser] = useState<VerificationUser | null>(null);

    const { data: users = [], isLoading } = useQuery<VerificationUser[]>({
        queryKey: ['pendingVerifications'],
        queryFn: async () => {
            if (isDemoSession()) return DEMO_KYC_QUEUE;
            try {
                const { data } = await apiClient.get<AdminUsersResponse>('/admin/users?limit=100');
                const queue = (data.data || data.users || []).filter(
                    (u) => u.trustLevel === 2 && Boolean(u.verificationDocUrl),
                );
                if (import.meta.env.DEV && queue.length === 0) return DEMO_KYC_QUEUE;
                return queue;
            } catch {
                if (import.meta.env.DEV) return DEMO_KYC_QUEUE;
                return [];
            }
        },
    });

    const verifyMutation = useMutation({
        mutationFn: async ({ userId, action }: { userId: string, action: 'APPROVE' | 'REJECT' }) => {
            if (isDemoSession()) {
                return { userId, action };
            }
            const trustLevel = action === 'APPROVE' ? 3 : 1;
            await apiClient.patch(`/admin/users/${userId}`, {
                trustLevel,
                status: action === 'REJECT' ? 'SUSPENDED' : 'ACTIVE'
            });
            return { userId, action };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pendingVerifications'] });
            setSelectedUser(null);
        }
    });

    const columns = useMemo<ColumnDef<VerificationUser>[]>(() => [
        { accessorKey: 'name', header: 'Citizen Name' },
        { accessorKey: 'email', header: 'Email Address' },
        {
            accessorKey: 'createdAt',
            header: 'Submitted',
            cell: info => new Date(info.getValue() as string).toLocaleDateString()
        },
        {
            id: 'actions',
            header: 'Action',
            cell: ({ row }) => (
                <button
                    onClick={() => setSelectedUser(row.original)}
                    className="px-3 py-1.5 text-xs font-semibold bg-indigo-900/50 text-indigo-400 border border-indigo-500/30 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors"
                >
                    Review KYC
                </button>
            )
        }
    ], []);

    const table = useReactTable({
        data: users,
        columns,
        getCoreRowModel: getCoreRowModel()
    });

    return (
        <div className="flex flex-col h-full gap-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Citizen Auditing</h1>
                    <p className="text-sm text-neutral-400 mt-1">Review National IDs (Omang) to grant Trust Level 3.</p>
                </div>
            </header>

            <div className="flex-1 overflow-hidden flex gap-6">
                
                {/* TanStack Table Grid */}
                <div className="flex-1 bg-surface-50 border border-surface-400/50 rounded-xl flex flex-col overflow-hidden shadow-2xl">
                    <div className="p-4 border-b border-surface-400/50 bg-surface-100 flex items-center justify-between">
                        <h2 className="text-sm font-bold text-neutral-200">Pending Verification Queue</h2>
                        <span className="bg-command-gold/20 text-command-gold px-2.5 py-1 rounded text-xs font-bold font-mono">
                            {users.length} PENDING
                        </span>
                    </div>

                    <div className="overflow-auto flex-1 p-0">
                        {isLoading ? (
                            <div className="p-6 text-center text-sm text-neutral-500">Loading queue...</div>
                        ) : users.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 text-center text-sm text-neutral-500 h-full">
                                <ShieldCheck size={32} className="text-neutral-600 mb-4" />
                                <p>Queue is completely empty.</p>
                                <p className="text-xs mt-1">All Level 2 citizens have been audited.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left text-sm text-neutral-300">
                                <thead className="text-xs uppercase bg-surface-200 text-neutral-400 sticky top-0">
                                    {table.getHeaderGroups().map(headerGroup => (
                                        <tr key={headerGroup.id}>
                                            {headerGroup.headers.map(header => (
                                                <th key={header.id} className="px-6 py-4 font-bold tracking-wider">
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>
                                <tbody className="divide-y divide-surface-400/30">
                                    {table.getRowModel().rows.map(row => (
                                        <tr key={row.id} className="hover:bg-surface-300/50 transition-colors">
                                            {row.getVisibleCells().map(cell => (
                                                <td key={cell.id} className="px-6 py-4">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Audit Detail Panel */}
                {selectedUser && (
                    <div className="w-[360px] bg-surface-50 border border-command-gold/30 rounded-xl shadow-[0_0_30px_rgba(234,179,8,0.05)] flex flex-col overflow-hidden shrink-0 animate-fade-in relative">
                        <div className="p-4 border-b border-surface-400/50 bg-gradient-to-r from-surface-100 to-surface-200/50">
                            <h2 className="text-sm font-bold text-white">KYC Audit Protocol</h2>
                            <p className="text-xs text-neutral-400 mt-1 uppercase tracking-widest">{selectedUser.name}</p>
                        </div>
                        
                        <div className="p-4 flex-1 overflow-auto flex flex-col gap-4">
                            <div className="bg-black/40 rounded-lg p-2 border border-surface-400 overflow-hidden flex items-center justify-center min-h-[200px]">
                                {/* Mock rendering of the ID stored in donor-kyc Supabase bucket */}
                                <img 
                                    src={selectedUser.verificationDocUrl} 
                                    alt="National ID" 
                                    className="max-w-full rounded object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.parentElement!.innerHTML = '<span class="text-xs text-neutral-500">Image unavailable (Mock URL)</span>';
                                    }}
                                />
                            </div>
                            
                            <div className="space-y-1">
                                <p className="text-xs text-neutral-400">Account details</p>
                                <p className="text-sm text-neutral-200">{selectedUser.email}</p>
                                <p className="text-xs font-mono text-command-gold mt-2">Level 2 → Requesting Level 3</p>
                            </div>
                        </div>

                        <div className="p-4 border-t border-surface-400/50 bg-surface-200 flex gap-3">
                            <button 
                                onClick={() => verifyMutation.mutate({ userId: selectedUser.id, action: 'REJECT' })}
                                disabled={verifyMutation.isPending}
                                className="flex-1 px-4 py-2.5 bg-red-950/40 text-red-500 border border-red-900/50 rounded-lg text-sm font-semibold hover:bg-red-900/60 transition"
                            >
                                Reject
                            </button>
                            <button 
                                onClick={() => verifyMutation.mutate({ userId: selectedUser.id, action: 'APPROVE' })}
                                disabled={verifyMutation.isPending}
                                className="flex-1 px-4 py-2.5 bg-emerald-600 text-white shadow-lg shadow-emerald-900/20 rounded-lg text-sm font-semibold hover:bg-emerald-500 transition"
                            >
                                Approve L3
                            </button>
                        </div>
                        
                        <button 
                            onClick={() => setSelectedUser(null)}
                            className="absolute top-4 right-4 text-neutral-500 hover:text-white"
                        >
                            ✕
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
