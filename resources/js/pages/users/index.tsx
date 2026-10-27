import { Head } from '@inertiajs/react';
import { create, index as usersIndex } from '@/routes/users';
import { DataTable } from '@/components/ui/data-table';
import { columns, type UserRow } from './columns';

export default function UsersPage({ users }: { users: UserRow[] }) {
    return (
        <>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <DataTable
                    columns={columns}
                    data={users}
                    filterColumn="email"
                    filterPlaceholder="Search emails..."
                    createHref={create()}
                    createLabel="Add User"
                />
            </div>
        </>
    );
}

UsersPage.layout = {
    breadcrumbs: [{ title: 'Users', href: usersIndex() }],
};
