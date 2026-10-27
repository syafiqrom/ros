import { Input } from '@/components/ui/input';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { index as usersIndex, store } from '@/routes/users';
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from '@/components/ui/field';

export default function CreateUser() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(store().url);
    }

    return (
        <>
            <Head title="Create User" />
            <div className="w-full max-w-md p-4">
                <form onSubmit={submit}>
                    <FieldGroup>
                        <FieldSet>
                            <FieldLegend>Create User</FieldLegend>
                            <FieldDescription>
                                Enter the new user's name and email
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

                                <Field data-invalid={!!errors.email}>
                                    <FieldLabel htmlFor="email">
                                        Email
                                    </FieldLabel>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        aria-invalid={!!errors.email}
                                        required
                                    />
                                    {errors.email && (
                                        <FieldError>{errors.email}</FieldError>
                                    )}
                                </Field>

                                <Field data-invalid={!!errors.password}>
                                    <FieldLabel htmlFor="password">
                                        Password
                                    </FieldLabel>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        aria-invalid={!!errors.password}
                                        required
                                    />
                                    {errors.password && (
                                        <FieldError>{errors.password}</FieldError>
                                    )}
                                </Field>

                                <Field data-invalid={!!errors.password_confirmation}>
                                    <FieldLabel htmlFor="password_confirmation">
                                        Confirm Password
                                    </FieldLabel>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData('password_confirmation', e.target.value)
                                        }
                                        aria-invalid={!!errors.password_confirmation}
                                        required
                                    />
                                    {errors.password_confirmation && (
                                        <FieldError>{errors.password_confirmation}</FieldError>
                                    )}
                                </Field>
                            </FieldGroup>
                        </FieldSet>
                        <Field orientation="horizontal">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creating...' : 'Create user'}
                            </Button>
                            <Button
                                variant="outline"
                                nativeButton={false}
                                render={<Link href={usersIndex()} />}
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

CreateUser.layout = {
    breadcrumbs: [
        { title: 'Users', href: usersIndex() },
        { title: 'Create', href: '#' },
    ],
};