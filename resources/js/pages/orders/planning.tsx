import { ComponentProps, useEffect, useRef, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { SearchIcon, XIcon } from 'lucide-react';

import { Badge } from '@/components/reui/badge';
import {
    Kanban,
    KanbanBoard,
    KanbanColumn,
    KanbanColumnContent,
    KanbanItem,
    KanbanItemHandle,
    KanbanOverlay,
} from '@/components/reui/kanban';
import { DatePicker } from '@/components/date-picker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

Planning.layout = {
    breadcrumbs: [{ title: 'Planning' }],
};

const VOLUME_UNIT = 'm³'; // change if your volum column uses another unit

interface Order {
    id: number;
    vbeln: string | null;
    name: string | null;
    city: string | null;
    pdate: string | null;
    volum: number | string | null;
    plan_board: string;
}

type Columns = Record<string, Order[]>;

const toNumber = (v: Order['volum']) => Number(v ?? 0) || 0;

const formatVolume = (n: number) =>
    n.toLocaleString('en-MY', { maximumFractionDigits: 2 });

function matchesSearch(order: Order, query: string) {
    if (!query) return true;
    return [order.name, order.vbeln, order.city].some((field) =>
        field?.toLowerCase().includes(query),
    );
}

interface OrderCardProps extends Omit<
    ComponentProps<typeof KanbanItem>,
    'value' | 'children'
> {
    order: Order;
    index?: number;
    dimmed?: boolean;
    asHandle?: boolean;
    isOverlay?: boolean;
}

function OrderCard({
    order,
    index,
    dimmed,
    asHandle,
    isOverlay,
    ...props
}: OrderCardProps) {
    const volume = toNumber(order.volum);

    const cardContent = (
        <div
            className={cn(
                'rounded-md border bg-card px-2.5 py-1.5 text-card-foreground transition-opacity',
                'hover:border-foreground/30',
                dimmed && 'opacity-30',
                isOverlay && 'ring-2 ring-primary/30',
            )}
        >
            <div className="flex items-center gap-2">
                {index !== undefined && (
                    <span className="w-5 shrink-0 text-center text-xs tabular-nums text-muted-foreground">
                        {index + 1}
                    </span>
                )}
                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {order.name || 'No name'}
                </span>
                {volume > 0 && (
                    <span className="shrink-0 text-xs font-medium tabular-nums">
                        {formatVolume(volume)}
                    </span>
                )}
            </div>
            <div className="mt-0.5 flex items-center gap-2 pl-7 text-xs text-muted-foreground">
                <span className="tabular-nums">{order.vbeln}</span>
                {order.city && <span className="truncate">{order.city}</span>}
            </div>
        </div>
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

interface OrderLaneProps extends Omit<
    ComponentProps<typeof KanbanColumn>,
    'children'
> {
    orders: Order[];
    query: string;
}

function OrderLane({ value, orders, query, ...props }: OrderLaneProps) {
    const totalVolume = orders.reduce((sum, o) => sum + toNumber(o.volum), 0);

    return (
        <KanbanColumn
            value={value}
            className="flex h-full w-72 shrink-0 flex-col rounded-lg border bg-muted/30"
            {...props}
        >
            <div className="flex items-center justify-between gap-2 border-b px-3 py-2">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{value}</span>
                    <Badge variant="secondary" className="tabular-nums">
                        {orders.length}
                    </Badge>
                </div>
                <span className="text-xs tabular-nums text-muted-foreground">
                    {formatVolume(totalVolume)} {VOLUME_UNIT}
                </span>
            </div>

            <ScrollArea className="min-h-0 flex-1">
                <KanbanColumnContent
                    value={value}
                    className="flex min-h-24 flex-col gap-1.5 p-2"
                >
                    {orders.map((order, index) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            index={index}
                            asHandle
                            dimmed={!matchesSearch(order, query)}
                        />
                    ))}
                    {orders.length === 0 && (
                        <p className="py-6 text-center text-xs text-muted-foreground">
                            Drop orders here
                        </p>
                    )}
                </KanbanColumnContent>
            </ScrollArea>
        </KanbanColumn>
    );
}

export default function Planning({
    columns: initialColumns,
    filters,
}: {
    columns: Columns;
    filters: { date: string | null };
}) {
    const [columns, setColumns] = useState<Columns>(initialColumns);
    const [search, setSearch] = useState('');
    const [date, setDate] = useState<Date | undefined>(
        filters.date ? parseISO(filters.date) : undefined,
    );

    // Latest board state (updated mid-drag) and last state the server confirmed (for rollback).
    const latest = useRef<Columns>(initialColumns);
    const saved = useRef<Columns>(initialColumns);

    // Re-sync when the server sends fresh data (date filter change, reload).
    useEffect(() => {
        latest.current = initialColumns;
        saved.current = initialColumns;
        setColumns(initialColumns);
    }, [initialColumns]);

    // Top scrollbar: a thin mirror strip kept in sync with the board's scroll position.
    const topRef = useRef<HTMLDivElement>(null);
    const bodyRef = useRef<HTMLDivElement>(null);
    const [boardWidth, setBoardWidth] = useState(0);

    useEffect(() => {
        const body = bodyRef.current;
        if (!body) return;

        const update = () => setBoardWidth(body.scrollWidth);
        update();

        const observer = new ResizeObserver(update);
        observer.observe(body);
        if (body.firstElementChild) observer.observe(body.firstElementChild);

        return () => observer.disconnect();
    }, []);

    const syncFromTop = () => {
        if (topRef.current && bodyRef.current) {
            bodyRef.current.scrollLeft = topRef.current.scrollLeft;
        }
    };

    const syncFromBody = () => {
        if (topRef.current && bodyRef.current) {
            topRef.current.scrollLeft = bodyRef.current.scrollLeft;
        }
    };

    const query = search.trim().toLowerCase();
    const allOrders = Object.values(columns).flat();
    const matchCount = query
        ? allOrders.filter((o) => matchesSearch(o, query)).length
        : allOrders.length;
    const totalVolume = allOrders.reduce((sum, o) => sum + toNumber(o.volum), 0);

    const handleDateChange = (next: Date | undefined) => {
        setDate(next);
        router.get(
            window.location.pathname,
            next ? { date: format(next, 'yyyy-MM-dd') } : {},
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const handleChange = (next: Columns) => {
        latest.current = next;
        setColumns(next);
    };

    const handleCommit = () => {
        const snapshot = latest.current;
        const payload = Object.fromEntries(
            Object.entries(snapshot).map(([slot, orders]) => [
                slot,
                orders.map((o) => o.id),
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
            <div className="flex h-full min-h-0 flex-1 flex-col gap-3 p-4">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative w-full max-w-xs">
                        <SearchIcon className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Find customer, DO or city"
                            className="pl-8"
                        />
                    </div>

                    <DatePicker value={date} onChange={handleDateChange} />

                    <p className="ml-auto text-sm text-muted-foreground tabular-nums">
                        {query
                            ? `${matchCount} of ${allOrders.length} orders match`
                            : `${allOrders.length} orders`}
                        {' · '}
                        {formatVolume(totalVolume)} {VOLUME_UNIT}
                    </p>
                </div>

                <div
                    ref={topRef}
                    onScroll={syncFromTop}
                    aria-hidden
                    className="overflow-x-auto overflow-y-hidden"
                >
                    <div style={{ width: boardWidth, height: 1 }} />
                </div>

                <Kanban
                    value={columns}
                    onValueChange={handleChange}
                    onValueCommit={handleCommit}
                    getItemValue={(item) => String(item.id)}
                >
                    <div
                        ref={bodyRef}
                        onScroll={syncFromBody}
                        className="min-h-0 flex-1 overflow-x-auto pb-2"
                    >
                        <KanbanBoard className="flex h-full w-max gap-3">
                            {Object.entries(columns).map(([slot, orders]) => (
                                <OrderLane
                                    key={slot}
                                    value={slot}
                                    orders={orders}
                                    query={query}
                                />
                            ))}
                        </KanbanBoard>
                    </div>

                    <KanbanOverlay>
                        {({ value }) => {
                            const id = String(value);
                            const lane = Object.values(columns).find((list) =>
                                list.some((o) => String(o.id) === id),
                            );
                            const index = lane?.findIndex(
                                (o) => String(o.id) === id,
                            );
                            const order = lane?.[index ?? -1];

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