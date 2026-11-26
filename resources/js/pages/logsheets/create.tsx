import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
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
import { index as logsheetsIndex, store } from '@/routes/logsheets';
import type { VehicleOption } from './columns';

const statuses = [
    { label: 'New', value: 'New' },
    { label: 'Dispatched', value: 'Dispatched' },
] as const;

type LogSheetStatus = (typeof statuses)[number]['value'];

const vehicleLabel = (v: VehicleOption) =>
    `${v.plate_number} - ${v.brand} ${v.model}`;

export default function CreateLogSheet({
    vehicles,
}: {
    vehicles: VehicleOption[];
}) {
    const { data, setData, post, processing, errors } = useForm({
        date: '',
        status: 'New' as LogSheetStatus,
        vehicle_id: '',
        start_load_date: '',
        start_load_time: '',
        dispatch_date: '',
        dispatch_time: '',
    });

    const selectedVehicle = vehicles.find(
        (v) => String(v.id) === data.vehicle_id,
    );

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(store().url);
    }

    return (
        <>
            <Head title="Add Log Sheet" />
            <div className="w-full max-w-md p-4">
                <form onSubmit={submit}>
                    <FieldGroup>
                        <FieldSet>
                            <FieldLegend>Add Log Sheet</FieldLegend>
                            <FieldDescription>
                                Enter the details of the new log sheet
                            </FieldDescription>
                            <FieldGroup>
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

                                <div className="grid grid-cols-2 gap-4">
                                    <Field
                                        data-invalid={!!errors.start_load_date}
                                    >
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
                                            aria-invalid={
                                                !!errors.start_load_date
                                            }
                                        />
                                        {errors.start_load_date && (
                                            <FieldError>
                                                {errors.start_load_date}
                                            </FieldError>
                                        )}
                                    </Field>
                                    <Field
                                        data-invalid={!!errors.start_load_time}
                                    >
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
                                            aria-invalid={
                                                !!errors.start_load_time
                                            }
                                        />
                                        {errors.start_load_time && (
                                            <FieldError>
                                                {errors.start_load_time}
                                            </FieldError>
                                        )}
                                    </Field>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Field
                                        data-invalid={!!errors.dispatch_date}
                                    >
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
                                            aria-invalid={
                                                !!errors.dispatch_date
                                            }
                                        />
                                        {errors.dispatch_date && (
                                            <FieldError>
                                                {errors.dispatch_date}
                                            </FieldError>
                                        )}
                                    </Field>
                                    <Field
                                        data-invalid={!!errors.dispatch_time}
                                    >
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
                                            aria-invalid={
                                                !!errors.dispatch_time
                                            }
                                        />
                                        {errors.dispatch_time && (
                                            <FieldError>
                                                {errors.dispatch_time}
                                            </FieldError>
                                        )}
                                    </Field>
                                </div>

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
                                        <SelectTrigger id="status">
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
                            </FieldGroup>
                        </FieldSet>

                        <Field orientation="horizontal">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Adding...' : 'Add Log Sheet'}
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
        </>
    );
}

CreateLogSheet.layout = {
    breadcrumbs: [
        { title: 'Log Sheet', href: logsheetsIndex() },
        { title: 'Add', href: '/logsheets/create' },
    ],
};