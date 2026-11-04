import { Link } from '@inertiajs/react';
import { createColumnHelper } from '@tanstack/react-table';
import { ArrowUpDown, Eye, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type DataTableFeatures } from '@/components/ui/data-table-features';
import { formatDate } from '@/lib/format';
import { edit, show } from '@/routes/drivers';
import { Checkbox } from '@/components/ui/checkbox';

export type DriverStatus = 'active' | 'inactive';

export type DriverRow = {
    id: number;
    name: string;
    phone: string;
    licence_no: string;
    status: DriverStatus;
    created_at: string;
};

const columnHelper = createColumnHelper<DataTableFeatures, DriverRow>();

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
    columnHelper.accessor('phone', { header: 'Phone' }),
    columnHelper.accessor('licence_no', { header: 'Licence No' }),
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
    columnHelper.accessor('created_at', {
        header: 'Joined',
        cell: ({ getValue }) => formatDate(getValue()),
    }),
    columnHelper.display({
        id: 'actions',
        header: 'Actions',
        enableHiding: false,
        cell: ({ row }) => {
            const driver = row.original;

            return (
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        render={<Link href={show(driver.id)} />}
                        nativeButton={false}
                        aria-label={`View ${driver.name}`}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        render={<Link href={edit(driver.id)} />}
                        nativeButton={false}
                        aria-label={`Edit ${driver.name}`}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    }),
]);
