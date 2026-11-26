import { Head, useForm } from '@inertiajs/react';
import { columns, type Order } from './columns_orders';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { router } from "@inertiajs/react"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { index as logsheetsIndex, update, storeJobOrder } from '@/routes/logsheets';
import type { LogSheet, VehicleOption } from './columns';

const statuses = [
    { label: 'New', value: 'New' },
    { label: 'Dispatched', value: 'Dispatched' },
] as const;

type LogSheetStatus = (typeof statuses)[number]['value'];

const vehicleLabel = (v: VehicleOption) =>
    `${v.plate_number} - ${v.brand} ${v.model}`;

export default function EditLogSheet({
    logsheet,
    vehicles,
    orders,
    selectedVbelns,
}: {
    logsheet: LogSheet;
    vehicles: VehicleOption[];
    orders: Order[];
    selectedVbelns: string[];
}) {
    const { data, setData, put, processing, errors } = useForm({
        date: logsheet.date,
        status: logsheet.status as LogSheetStatus,
        vehicle_id: String(logsheet.vehicle_id),
        start_load_date: logsheet.start_load_date ?? '',
        start_load_time: logsheet.start_load_time?.slice(0, 5) ?? '',
        dispatch_date: logsheet.dispatch_date ?? '',
        dispatch_time: logsheet.dispatch_time?.slice(0, 5) ?? '',
    });

    const selectedVehicle = vehicles.find(
        (v) => String(v.id) === data.vehicle_id,
    );

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(update(logsheet.id).url);
    }

    return (
        <>
            <Head title="Edit Log Sheet" />
            <div className="w-full p-4">
                <form onSubmit={submit}>
                    <FieldGroup>
                        <FieldSet>
                            <FieldLegend>Edit Log Sheet</FieldLegend>
                            <FieldDescription>
                                Update the details of this log sheet
                            </FieldDescription>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <Field data-invalid={!!errors.date}>
                                    <FieldLabel htmlFor="date">Date</FieldLabel>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={data.date}
                                        onChange={(e) =>
                                            setData('date', e.target.value)
                                        }
                                        aria-invalid={!!errors.date}
                                        required
                                    />
                                    {errors.date && (
                                        <FieldError>{errors.date}</FieldError>
                                    )}
                                </Field>

                                <Field data-invalid={!!errors.vehicle_id}>
                                    <FieldLabel htmlFor="vehicle_id">
                                        Vehicle
                                    </FieldLabel>
                                    <Select
                                        value={data.vehicle_id}
                                        onValueChange={(value) =>
                                            setData('vehicle_id', value as string)
                                        }
                                    >
                                        <SelectTrigger
                                            id="vehicle_id"
                                            className="w-full"
                                            aria-invalid={!!errors.vehicle_id}
                                        >
                                            <SelectValue placeholder="Select vehicle">
                                                {selectedVehicle
                                                    ? vehicleLabel(selectedVehicle)
                                                    : undefined}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {vehicles.map((v) => (
                                                    <SelectItem
                                                        key={v.id}
                                                        value={String(v.id)}
                                                    >
                                                        {vehicleLabel(v)}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {errors.vehicle_id && (
                                        <FieldError>
                                            {errors.vehicle_id}
                                        </FieldError>
                                    )}
                                </Field>

                                <Field data-invalid={!!errors.status}>
                                    <FieldLabel htmlFor="status">
                                        Status
                                    </FieldLabel>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) =>
                                            setData(
                                                'status',
                                                value as LogSheetStatus,
                                            )
                                        }
                                    >
                                        <SelectTrigger
                                            id="status"
                                            className="w-full"
                                        >
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {statuses.map((item) => (
                                                    <SelectItem
                                                        key={item.value}
                                                        value={item.value}
                                                    >
                                                        {item.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && (
                                        <FieldError>{errors.status}</FieldError>
                                    )}
                                </Field>

                                {/* empty cell keeps row 2 aligned on lg */}
                                <div className="hidden lg:block" />

                                <Field data-invalid={!!errors.start_load_date}>
                                    <FieldLabel htmlFor="start_load_date">
                                        Start Load Date
                                    </FieldLabel>
                                    <Input
                                        id="start_load_date"
                                        type="date"
                                        value={data.start_load_date}
                                        onChange={(e) =>
                                            setData(
                                                'start_load_date',
                                                e.target.value,
                                            )
                                        }
                                        aria-invalid={!!errors.start_load_date}
                                    />
                                    {errors.start_load_date && (
                                        <FieldError>
                                            {errors.start_load_date}
                                        </FieldError>
                                    )}
                                </Field>

                                <Field data-invalid={!!errors.start_load_time}>
                                    <FieldLabel htmlFor="start_load_time">
                                        Start Load Time
                                    </FieldLabel>
                                    <Input
                                        id="start_load_time"
                                        type="time"
                                        value={data.start_load_time}
                                        onChange={(e) =>
                                            setData(
                                                'start_load_time',
                                                e.target.value,
                                            )
                                        }
                                        aria-invalid={!!errors.start_load_time}
                                    />
                                    {errors.start_load_time && (
                                        <FieldError>
                                            {errors.start_load_time}
                                        </FieldError>
                                    )}
                                </Field>

                                <Field data-invalid={!!errors.dispatch_date}>
                                    <FieldLabel htmlFor="dispatch_date">
                                        Dispatch Date
                                    </FieldLabel>
                                    <Input
                                        id="dispatch_date"
                                        type="date"
                                        value={data.dispatch_date}
                                        onChange={(e) =>
                                            setData(
                                                'dispatch_date',
                                                e.target.value,
                                            )
                                        }
                                        aria-invalid={!!errors.dispatch_date}
                                    />
                                    {errors.dispatch_date && (
                                        <FieldError>
                                            {errors.dispatch_date}
                                        </FieldError>
                                    )}
                                </Field>

                                <Field data-invalid={!!errors.dispatch_time}>
                                    <FieldLabel htmlFor="dispatch_time">
                                        Dispatch Time
                                    </FieldLabel>
                                    <Input
                                        id="dispatch_time"
                                        type="time"
                                        value={data.dispatch_time}
                                        onChange={(e) =>
                                            setData(
                                                'dispatch_time',
                                                e.target.value,
                                            )
                                        }
                                        aria-invalid={!!errors.dispatch_time}
                                    />
                                    {errors.dispatch_time && (
                                        <FieldError>
                                            {errors.dispatch_time}
                                        </FieldError>
                                    )}
                                </Field>
                            </div>
                        </FieldSet>

                        <Field orientation="horizontal">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Saving...' : 'Save Changes'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.history.back()}
                            >
                                Cancel
                            </Button>
                        </Field>
                    </FieldGroup>
                </form>
            </div>

            <div className="w-full p-4">
                <DataTable
                    columns={columns}
                    data={orders}
                    getRowId={(row) => row.vbeln}
                    filterColumn="vbeln"
                    initialSelectedIds={selectedVbelns}
                    toolbar={({ selectedIds, clear }) => (
                        <Button
                            disabled={selectedIds.length === 0}
                            onClick={() =>
                                router.post(
                                    storeJobOrder(logsheet.id).url,
                                    { vbeln: selectedIds },
                                )
                            }
                        >
                            Submit ({selectedIds.length})
                        </Button>
                    )}
                />
            </div>
        </>
    );
}

EditLogSheet.layout = {
    breadcrumbs: [
        { title: 'Log Sheet', href: logsheetsIndex() },
        { title: 'Edit', href: '#' },
    ],
};