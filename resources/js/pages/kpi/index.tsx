import { Head } from '@inertiajs/react';
import { columns, type KPI } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { index as kpiRoute, store } from '@/routes/kpi';
import { ImportPopover } from '@/components/import-popover';

KPIPage.layout = {
    breadcrumbs: [{ title: 'KPI', href: kpiRoute() }],
};

export default function KPIPage({ kpi_reports }: { kpi_reports: KPI[] }) {
    return (
        <>
            <Head title="KPI" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <DataTable
                    columns={columns}
                    data={kpi_reports}
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
