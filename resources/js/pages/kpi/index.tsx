import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { columns, type KPI } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { index as kpiRoute, store } from '@/routes/kpi';
import { Button } from '@/components/ui/button';
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
    FieldDescription,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverHeader,
    PopoverTitle,
    PopoverDescription,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useForm } from '@inertiajs/react';

KPIPage.layout = {
    breadcrumbs: [{ title: 'KPI', href: kpiRoute() }],
};

export default function KPIPage({ kpi_reports }: { kpi_reports: KPI[] }) {
    const [open, setOpen] = useState(false);

    const { setData, post, processing, errors, reset, clearErrors } = useForm<{
        file: File | null;
    }>({
        file: null,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(store().url, {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    }

    return (
        <>
            <Head title="KPI" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <DataTable
                    columns={columns}
                    data={kpi_reports}
                    filterColumn="job_no"
                    filterPlaceholder="Search job number..."
                    // createHref=
                    createLabel="Import Excel"
                />

                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger render={<Button variant="outline">Open Popover</Button>} />
                    <PopoverContent className="w-64" align="start">
                        <PopoverHeader>
                            <PopoverTitle>Import KPI Report</PopoverTitle>
                            <PopoverDescription>
                                Select KPI_Report_ files to import.
                            </PopoverDescription>
                        </PopoverHeader>

                        <form onSubmit={submit}>
                            <FieldGroup className="gap-4">
                                <Field>
                                    <Input
                                        id="file"
                                        type="file"
                                        accept=".xlsx,.xls,.csv"
                                        onChange={(e) => {
                                            clearErrors('file');
                                            setData('file', e.target.files?.[0] ?? null);
                                        }}
                                    />
                                    {errors.file && (
                                        <p className="text-sm text-destructive">{errors.file}</p>
                                    )}
                                </Field>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Importing...' : 'Import file'}
                                </Button>
                            </FieldGroup>
                        </form>
                    </PopoverContent>
                </Popover>
            </div>
        </>
    );
}

KPIPage.layout = {
    breadcrumbs: [{ title: 'KPI', href: 'kpi' }],
};
