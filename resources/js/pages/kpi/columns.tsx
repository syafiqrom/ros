'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { ArrowUpDown, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDate, formatDateTime } from '@/lib/format';

import { type DataTableFeatures } from '@/components/ui/data-table-features';

export type KPI = {
    id: number;
    truck_load_no: string;
    job_no: string;
    job_date: string;
    daikin_do: string;
    delivery_point_name: string;
    truck_no: string;
    iod_date: string;
    est_delivery_date: string;
    est_delivery_time: string;
    kpi_pass: string;
};

const columnHelper = createColumnHelper<DataTableFeatures, KPI>();

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
    columnHelper.accessor('truck_load_no', {
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === 'asc')
                }
            >
                Truck Load No
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    }),
    columnHelper.accessor('job_no', { header: 'Job No' }),
    columnHelper.accessor('job_date', {
        header: 'Job Date',
        cell: (info) => formatDate(info.getValue()),
    }),
    columnHelper.accessor('daikin_do', { header: 'Daikin DO' }),
    columnHelper.accessor('delivery_point_name', { header: 'Delivery Point Name' }),
    columnHelper.accessor('truck_no', { header: 'Truck No' }),
    columnHelper.accessor('iod_date', {
        header: 'IOD Date Time',
        cell: (info) => formatDateTime(info.getValue()),
    }),
    columnHelper.accessor('est_delivery_date', {
        header: 'Est Delivery Date',
        cell: (info) => formatDate(info.getValue()),
    }),
    columnHelper.accessor('est_delivery_time', { header: 'Est Delivery Time' }),
    columnHelper.accessor('kpi_pass', { header: 'KPI Status' }),
]);
