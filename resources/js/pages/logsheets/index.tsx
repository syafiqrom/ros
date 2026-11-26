import * as React from 'react';
import { Head, Link } from '@inertiajs/react';
import { columns, type LogSheet } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { index as logsheetRoute, create } from '@/routes/logsheets';
import { buttonVariants } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePicker } from '@/components/date-picker';
import { isSameDay, parseISO } from 'date-fns';

LogSheetPage.layout = {
    breadcrumbs: [{ title: 'Log Sheet', href: logsheetRoute() }],
};

export default function LogSheetPage({ logsheets }: { logsheets: LogSheet[] }) {
    const [date, setDate] = React.useState<Date | undefined>();
    const [status, setStatus] = React.useState('all');

    // Filter by status tab and Log Sheet date
    const filteredLogSheets = React.useMemo(() => {
        return logsheets.filter((row) => {
            const matchStatus = status === 'all' || row.status === status;
            const matchDate =
                !date || (row.date && isSameDay(parseISO(row.date), date));
            return matchStatus && matchDate;
        });
    }, [logsheets, date, status]);

    return (
        <>
            <Head title="Log Sheet" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Tabs
                        value={status}
                        onValueChange={setStatus}
                        className="w-full"
                    >
                        <TabsList>
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="new">New</TabsTrigger>
                            <TabsTrigger value="dispatched">
                                Dispatched
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <DatePicker value={date} onChange={setDate} />
                </div>

                <DataTable
                    columns={columns}
                    data={filteredLogSheets}
                    filterColumn="logsheet_no"
                    filterPlaceholder="Search Log Sheet No..."
                    toolbar={
                        <Link href={create()} className={buttonVariants()}>
                            New Log Sheet
                        </Link>
                    }
                />
            </div>
        </>
    );
}