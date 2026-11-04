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
import { edit, index as driversIndex } from '@/routes/drivers';
import { type DriverRow } from './columns';

export default function ShowDriver({ driver }: { driver: DriverRow }) {
    const getInitials = useInitials();

    return (
        <>
            <Head title={driver.name} />
            <div className="w-full max-w-xl p-4">
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Avatar className="size-12">
                            <AvatarFallback>
                                {getInitials(driver.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle>{driver.name}</CardTitle>
                            <CardDescription>
                                <a
                                    href={`tel:${driver.phone}`}
                                    className="hover:underline"
                                >
                                    {driver.phone}
                                </a>
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <Separator className="mb-4" />
                        <dl className="grid grid-cols-[8rem_1fr] gap-y-3 text-sm">
                            <dt className="text-muted-foreground">Status</dt>
                            <dd>
                                <Badge
                                    variant={
                                        driver.status === 'active'
                                            ? 'outline'
                                            : 'destructive'
                                    }
                                    className="capitalize"
                                >
                                    {driver.status}
                                </Badge>
                            </dd>

                            <dt className="text-muted-foreground">
                                Licence No
                            </dt>
                            <dd>{driver.licence_no}</dd>

                            <dt className="text-muted-foreground">Added</dt>
                            <dd>{formatDate(driver.created_at)}</dd>
                        </dl>
                    </CardContent>

                    <CardFooter className="gap-2">
                        <Button
                            render={<Link href={edit(driver.id)} />}
                            nativeButton={false}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="outline"
                            render={<Link href={driversIndex()} />}
                            nativeButton={false}
                        >
                            Back to list
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}

ShowDriver.layout = {
    breadcrumbs: [
        { title: 'Drivers', href: driversIndex() },
        { title: 'View', href: '#' },
    ],
};
