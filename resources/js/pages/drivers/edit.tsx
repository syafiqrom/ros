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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { index as driversIndex, update } from '@/routes/drivers';
import { type DriverRow } from './columns';
import { statusOptions } from './options';

type EditableDriver = Pick<
    DriverRow,
    'id' | 'name' | 'phone' | 'licence_no' | 'status'
>;

export default function EditDriver({ driver }: { driver: EditableDriver }) {
    const { data, setData, put, processing, errors } = useForm({
        name: driver.name,
        phone: driver.phone,
        licence_no: driver.licence_no,
        status: driver.status,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(update(driver.id).url);
    }

    return (
        <>
            <Head title="Edit Driver" />
            <div className="w-full max-w-md p-4">
                <form onSubmit={submit}>
                    <FieldGroup>
                        <FieldSet>
                            <FieldLegend>Edit Driver</FieldLegend>
                            <FieldDescription>
                                Update this driver's details
                            </FieldDescription>
                            <FieldGroup>
                                <Field data-invalid={!!errors.name}>
                                    <FieldLabel htmlFor="name">Name</FieldLabel>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        aria-invalid={!!errors.name}
                                        required
                                    />
                                    {errors.name && (
                                        <FieldError>{errors.name}</FieldError>
                                    )}
                                </Field>

                                <Field data-invalid={!!errors.phone}>
                                    <FieldLabel htmlFor="phone">
                                        Phone
                                    </FieldLabel>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="012-345 6789"
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData('phone', e.target.value)
                                        }
                                        aria-invalid={!!errors.phone}
                                        required
                                    />
                                    {errors.phone && (
                                        <FieldError>{errors.phone}</FieldError>
                                    )}
                                </Field>

                                <Field data-invalid={!!errors.licence_no}>
                                    <FieldLabel htmlFor="licence_no">
                                        Licence No
                                    </FieldLabel>
                                    <Input
                                        id="licence_no"
                                        value={data.licence_no}
                                        onChange={(e) =>
                                            setData(
                                                'licence_no',
                                                e.target.value,
                                            )
                                        }
                                        aria-invalid={!!errors.licence_no}
                                        required
                                    />
                                    {errors.licence_no && (
                                        <FieldError>
                                            {errors.licence_no}
                                        </FieldError>
                                    )}
                                </Field>

                                <Field data-invalid={!!errors.status}>
                                    <FieldLabel htmlFor="status">
                                        Status
                                    </FieldLabel>
                                    <Select
                                        items={statusOptions}
                                        value={data.status}
                                        onValueChange={(value) =>
                                            setData(
                                                'status',
                                                value as DriverRow['status'],
                                            )
                                        }
                                    >
                                        <SelectTrigger id="status">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {statusOptions.map((option) => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
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
                                {processing ? 'Saving...' : 'Save changes'}
                            </Button>
                            <Button
                                variant="outline"
                                render={<Link href={driversIndex()} />}
                                nativeButton={false}
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

EditDriver.layout = {
    breadcrumbs: [
        { title: 'Drivers', href: driversIndex() },
        { title: 'Edit', href: '#' },
    ],
};
