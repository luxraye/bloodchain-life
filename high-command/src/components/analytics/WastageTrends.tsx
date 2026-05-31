/**
 * WastageTrends — Tremor BarChart consuming backend flat time-series directly.
 * Backend response shape: [{ date: "2026-03-01", "O+": 12, "A-": 3, "Discarded": 15 }, ...]
 * Zero client-side data massaging required — Tremor eats this format natively.
 */

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, Title, Text, AreaChart, BarChart, Select, SelectItem } from '@tremor/react';
import { adminService } from '../../services/adminService';

const PERIOD_OPTIONS = [
    { value: '30', label: '30 Days' },
    { value: '60', label: '60 Days' },
    { value: '90', label: '90 Days' },
];

export default function WastageTrends() {
    const [days, setDays] = useState('30');

    const { data: trends, isLoading } = useQuery({
        queryKey: ['wastage-trends', days],
        queryFn: () => adminService.fetchWastageTrends(parseInt(days)),
        refetchInterval: 120_000, // 2-minute live refresh
    });

    // Dynamically extract blood type keys from the data (excluding "date" and "Discarded")
    const categories = useMemo(() => {
        if (!trends?.length) return ['Discarded'];
        const keys = new Set<string>();
        for (const point of trends) {
            for (const key of Object.keys(point)) {
                if (key !== 'date') keys.add(key);
            }
        }
        // Put "Discarded" last for visual hierarchy
        const arr = Array.from(keys).filter(k => k !== 'Discarded');
        arr.sort();
        arr.push('Discarded');
        return arr;
    }, [trends]);

    // Custom color map for blood types
    const colorMap: Record<string, string> = {
        'O+': 'red',
        'O-': 'rose',
        'A+': 'blue',
        'A-': 'sky',
        'B+': 'emerald',
        'B-': 'teal',
        'AB+': 'violet',
        'AB-': 'purple',
        'Discarded': 'amber',
        'Unknown': 'gray',
    };

    const colors = categories.map(c => colorMap[c] || 'slate');

    return (
        <div className="space-y-4">
            <Card className="!bg-surface-100 !border-surface-400 !ring-0">
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <Title className="!text-white">
                            {days}-Day National Blood Wastage
                        </Title>
                        <Text className="!text-neutral-500 mt-1">
                            Units marked DISCARDED by blood type · Source: bloodchain-core
                        </Text>
                    </div>
                    <Select
                        value={days}
                        onValueChange={setDays}
                        className="!w-32"
                    >
                        {PERIOD_OPTIONS.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </Select>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center h-[280px]">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-6 h-6 border-2 border-command-gold/30 border-t-command-gold rounded-full animate-spin"></div>
                            <span className="text-xs text-neutral-500 font-mono">LOADING ANALYTICS...</span>
                        </div>
                    </div>
                ) : !trends?.length ? (
                    <div className="flex items-center justify-center h-[280px]">
                        <div className="text-center">
                            <span className="text-3xl opacity-50">📊</span>
                            <p className="text-sm text-neutral-400 mt-2">No wastage data for this period</p>
                            <p className="text-xs text-neutral-600 mt-1">Data will appear as blood units are processed</p>
                        </div>
                    </div>
                ) : (
                    <BarChart
                        className="mt-4 h-[280px]"
                        data={trends}
                        index="date"
                        categories={categories}
                        colors={colors}
                        yAxisWidth={40}
                        showAnimation
                        stack
                    />
                )}
            </Card>

            {/* Secondary: Area chart view */}
            {trends && trends.length > 0 && (
                <Card className="!bg-surface-100 !border-surface-400 !ring-0">
                    <Title className="!text-white">Wastage Trend Line</Title>
                    <Text className="!text-neutral-500">Cumulative discarded units over time</Text>
                    <AreaChart
                        className="mt-4 h-[200px]"
                        data={trends}
                        index="date"
                        categories={['Discarded']}
                        colors={['amber']}
                        yAxisWidth={40}
                        showAnimation
                        curveType="monotone"
                    />
                </Card>
            )}
        </div>
    );
}
