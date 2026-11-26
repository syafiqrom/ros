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
    columnHelper.accessor('vbeln', { header: 'Daikin DO' }),
    columnHelper.accessor('pdate', { header: 'P Date' }),
    columnHelper.accessor('name', {
        header: 'Name',
        cell: ({ getValue }) => (
            <div
                className="max-w-[10rem] truncate"
                title={getValue()}
            >
                {getValue()}
            </div>
        ),
    }),
    columnHelper.accessor('addr1', { header: 'Address 1' }),
    columnHelper.accessor('addr2', { header: 'Address 2' }),
    columnHelper.accessor('tzone', { header: 'Zone' }),
    columnHelper.accessor('volum', { header: 'Volume' }),
]);
