import { Head, Link } from '@inertiajs/react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useInitials } from '@/hooks/use-initials';
import { formatDate } from '@/lib/format';
import { edit, index as usersIndex } from '@/routes/users';
import { type UserRow } from './columns';

export default function ShowUser({ user }: { user: UserRow }) {
    const getInitials = useInitials();

    return (
        <>
            <Head title={user.name} />
            <div className="w-full max-w-xl p-4">
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Avatar className="size-12">
                            <AvatarFallback>
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle>{user.name}</CardTitle>
                            <CardDescription>{user.email}</CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <Separator className="mb-4" />
                        <dl className="grid grid-cols-[8rem_1fr] gap-y-3 text-sm">
                            <dt className="text-muted-foreground">
                                Email status
                            </dt>
                            <dd>
                                {user.email_verified_at ? (
                                    <Badge>Verified</Badge>
                                ) : (
                                    <Badge variant="outline">Unverified</Badge>
                                )}
                            </dd>

                            <dt className="text-muted-foreground">
                                Verified on
                            </dt>
                            <dd>
                                {user.email_verified_at
                                    ? formatDate(user.email_verified_at)
                                    : '—'}
                            </dd>

                            <dt className="text-muted-foreground">Joined</dt>
                            <dd>{formatDate(user.created_at)}</dd>
                        </dl>
                    </CardContent>

                    <CardFooter className="gap-2">
                        <Button asChild>
                            <Link href={edit(user.id)}>Edit</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={usersIndex()}>Back to list</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}

ShowUser.layout = {
    breadcrumbs: [
        { title: 'Users', href: usersIndex() },
        { title: 'View', href: '#' },
    ],
};
