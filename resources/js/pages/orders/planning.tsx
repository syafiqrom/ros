import { ComponentProps, useRef, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { ClockIcon, GripVerticalIcon } from 'lucide-react';

import { Badge } from '@/components/reui/badge';
import {
    Kanban,
    KanbanBoard,
    KanbanColumn,
    KanbanColumnContent,
    KanbanColumnHandle,
    KanbanItem,
    KanbanItemHandle,
    KanbanOverlay,
} from '@/components/reui/kanban';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

Planning.layout = {
    breadcrumbs: [{ title: 'Planning' }],
};

type Priority = 'normal' | 'cancel' | 'urgent';

interface Order {
    id: number;
    daikin_do: string;
    delivery_point_name: string;
    priority: Priority;
    plan_board: string;
    created_at: string;
}

type Columns = Record<string, Order[]>;

const COLUMN_TITLES: Record<string, string> = {
    morning: 'Morning',
    pool: 'In Pool',
    evening: 'Evening',
};

const PRIORITY_DOT: Record<Priority, string> = {
    normal: 'bg-muted-foreground/50',
    cancel: 'bg-amber-500',
    urgent: 'bg-red-500',
};

interface OrderCardProps extends Omit<
    ComponentProps<typeof KanbanItem>,
    'value' | 'children'
> {
    order: Order;
    index?: number;
    asHandle?: boolean;
    isOverlay?: boolean;
}

function OrderCard({
    order,
    index,
    asHandle,
    isOverlay,
    ...props
}: OrderCardProps) {
    const cardContent = (
        <Card
            className={cn(
                'transition-shadow hover:shadow-md',
                isOverlay && 'ring-2 ring-primary/30',
            )}
        >
            <CardContent className="space-y-2.5">
                <div className="flex items-center gap-2">
                    {index !== undefined && (
                        <Badge variant="outline" className="tabular-nums">
                            {index + 1}
                        </Badge>
                    )}
                    <span
                        className={cn(
                            'size-2 shrink-0 rounded-full',
                            PRIORITY_DOT[order.priority],
                        )}
                        title={`${order.priority} priority`}
                    />
                    <span className="line-clamp-1 text-sm font-medium">
                        {order.delivery_point_name || 'No delivery point'}
                    </span>
                    {order.priority !== 'normal' && (
                        <Badge variant="outline" className="ml-auto capitalize">
                            {order.priority}
                        </Badge>
                    )}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    {order.daikin_do && (
                        <div className="flex items-center gap-1">
                            <Avatar className="size-4">
                                <AvatarFallback>
                                    {order.daikin_do}
                                </AvatarFallback>
                            </Avatar>
                            <span className="line-clamp-1">
                                {order.daikin_do}
                            </span>
                        </div>
                    )}
                    {order.created_at && (
                        <time
                            dateTime={order.created_at}
                            className="flex items-center gap-1 text-[10px] whitespace-nowrap tabular-nums"
                        >
                            <ClockIcon className="size-3" />
                            {new Date(order.created_at).toLocaleString(
                                'en-MY',
                                {
                                    dateStyle: 'medium',
                                    timeStyle: 'short',
                                },
                            )}
                        </time>
                    )}
                </div>
            </CardContent>
        </Card>
    );

    return (
        <KanbanItem value={String(order.id)} {...props}>
            {asHandle && !isOverlay ? (
                <KanbanItemHandle>{cardContent}</KanbanItemHandle>
            ) : (
                cardContent
            )}
        </KanbanItem>
    );
}

interface OrderColumnProps extends Omit<
    ComponentProps<typeof KanbanColumn>,
    'children'
> {
    orders: Order[];
    isOverlay?: boolean;
}

function OrderColumn({ value, orders, isOverlay, ...props }: OrderColumnProps) {
    return (
        <KanbanColumn value={value} {...props}>
            <Card className="mb-2.5">
                <CardHeader className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">
                            {COLUMN_TITLES[value] ?? value}
                        </span>
                        <Badge variant="secondary" className="tabular-nums">
                            {orders.length}
                        </Badge>
                    </div>
                    <KanbanColumnHandle
                        render={(handleProps) => (
                            <Button
                                {...handleProps}
                                size="icon"
                                variant="ghost"
                                className="size-6"
                            >
                                <GripVerticalIcon className="size-4" />
                            </Button>
                        )}
                    />
                </CardHeader>
                <CardContent className="relative">
                    <KanbanColumnContent
                        value={value}
                        className="flex min-h-24 flex-col gap-2.5"
                    >
                        {orders.map((order, index) => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                index={index}
                                asHandle={!isOverlay}
                                isOverlay={isOverlay}
                            />
                        ))}
                    </KanbanColumnContent>
                    {orders.length === 0 && (
                        <div className="pointer-events-none absolute inset-6 flex items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground">
                            No orders
                        </div>
                    )}
                </CardContent>
            </Card>
        </KanbanColumn>
    );
}

export default function Planning({
    columns: initialColumns,
}: {
    columns: Columns;
}) {
    const [columns, setColumns] = useState<Columns>(initialColumns);

    // Latest board state (updated mid-drag) and last state the server confirmed (for rollback).
    const latest = useRef<Columns>(initialColumns);
    const saved = useRef<Columns>(initialColumns);

    const handleChange = (next: Columns) => {
        latest.current = next;
        setColumns(next);
    };

    const handleCommit = () => {
        const snapshot = latest.current;
        const payload = Object.fromEntries(
            Object.entries(snapshot).map(([status, orders]) => [
                status,
                orders.map((t) => t.id),
            ]),
        );

        router.patch(
            '/orders/reorder',
            { columns: payload },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    saved.current = snapshot;
                },
                onError: () => {
                    latest.current = saved.current;
                    setColumns(saved.current); // rollback
                },
            },
        );
    };

    return (
        <>
            <Head title="Planning" />
            <div className="p-4">
                <Kanban
                    value={columns}
                    onValueChange={handleChange}
                    onValueCommit={handleCommit}
                    getItemValue={(item) => String(item.id)}
                >
                    <KanbanBoard className="grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-3">
                        {Object.entries(columns).map(
                            ([columnValue, orders]) => (
                                <OrderColumn
                                    key={columnValue}
                                    value={columnValue}
                                    orders={orders}
                                />
                            ),
                        )}
                    </KanbanBoard>

                    <KanbanOverlay>
                        {({ value, variant }) => {
                            const id = String(value);

                            if (variant === 'column') {
                                return (
                                    <OrderColumn
                                        value={id}
                                        orders={columns[id] ?? []}
                                        isOverlay
                                    />
                                );
                            }

                            const column = Object.values(columns).find((list) =>
                                list.some((o) => String(o.id) === id),
                            );
                            const index = column?.findIndex(
                                (o) => String(o.id) === id,
                            );
                            const order = column?.[index ?? -1];

                            return order ? (
                                <OrderCard
                                    order={order}
                                    index={index}
                                    isOverlay
                                />
                            ) : null;
                        }}
                    </KanbanOverlay>
                </Kanban>
            </div>
        </>
    );
}
