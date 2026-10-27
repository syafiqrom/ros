import { Head } from '@inertiajs/react';
import { index as usersIndex } from '@/routes/users';
import { DataTable } from '@/components/data-table/data-table';
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
                    filterPlaceholder="Filter emails..."
                />
            </div>
        </>
    );
}

UsersPage.layout = {
    breadcrumbs: [{ title: 'Users', href: usersIndex() }],
};
