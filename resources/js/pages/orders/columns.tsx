'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import { type DataTableFeatures } from '@/components/ui/data-table-features';

export type Order = {
    id: number;
    daikin_do: string;
    address: string;
    delivery_point_name: string;
    is_in_pool: boolean;
    created_at: string;
};

const columnHelper = createColumnHelper<DataTableFeatures, Order>();

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
    columnHelper.accessor('daikin_do', {
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === 'asc')
                }
            >
                Daikin DO
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    }),
    columnHelper.accessor('address', { header: 'Address' }),
    columnHelper.accessor('delivery_point_name', { header: 'Delivery Point' }),
    columnHelper.accessor('is_in_pool', { header: 'In Pool' }),
    columnHelper.accessor('created_at', { header: 'Created At' }),
]);
