import { Head } from '@inertiajs/react';
import { columns, type Vehicle } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { index as vehiclesRoute } from '@/routes/vehicles';
import { Link } from '@inertiajs/react';
import { create } from '@/routes/vehicles';
import { Button } from '@/components/ui/button';

VehiclesPage.layout = {
    breadcrumbs: [{ title: 'Vehicles', href: vehiclesRoute() }],
};

export default function VehiclesPage({ vehicles }: { vehicles: Vehicle[] }) {
    return (
        <>
            <Head title="Vehicles" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <DataTable columns={columns} data={vehicles} />
            </div>
        </>
    );
}

VehiclesPage.layout = {
    breadcrumbs: [{ title: 'Vehicles', href: 'vehicles' }],
};