import { Head } from '@inertiajs/react';
import { DataTable } from '@/components/ui/data-table';
import { create, index as driversIndex } from '@/routes/drivers';
import { columns, type DriverRow } from './columns';

export default function DriversPage({ drivers }: { drivers: DriverRow[] }) {
    return (
        <>
            <Head title="Drivers" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <DataTable
                    columns={columns}
                    data={drivers}
                    filterColumn="name"
                    filterPlaceholder="Search drivers..."
                    createHref={create()}
                    createLabel="Add Driver"
                />
            </div>
        </>
    );
}

DriversPage.layout = {
    breadcrumbs: [{ title: 'Drivers', href: driversIndex() }],
};
