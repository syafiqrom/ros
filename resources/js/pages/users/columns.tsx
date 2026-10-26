import { createColumnHelper } from '@tanstack/react-table';
import { type DataTableFeatures } from '@/components/data-table/data-table-features';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { edit, show } from '@/routes/users';
import { formatDate } from '@/lib/format';

export type UserRow = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null; //null = not verified
    created_at: string; //dates arrive at strings in JSON
};

const columnHelper = createColumnHelper<DataTableFeatures, UserRow>();

export const columns = columnHelper.columns([
    columnHelper.display({
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
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
        enableHiding: false,
        cell: ({ row }) => {
            const user = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link href={show(user.id)}>View</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={edit(user.id)}>Edit</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }),
]);
