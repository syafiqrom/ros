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
import { index as vehiclesIndex, store } from '@/routes/vehicles';

const statuses = [
    { label: 'Available', value: 'Available' },
    { label: 'Maintenance', value: 'Maintenance' },
    { label: 'Unavailable', value: 'Unavailable' },
];

export default function CreateVehicle() {
    const { data, setData, post, processing, errors } = useForm({
        plate_number: '',
        brand: '',
        model: '',
        capacity_metric_ton: '',
        capacity_cubic_meter: '',
        cost_per_km: '',
        cost_per_hour: '',
        status: 'Available',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(store().url);
    }

    return (
        <>
            <Head title="Add Vehicle" />
            <div className="w-full max-w-md p-4">
                <form onSubmit={submit}>
                    <FieldGroup>
                        <FieldSet>
                            <FieldLegend>Add Vehicle</FieldLegend>
                            <FieldDescription>
                                Enter the details of the new vehicle
                            </FieldDescription>
                            <FieldGroup>
                                <Field data-invalid={!!errors.plate_number}>
                                    <FieldLabel htmlFor="plate_number">
                                        Plate Number
                                    </FieldLabel>
                                    <Input
                                        id="plate_number"
                                        placeholder="ABC-123"
                                        value={data.plate_number}
                                        onChange={(e) =>
                                            setData(
                                                'plate_number',
                                                e.target.value,
                                            )
                                        }
                                        aria-invalid={!!errors.plate_number}
                                        required
                                    />
                                    {errors.plate_number && (
                                        <FieldError>
                                            {errors.plate_number}
                                        </FieldError>
                                    )}
                                </Field>

                                <div className="grid grid-cols-2 gap-4">
                                    <Field data-invalid={!!errors.brand}>
                                        <FieldLabel htmlFor="brand">
                                            Brand
                                        </FieldLabel>
                                        <Input
                                            id="brand"
                                            placeholder="Toyota"
                                            value={data.brand}
                                            onChange={(e) =>
                                                setData('brand', e.target.value)
                                            }
                                            aria-invalid={!!errors.brand}
                                            required
                                        />
                                        {errors.brand && (
                                            <FieldError>
                                                {errors.brand}
                                            </FieldError>
                                        )}
                                    </Field>
                                    <Field data-invalid={!!errors.model}>
                                        <FieldLabel htmlFor="model">
                                            Model
                                        </FieldLabel>
                                        <Input
                                            id="model"
                                            placeholder="Hilux"
                                            value={data.model}
                                            onChange={(e) =>
                                                setData('model', e.target.value)
                                            }
                                            aria-invalid={!!errors.model}
                                            required
                                        />
                                        {errors.model && (
                                            <FieldError>
                                                {errors.model}
                                            </FieldError>
                                        )}
                                    </Field>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Field
                                        data-invalid={
                                            !!errors.capacity_metric_ton
                                        }
                                    >
                                        <FieldLabel htmlFor="capacity_metric_ton">
                                            Capacity (ton)
                                        </FieldLabel>
                                        <Input
                                            id="capacity_metric_ton"
                                            type="number"
                                            min={0}
                                            step="0.01"
                                            placeholder="3.5"
                                            value={data.capacity_metric_ton}
                                            onChange={(e) =>
                                                setData(
                                                    'capacity_metric_ton',
                                                    e.target.value,
                                                )
                                            }
                                            aria-invalid={
                                                !!errors.capacity_metric_ton
                                            }
                                        />
                                        {errors.capacity_metric_ton && (
                                            <FieldError>
                                                {errors.capacity_metric_ton}
                                            </FieldError>
                                        )}
                                    </Field>
                                    <Field
                                        data-invalid={
                                            !!errors.capacity_cubic_meter
                                        }
                                    >
                                        <FieldLabel htmlFor="capacity_cubic_meter">
                                            Capacity (m³)
                                        </FieldLabel>
                                        <Input
                                            id="capacity_cubic_meter"
                                            type="number"
                                            min={0}
                                            step="0.01"
                                            placeholder="12"
                                            value={data.capacity_cubic_meter}
                                            onChange={(e) =>
                                                setData(
                                                    'capacity_cubic_meter',
                                                    e.target.value,
                                                )
                                            }
                                            aria-invalid={
                                                !!errors.capacity_cubic_meter
                                            }
                                        />
                                        {errors.capacity_cubic_meter && (
                                            <FieldError>
                                                {errors.capacity_cubic_meter}
                                            </FieldError>
                                        )}
                                    </Field>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Field data-invalid={!!errors.cost_per_km}>
                                        <FieldLabel htmlFor="cost_per_km">
                                            Cost per km
                                        </FieldLabel>
                                        <Input
                                            id="cost_per_km"
                                            type="number"
                                            min={0}
                                            step="0.01"
                                            placeholder="1.50"
                                            value={data.cost_per_km}
                                            onChange={(e) =>
                                                setData(
                                                    'cost_per_km',
                                                    e.target.value,
                                                )
                                            }
                                            aria-invalid={!!errors.cost_per_km}
                                        />
                                        {errors.cost_per_km && (
                                            <FieldError>
                                                {errors.cost_per_km}
                                            </FieldError>
                                        )}
                                    </Field>
                                    <Field
                                        data-invalid={!!errors.cost_per_hour}
                                    >
                                        <FieldLabel htmlFor="cost_per_hour">
                                            Cost per hour
                                        </FieldLabel>
                                        <Input
                                            id="cost_per_hour"
                                            type="number"
                                            min={0}
                                            step="0.01"
                                            placeholder="45.00"
                                            value={data.cost_per_hour}
                                            onChange={(e) =>
                                                setData(
                                                    'cost_per_hour',
                                                    e.target.value,
                                                )
                                            }
                                            aria-invalid={
                                                !!errors.cost_per_hour
                                            }
                                        />
                                        {errors.cost_per_hour && (
                                            <FieldError>
                                                {errors.cost_per_hour}
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
                                            setData('status', value as any)
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
                                {processing ? 'Adding...' : 'Add Vehicle'}
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

CreateVehicle.layout = {
    breadcrumbs: [
        { title: 'Vehicles', href: vehiclesIndex() },
        { title: 'Add', href: '/vehicles/create' },
    ],
};
