import { ComponentProps, useRef, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { GripVerticalIcon } from 'lucide-react';

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
    asHandle?: boolean;
    isOverlay?: boolean;
}

function OrderCard({ order, asHandle, isOverlay, ...props }: OrderCardProps) {
    const cardContent = (
        <Card>
            <CardContent className="space-y-2.5">
                <div className="flex items-center gap-2">
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
                            className="text-[10px] whitespace-nowrap tabular-nums"
                        >
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
                    <span className="text-sm font-semibold">
                        {COLUMN_TITLES[value] ?? value}
                    </span>
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
                <CardContent>
                    <KanbanColumnContent
                        value={value}
                        className="flex flex-col gap-2.5"
                    >
                        {orders.map((order) => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                asHandle={!isOverlay}
                                isOverlay={isOverlay}
                            />
                        ))}
                    </KanbanColumnContent>
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

                            const order = Object.values(columns)
                                .flat()
                                .find((o) => String(o.id) === id);

                            return order ? (
                                <OrderCard order={order} isOverlay />
                            ) : null;
                        }}
                    </KanbanOverlay>
                </Kanban>
            </div>
        </>
    );
}
