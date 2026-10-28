'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { ArrowUpDown, Pencil, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';

import { type DataTableFeatures } from '@/components/ui/data-table-features';
import { edit, show } from '@/routes/users';

import { formatDate } from '@/lib/format';

export type UserRow = {
    id: number;
    name: string;
    email: string;
    role: 'planner' | 'manager';
    status: 'active' | 'deactivated';
    email_verified_at: string | null; //null = not verified
    created_at: string; //dates arrive at strings in JSON
};

const columnHelper = createColumnHelper<DataTableFeatures, UserRow>();

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
    columnHelper.accessor('name', {
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === 'asc')
                }
            >
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    }),
    columnHelper.accessor('email', { header: 'Email' }),
    columnHelper.accessor('role', {
        header: 'Role',
        cell: ({ getValue }) => (
            <Badge
                variant={getValue() === 'manager' ? 'default' : 'secondary'}
                className="capitalize"
            >
                {getValue()}
            </Badge>
        ),
    }),
    columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ getValue }) => (
            <Badge
                variant={getValue() === 'active' ? 'outline' : 'destructive'}
                className="capitalize"
            >
                {getValue()}
            </Badge>
        ),
    }),
    columnHelper.accessor('email_verified_at', {
        header: 'Verified',
        cell: ({ getValue }) =>
            getValue() ? (
                <Badge>Verified</Badge>
            ) : (
                <Badge variant="outline">Unverified</Badge>
            ),
    }),
    columnHelper.accessor('created_at', {
        header: 'Joined',
        cell: ({ getValue }) => formatDate(getValue()),
    }),
    columnHelper.display({
        id: 'actions',
        header: 'Actions',
        enableHiding: false,
        cell: ({ row }) => {
            const user = row.original;
            return (
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                        <Link href={show(user.id)}>
                            <Eye className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Button variant="ghost" size="icon">
                        <Link href={edit(user.id)}>
                            <Pencil className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            );
        },
    }),
]);
