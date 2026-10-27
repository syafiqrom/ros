import { Input } from '@/components/ui/input';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { index as usersIndex, show, update } from '@/routes/users';
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from '@/components/ui/field';
import { type UserRow } from './columns';

type EditableUser = Pick<UserRow, 'id' | 'name' | 'email'>;

export default function EditUser({ user }: { user: EditableUser }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
    });
    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(update(user.id).url);
    }

    return (
        <>
            <Head title="Edit User" />
            <div className="w-full max-w-md p-4">
                <form onSubmit={submit}>
                    <FieldGroup>
                        <FieldSet>
                            <FieldLegend>Edit User</FieldLegend>
                            <FieldDescription>
                                Update this user's name and email
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
                                    />
                                    {errors.password_confirmation && (
                                        <FieldError>{errors.password_confirmation}</FieldError>
                                    )}
                                </Field>
                            </FieldGroup>
                        </FieldSet>
                        <Field orientation="horizontal">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Saving...' : 'Save changes'}
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

EditUser.layout = {
    breadcrumbs: [
        { title: 'Users', href: usersIndex() },
        { title: 'Edit', href: '#' },
    ],
};
