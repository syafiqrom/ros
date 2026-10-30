import * as React from 'react';
import { Head } from '@inertiajs/react';
import { columns, type Order } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { index as orderRoute, store } from '@/routes/orders';
import { ImportPopover } from '@/components/import-popover';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePicker } from '@/components/date-picker';
import { isSameDay, parseISO } from 'date-fns';

OrderPage.layout = {
    breadcrumbs: [{ title: 'Order', href: orderRoute() }],
};

export default function OrderPage({ orders }: { orders: Order[] }) {
    const [date, setDate] = React.useState<Date | undefined>();

    // Filter kpi_reports by Est Delivery Date
    const filteredOrders = React.useMemo(() => {
        if (!date) return orders;
        return orders.filter(
            (row) =>
                row.created_at && isSameDay(parseISO(row.created_at), date),
        );
    }, [orders, date]);

    return (
        <>
            <Head title="Order" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Tabs defaultValue="all" className="w-full">
                        <TabsList>
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="new">New</TabsTrigger>
                            <TabsTrigger value="pooled">Pooled</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <DatePicker value={date} onChange={setDate} />
                </div>

                <DataTable
                    columns={columns}
                    data={filteredOrders}
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
