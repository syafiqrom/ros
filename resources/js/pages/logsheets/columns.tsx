'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import { type DataTableFeatures } from '@/components/ui/data-table-features';
import { edit } from '@/routes/logsheets';
import { Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';

export type VehicleOption = {
    id: number;
    plate_number: string;
    brand: string;
    model: string;
};

export type LogSheet = {
    id: number;
    date: string;
    status: string;
    vehicle_id: number;
    vehicle: { id: number; plate_number: string } | null;
    start_load_date: string | null;
    start_load_time: string | null;
    dispatch_date: string | null;
    dispatch_time: string | null;
    job_count: number | null;
};

const columnHelper = createColumnHelper<DataTableFeatures, LogSheet>();

// Show "-" for empty values
const orDash = (value: string | null) => value ?? '-';

// Laravel returns time as HH:MM:SS, show HH:MM
const toHHMM = (value: string | null) => (value ? value.slice(0, 5) : '-');

export const columns = columnHelper.columns([
    columnHelper.display({
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                indeterminate={
                    table.getIsSomePageRowsSelected() &&
                    !table.getIsAllPageRowsSelected()
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    }),
    columnHelper.accessor('date', { header: 'Date' }),
    columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ getValue }) => (
            <Badge variant="secondary" className="capitalize">
                {getValue()}
            </Badge>
        ),
    }),
    columnHelper.accessor((row) => row.vehicle?.plate_number ?? '-', {
        id: 'truck_no',
        header: 'Truck No',
    }),
    columnHelper.accessor('start_load_date', {
        header: 'Start Load Date',
        cell: ({ getValue }) => orDash(getValue()),
    }),
    columnHelper.accessor('start_load_time', {
        header: 'Start Load Time',
        cell: ({ getValue }) => toHHMM(getValue()),
    }),
    columnHelper.accessor('dispatch_date', {
        header: 'Dispatch Date',
        cell: ({ getValue }) => orDash(getValue()),
    }),
    columnHelper.accessor('dispatch_time', {
        header: 'Dispatch Time',
        cell: ({ getValue }) => toHHMM(getValue()),
    }),
    columnHelper.accessor('job_count', {
        header: 'Job Order',
        cell: ({ getValue }) =>
            3,
    }),
    columnHelper.display({
        id: 'actions',
        header: 'Actions',
        enableHiding: false,
        cell: ({ row }) => {
            const logsheet = row.original;
            return (
                <div>
                    <Button variant="ghost" size="icon">
                        <Link href={edit(logsheet.id)}>
                            <Pencil className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            );
        },
    }),
]);