import { useState, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, flexRender } from '@tanstack/react-table'
import { GitPullRequest, CheckCircle2, XCircle, AlertTriangle, Send, Filter, ArrowUpDown, Plus, X } from 'lucide-react'

const URGENCY_STYLE = {
  CRITICAL: { bg: 'rgba(255,45,85,0.12)',  color: '#FF2D55',  border: 'rgba(255,45,85,0.3)'  },
  URGENT:   { bg: 'rgba(255,184,0,0.1)',   color: '#FFB800',  border: 'rgba(255,184,0,0.3)'  },
  ROUTINE:  { bg: 'rgba(255,255,255,0.05)', color: '#8899A8', border: 'rgba(255,255,255,0.1)' },
}
const STATUS_STYLE = {
  PENDING:   { bg: 'rgba(255,184,0,0.1)',   color: '#FFB800' },
  VERIFIED:  { bg: 'rgba(0,255,136,0.1)',   color: '#00FF88' },
  FULFILLED: { bg: 'rgba(0,200,255,0.1)',   color: '#00C8FF' },
  REJECTED:  { bg: 'rgba(255,45,85,0.1)',   color: '#FF2D55' },
}

function Chip({ style, children }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded font-mono text-[10px] font-bold"
      style={{ background: style.bg, color: style.color, border: `1px solid ${style.border || style.color + '40'}` }}>
      {children}
    </span>
  )
}

export default function RequestManagement() {
  const { requests, updateRequest, addRequest, addNotification } = useApp()
  const [sorting,        setSorting]        = useState([])
  const [globalFilter,   setGlobalFilter]   = useState('')
  const [showNew,        setShowNew]        = useState(false)
  const [newReq,         setNewReq]         = useState({ bloodType: 'O+', unitsNeeded: 10, urgency: 'ROUTINE', reason: '' })

  const handleVerify = id => { updateRequest(id, { status: 'VERIFIED' }); addNotification('Request verified', 'success') }
  const handleReject = id => { updateRequest(id, { status: 'REJECTED' }); addNotification('Request rejected', 'warning') }
  const handleSubmit = () => {
    if (!newReq.reason?.trim()) {
      addNotification('Please enter a reason for the order', 'warning')
      return
    }
    addRequest({
      bloodType: newReq.bloodType,
      unitsNeeded: newReq.unitsNeeded,
      urgency: newReq.urgency,
      reason: newReq.reason.trim(),
    })
    addNotification(`Order submitted: ${newReq.unitsNeeded} × ${newReq.bloodType}`, 'success')
    setShowNew(false)
    setNewReq({ bloodType: 'O+', unitsNeeded: 10, urgency: 'ROUTINE', reason: '' })
  }

  const columns = useMemo(() => [
    { accessorKey: 'id',            header: 'ID',      cell: ({ getValue }) => <span className="font-mono text-[11px]" style={{ color: '#5BA4D4' }}>{getValue()}</span> },
    { accessorKey: 'requesterType', header: 'Source',  cell: ({ getValue }) => <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: getValue() === 'PATIENT_FAMILY' ? 'rgba(168,31,56,0.12)' : 'rgba(255,255,255,0.05)', color: getValue() === 'PATIENT_FAMILY' ? '#D96070' : '#8899A8' }}>{getValue() === 'PATIENT_FAMILY' ? 'Family' : 'Hospital'}</span> },
    { accessorKey: 'patientName',   header: 'Patient', cell: ({ row }) => <div><p className="text-sm font-semibold" style={{ color: '#F0F4F8' }}>{row.original.patientName}</p><p className="text-xs truncate max-w-[160px]" style={{ color: '#4A5568' }}>{row.original.reason}</p></div> },
    { accessorKey: 'bloodType',     header: 'Type',    cell: ({ getValue }) => <span className="font-bold text-sm" style={{ color: '#D96070' }}>{getValue()}</span> },
    { accessorKey: 'unitsNeeded',   header: 'Units',   cell: ({ getValue }) => <span className="font-bold text-sm" style={{ color: '#F0F4F8' }}>{getValue()}</span> },
    { accessorKey: 'urgency',       header: 'Urgency', cell: ({ getValue }) => <Chip style={URGENCY_STYLE[getValue()]}>{getValue()}</Chip> },
    { accessorKey: 'status',        header: 'Status',  cell: ({ getValue }) => <Chip style={STATUS_STYLE[getValue()] || STATUS_STYLE.ROUTINE}>{getValue()}</Chip> },
    {
      id: 'actions', header: 'Actions',
      cell: ({ row }) => row.original.status !== 'PENDING'
        ? <span style={{ color: '#2E3548' }}>—</span>
        : (
          <div className="flex items-center gap-1.5">
            <button onClick={() => handleVerify(row.original.id)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.25)', color: '#00FF88' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,255,136,0.18)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,255,136,0.1)'}>
              <CheckCircle2 className="w-3 h-3" />Verify
            </button>
            <button onClick={() => handleReject(row.original.id)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{ background: 'rgba(255,45,85,0.1)', border: '1px solid rgba(255,45,85,0.25)', color: '#FF2D55' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,45,85,0.18)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,45,85,0.1)'}>
              <XCircle className="w-3 h-3" />Reject
            </button>
          </div>
        ),
    },
  ], []) // eslint-disable-line

  const table = useReactTable({
    data: requests, columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const pendingCount = requests.filter(r => r.status === 'PENDING').length

  return (
    <div className="animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] mb-1" style={{ color: '#A81F38' }}>Blood Bank · Requests</p>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: '#F0F4F8' }}>Request Management</h1>
          <p className="text-sm mt-1" style={{ color: '#4A5568' }}>Verify family emergency requests and create outbound orders to NBTS.</p>
        </div>
        <div className="flex items-center gap-3">
          {pendingCount > 0 && (
            <span className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold"
              style={{ background: 'rgba(255,184,0,0.1)', border: '1px solid rgba(255,184,0,0.3)', color: '#FFB800' }}>
              <AlertTriangle className="w-3 h-3" />{pendingCount} pending
            </span>
          )}
          <button onClick={() => setShowNew(v => !v)} className="btn-secondary flex items-center gap-2 text-sm">
            {showNew ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showNew ? 'Cancel' : 'New NBTS Order'}
          </button>
        </div>
      </div>

      {/* New order form */}
      {showNew && (
        <div className="card p-5 mb-5 animate-slide-up" style={{ borderColor: 'rgba(58,130,184,0.3)' }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: '#5BA4D4' }}>
            <Send className="w-4 h-4" />Outbound Order to NBTS
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {[
              { label: 'Blood Type', field: 'bloodType', type: 'select', options: ['O+','O-','A+','A-','B+','B-','AB+','AB-'] },
              { label: 'Units Needed', field: 'unitsNeeded', type: 'number' },
              { label: 'Urgency', field: 'urgency', type: 'select', options: ['ROUTINE','URGENT','CRITICAL'] },
              { label: 'Reason', field: 'reason', type: 'text', placeholder: 'e.g. Monthly replenishment' },
            ].map(({ label, field, type, options, placeholder }) => (
              <div key={field}>
                <label className="label-field">{label}</label>
                {type === 'select'
                  ? <select value={newReq[field]} onChange={e => setNewReq(p => ({ ...p, [field]: e.target.value }))} className="input-field">
                      {options.map(o => <option key={o}>{o}</option>)}
                    </select>
                  : <input type={type} value={newReq[field]} onChange={e => setNewReq(p => ({ ...p, [field]: type === 'number' ? parseInt(e.target.value) || 0 : e.target.value }))} placeholder={placeholder} className="input-field" />
                }
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <button onClick={handleSubmit} className="btn-secondary flex items-center gap-2 text-sm">
              <Send className="w-4 h-4" />Submit Order
            </button>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="card p-3.5 mb-4 flex items-center gap-3">
        <Filter className="w-4 h-4 flex-shrink-0" style={{ color: '#4A5568' }} />
        <input type="text" value={globalFilter} onChange={e => setGlobalFilter(e.target.value)}
          placeholder="Filter by patient, blood type, urgency, status…"
          className="input-field" style={{ border: 'none', background: 'transparent', boxShadow: 'none', padding: '0' }} />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              {table.getHeaderGroups().map(hg => (
                <tr key={hg.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#111422' }}>
                  {hg.headers.map(h => (
                    <th key={h.id} onClick={h.column.getToggleSortingHandler()}
                      className="text-left px-4 py-3 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] cursor-pointer select-none"
                      style={{ color: '#4A5568' }}>
                      <div className="flex items-center gap-1">
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        {h.column.getCanSort() && <ArrowUpDown className="w-3 h-3" style={{ color: '#2E3548' }} />}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id}
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    background: row.original.urgency === 'CRITICAL' && row.original.status === 'PENDING' ? 'rgba(255,45,85,0.04)' : 'transparent',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                  onMouseLeave={e => e.currentTarget.style.background = row.original.urgency === 'CRITICAL' && row.original.status === 'PENDING' ? 'rgba(255,45,85,0.04)' : 'transparent'}
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-4 py-3">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {table.getRowModel().rows.length === 0 && (
            <div className="p-8 text-center text-sm" style={{ color: '#4A5568' }}>No requests found.</div>
          )}
        </div>
      </div>
    </div>
  )
}
