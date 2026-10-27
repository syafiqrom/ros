import { Head } from '@inertiajs/react';
import { columns, type Vehicle } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { index as vehiclesRoute, create } from '@/routes/vehicles';

VehiclesPage.layout = {
    breadcrumbs: [{ title: 'Vehicles', href: vehiclesRoute() }],
};

export default function VehiclesPage({ vehicles }: { vehicles: Vehicle[] }) {
    return (
        <>
            <Head title="Vehicles" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <DataTable
                    columns={columns}
                    data={vehicles}
                    filterColumn="plate_number"
                    filterPlaceholder="Search plate numbers..."
                    createHref={create()}
                    createLabel="Add Vehicle"
                />
            </div>
        </>
    );
}

VehiclesPage.layout = {
    breadcrumbs: [{ title: 'Vehicles', href: 'vehicles' }],
};