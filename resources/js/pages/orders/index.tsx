import { Head } from '@inertiajs/react';
import { columns, type Order } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { index as orderRoute, store } from '@/routes/orders';
import { ImportPopover } from '@/components/import-popover';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

OrderPage.layout = {
    breadcrumbs: [{ title: 'Order', href: orderRoute() }],
};

export default function OrderPage({ orders }: { orders: Order[] }) {
    return (
        <>
            <Head title="Order" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Tabs defaultValue="all" className="w-full">
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="new">New</TabsTrigger>
                        <TabsTrigger value="pooled">Pooled</TabsTrigger>
                    </TabsList>
                </Tabs>

                <DataTable
                    columns={columns}
                    data={orders}
                    filterColumn="Daikin_DO"
                    filterPlaceholder="Search Daikin DO..."
                    toolbar={
                        <ImportPopover
                            title="Import Order"
                            description="Select Order files to import."
                            accept=".xlsx,.xls,.csv"
                            route={store().url}
                        />
                    }
                />
            </div>
        </>
    );
}
