'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import { type DataTableFeatures } from '@/components/ui/data-table-features';

export type Order = {
    id: number;
    vbeln: string;
    pdate: string;
    name: string;
    addr1: string;
    addr2: string;
    city: string;
    region: string;
    tzone: string;
    volum: string;
    priority: string;
    plan_board: string;
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
    columnHelper.accessor('vbeln', {
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
    columnHelper.accessor('pdate', { header: 'P Date' }),
    columnHelper.accessor('name', { header: 'Name' }),
    columnHelper.accessor('addr1', { header: 'Address' }),
    columnHelper.accessor('addr2', { header: 'Address' }),
    columnHelper.accessor('city', { header: 'City' }),
    columnHelper.accessor('region', { header: 'Region' }),
    columnHelper.accessor('tzone', { header: 'Timezone' }),
    columnHelper.accessor('volum', { header: 'Volume' }),
]);
