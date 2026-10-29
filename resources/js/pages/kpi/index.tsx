import * as React from 'react';
import { Head } from '@inertiajs/react';
import { columns, type KPI } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { index as kpiRoute, store } from '@/routes/kpi';
import { ImportPopover } from '@/components/import-popover';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePicker } from '@/components/date-picker';
import { isSameDay, parseISO } from 'date-fns';

KPIPage.layout = {
    breadcrumbs: [{ title: 'KPI', href: kpiRoute() }],
};

export default function KPIPage({ kpi_reports }: { kpi_reports: KPI[] }) {
    const [date, setDate] = React.useState<Date | undefined>();

    // Filter kpi_reports by Est Delivery Date
    const filteredReports = React.useMemo(() => {
        if (!date) return kpi_reports;
        return kpi_reports.filter(
            (row) =>
                row.est_delivery_date &&
                isSameDay(parseISO(row.est_delivery_date), date),
        );
    }, [kpi_reports, date]);

    return (
        <>
            <Head title="KPI" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex justify-between items-center">
                    <Tabs defaultValue="pass" className="w-full">
                        <TabsList>
                            <TabsTrigger value="pass">Pass</TabsTrigger>
                            <TabsTrigger value="on_delivery">On Delivery</TabsTrigger>
                            <TabsTrigger value="no_iod">No IOD</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <DatePicker value={date} onChange={setDate} />
                </div>

                <DataTable
                    columns={columns}
                    data={filteredReports}
                    filterColumn="job_no"
                    filterPlaceholder="Search job number..."
                    toolbar={
                        <ImportPopover
                            title="Import KPI Report"
                            description="Select KPI_Report_ files to import."
                            accept=".xlsx,.xls,.csv"
                            route={store.url()}
                        />
                    }
                />
            </div>
        </>
    );
}
