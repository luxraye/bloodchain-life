/**
 * MasterLedger — TanStack Table with server-side pagination.
 * Backend meta shape: { totalRowCount, pageCount, pageIndex, pageSize }
 * Pagination state drives re-fetch to /admin/ledger?pageIndex=X&pageSize=Y
 */

import { useState, useMemo } from 'react';
import { Link2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
    type PaginationState,
} from '@tanstack/react-table';
import { adminService, type LedgerRow } from '../../services/adminService';

const columnHelper = createColumnHelper<LedgerRow>();

function StatusBadge({ action }: { action: string }) {
    const styles: Record<string, string> = {
        Collected: 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20',
        Received: 'bg-teal-500/10 text-teal-400 ring-1 ring-teal-500/20',
        Released: 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20',
        Screened: 'bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/20',
        Delivered: 'bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20',
        Transfused: 'bg-pink-500/10 text-pink-400 ring-1 ring-pink-500/20',
        Quarantined: 'bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20',
        Discarded: 'bg-red-600/10 text-red-500 ring-1 ring-red-600/20',
        'In Transit': 'bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium font-mono ${styles[action] || 'bg-neutral-500/10 text-neutral-400 ring-1 ring-neutral-500/20'}`}>
            {action}
        </span>
    );
}

function SkeletonRow({ colCount }: { colCount: number }) {
    return (
        <tr className="border-b border-surface-400/20">
            {Array.from({ length: colCount }).map((_, i) => (
                <td key={i} className="px-4 py-3">
                    <div className="h-4 skeleton" style={{ width: 60 + (i * 17) % 50 }}></div>
                </td>
            ))}
        </tr>
    );
}

export default function MasterLedger() {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 20,
    });
    const [filterAction, setFilterAction] = useState('');
    const [filterFacility, setFilterFacility] = useState('');

    const { data: response, isLoading } = useQuery({
        queryKey: ['ledger', pagination.pageIndex, pagination.pageSize, filterAction, filterFacility],
        queryFn: () =>
            adminService.fetchLedger({
                pageIndex: pagination.pageIndex,
                pageSize: pagination.pageSize,
                filterAction: filterAction || undefined,
                filterFacility: filterFacility || undefined,
            }),
        placeholderData: (prev) => prev, // keep previous data while fetching
    });

    const columns = useMemo(
        () => [
            columnHelper.accessor('createdAt', {
                header: 'Timestamp',
                cell: (info) => (
                    <span className="font-mono text-xs text-neutral-400">
                        {new Date(info.getValue()).toLocaleString()}
                    </span>
                ),
                size: 170,
            }),
            columnHelper.accessor('actionPerformed', {
                header: 'Action',
                cell: (info) => <StatusBadge action={info.getValue()} />,
                size: 120,
            }),
            columnHelper.accessor('userName', {
                header: 'Actor',
                cell: (info) => <span className="text-sm text-white">{info.getValue()}</span>,
            }),
            columnHelper.accessor('userRole', {
                header: 'Role',
                cell: (info) => (
                    <span className="font-mono text-[11px] text-command-gold">
                        {info.getValue()}
                    </span>
                ),
                size: 100,
            }),
            columnHelper.accessor('facility', {
                header: 'Facility',
                cell: (info) => <span className="text-xs text-neutral-400">{info.getValue()}</span>,
            }),
            columnHelper.accessor('assetId', {
                header: 'Asset ID',
                cell: (info) => (
                    <span className="font-mono text-xs text-neutral-500">
                        {info.getValue() ? info.getValue()!.slice(0, 8) + '…' : '—'}
                    </span>
                ),
                size: 100,
            }),
        ],
        [],
    );

    const table = useReactTable({
        data: response?.data ?? [],
        columns,
        state: { pagination },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        // Server-side pagination: tell TanStack the total page count from backend
        pageCount: response?.meta?.pageCount ?? -1,
        manualPagination: true,
    });

    const meta = response?.meta;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Link2 size={18} className="text-command-gold" /> Master Ledger
                    </h2>
                    <p className="text-xs text-neutral-500 mt-1 font-mono">
                        IMMUTABLE AUDIT TRAIL — SERVER-SIDE PAGINATION
                    </p>
                </div>
                <div className="text-xs text-neutral-500 font-mono">
                    {meta ? `${meta.totalRowCount.toLocaleString()} records` : '—'}
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 flex-wrap">
                <input
                    type="text"
                    placeholder="Filter by action…"
                    value={filterAction}
                    onChange={(e) => {
                        setFilterAction(e.target.value);
                        setPagination(prev => ({ ...prev, pageIndex: 0 }));
                    }}
                    className="command-input !w-48"
                />
                <input
                    type="text"
                    placeholder="Filter by facility…"
                    value={filterFacility}
                    onChange={(e) => {
                        setFilterFacility(e.target.value);
                        setPagination(prev => ({ ...prev, pageIndex: 0 }));
                    }}
                    className="command-input !w-48"
                />
                {(filterAction || filterFacility) && (
                    <button
                        onClick={() => {
                            setFilterAction('');
                            setFilterFacility('');
                            setPagination(prev => ({ ...prev, pageIndex: 0 }));
                        }}
                        className="command-button-ghost text-xs"
                    >
                        ✕ Clear
                    </button>
                )}
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
                                            className="px-4 py-3 text-left text-[11px] text-neutral-500 font-semibold tracking-wider uppercase sticky top-0 bg-surface-100"
                                            style={{ width: header.getSize() }}
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {isLoading
                                ? Array.from({ length: 10 }).map((_, i) => (
                                    <SkeletonRow key={i} colCount={columns.length} />
                                ))
                                : table.getRowModel().rows.length === 0
                                    ? (
                                        <tr>
                                            <td colSpan={columns.length} className="px-4 py-16 text-center">
                                                <div className="flex flex-col items-center gap-3 text-neutral-500">
                                                    <Link2 size={28} className="text-neutral-600" />
                                                    <p className="text-sm font-medium text-neutral-400">No audit entries yet</p>
                                                    <p className="text-xs max-w-xs">Once actions are performed in bloodchain-core, they will appear here.</p>
                                                </div>
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

                {/* Pagination Controls */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-surface-400/50">
                    <span className="text-xs text-neutral-500 font-mono">
                        Page {(meta?.pageIndex ?? 0) + 1} of {meta?.pageCount ?? 1}
                        {meta && ` · ${meta.totalRowCount.toLocaleString()} total`}
                    </span>
                    <div className="flex items-center gap-2">
                        <select
                            value={pagination.pageSize}
                            onChange={(e) => setPagination({ pageIndex: 0, pageSize: parseInt(e.target.value) })}
                            className="command-select !w-24 !py-1.5 text-xs"
                        >
                            {[10, 20, 50, 100].map(size => (
                                <option key={size} value={size}>{size} rows</option>
                            ))}
                        </select>
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
        </div>
    );
}
