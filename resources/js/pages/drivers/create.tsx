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
import { index as driversIndex, store } from '@/routes/drivers';

export default function CreateDriver() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        phone: '',
        licence_no: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(store().url);
    }

    return (
        <>
            <Head title="Add Driver" />
            <div className="w-full max-w-md p-4">
                <form onSubmit={submit}>
                    <FieldGroup>
                        <FieldSet>
                            <FieldLegend>Add Driver</FieldLegend>
                            <FieldDescription>
                                Enter the new driver's details
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
                            </FieldGroup>
                        </FieldSet>

                        <Field orientation="horizontal">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Saving...' : 'Add Driver'}
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

CreateDriver.layout = {
    breadcrumbs: [
        { title: 'Drivers', href: driversIndex() },
        { title: 'Add', href: '#' },
    ],
};
