import { Head, Link, useForm } from '@inertiajs/react';
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
        capacity: '',
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
                                        onChange={(e) => setData('plate_number', e.target.value)}
                                        aria-invalid={!!errors.plate_number}
                                        required
                                    />
                                    {errors.plate_number && (
                                        <FieldError>{errors.plate_number}</FieldError>
                                    )}
                                </Field>

                                <div className="grid grid-cols-2 gap-4">
                                    <Field data-invalid={!!errors.brand}>
                                        <FieldLabel htmlFor="brand">Brand</FieldLabel>
                                        <Input
                                            id="brand"
                                            placeholder="Toyota"
                                            value={data.brand}
                                            onChange={(e) => setData('brand', e.target.value)}
                                            aria-invalid={!!errors.brand}
                                            required
                                        />
                                        {errors.brand && <FieldError>{errors.brand}</FieldError>}
                                    </Field>
                                    <Field data-invalid={!!errors.model}>
                                        <FieldLabel htmlFor="model">Model</FieldLabel>
                                        <Input
                                            id="model"
                                            placeholder="Camry"
                                            value={data.model}
                                            onChange={(e) => setData('model', e.target.value)}
                                            aria-invalid={!!errors.model}
                                            required
                                        />
                                        {errors.model && <FieldError>{errors.model}</FieldError>}
                                    </Field>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Field data-invalid={!!errors.capacity}>
                                        <FieldLabel htmlFor="capacity">Capacity</FieldLabel>
                                        <Input
                                            id="capacity"
                                            type="number"
                                            min={1}
                                            placeholder="5"
                                            value={data.capacity}
                                            onChange={(e) => setData('capacity', e.target.value)}
                                            aria-invalid={!!errors.capacity}
                                            required
                                        />
                                        {errors.capacity && (
                                            <FieldError>{errors.capacity}</FieldError>
                                        )}
                                    </Field>
                                    <Field data-invalid={!!errors.status}>
                                        <FieldLabel htmlFor="status">Status</FieldLabel>
                                        <Select
                                            value={data.status}
                                            onValueChange={(value) => setData('status', value)}
                                        >
                                            <SelectTrigger id="status">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {statuses.map((item) => (
                                                        <SelectItem key={item.value} value={item.value}>
                                                            {item.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {errors.status && <FieldError>{errors.status}</FieldError>}
                                    </Field>
                                </div>
                            </FieldGroup>
                        </FieldSet>

                        <Field orientation="horizontal">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Adding...' : 'Add Vehicle'}
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href={vehiclesIndex()}>Cancel</Link>
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