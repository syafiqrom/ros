import { ComponentProps, useEffect, useRef, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { SearchIcon } from 'lucide-react';

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
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

Planning.layout = {
    breadcrumbs: [{ title: 'Job Order' }],
};

const VOLUME_UNIT = 'm³';
const REORDER_URL = '/jobs/planning'; // adjust to your actual route

// One card = one job order, with its related order's fields flattened in.
interface JobOrder {
    id: number; // job order id
    order_id: number | null;
    status: string | null;
    vbeln: string | null;
    name: string | null;
    city: string | null;
    pdate: string | null;
    volum: number | string | null;
}

interface LogsheetTitle {
    id: number;
    date: string | null;
    tzone: string | null;
}

type Columns = Record<string, JobOrder[]>; // keyed "ls_<logsheet id>"
type Titles = Record<string, LogsheetTitle>;

const toNumber = (v: JobOrder['volum']) => Number(v ?? 0) || 0;

const formatVolume = (n: number) =>
    n.toLocaleString('en-MY', { maximumFractionDigits: 2 });

function formatLaneDate(date: string | null | undefined) {
    if (!date) return null;
    try {
        return format(parseISO(date), 'dd MMM yyyy');
    } catch {
        return date;
    }
}

function matchesSearch(job: JobOrder, query: string) {
    if (!query) return true;
    return [job.name, job.vbeln, job.city].some((field) =>
        field?.toLowerCase().includes(query),
    );
}

interface JobCardProps extends Omit<
    ComponentProps<typeof KanbanItem>,
    'value' | 'children'
> {
    job: JobOrder;
    index?: number;
    dimmed?: boolean;
    asHandle?: boolean;
    isOverlay?: boolean;
}

function JobCard({
    job,
    index,
    dimmed,
    asHandle,
    isOverlay,
    ...props
}: JobCardProps) {
    const volume = toNumber(job.volum);

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
                    {job.name || 'No name'}
                </span>
                {volume > 0 && (
                    <span className="shrink-0 text-xs font-medium tabular-nums">
                        {formatVolume(volume)}
                    </span>
                )}
            </div>
            <div className="mt-0.5 flex items-center gap-2 pl-7 text-xs text-muted-foreground">
                <span className="tabular-nums">{job.vbeln}</span>
                {job.city && <span className="truncate">{job.city}</span>}
                {job.status && (
                    <span className="ml-auto shrink-0 capitalize">
                        {job.status}
                    </span>
                )}
            </div>
        </div>
    );

    return (
        <KanbanItem value={String(job.id)} {...props}>
            {asHandle && !isOverlay ? (
                <KanbanItemHandle>{cardContent}</KanbanItemHandle>
            ) : (
                cardContent
            )}
        </KanbanItem>
    );
}

interface LogsheetLaneProps extends Omit<
    ComponentProps<typeof KanbanColumn>,
    'children'
> {
    jobs: JobOrder[];
    meta?: LogsheetTitle;
    query: string;
}

function LogsheetLane({
    value,
    jobs,
    meta,
    query,
    ...props
}: LogsheetLaneProps) {
    const totalVolume = jobs.reduce((sum, j) => sum + toNumber(j.volum), 0);
    const laneDate = formatLaneDate(meta?.date);

    return (
        <KanbanColumn
            value={value}
            className="flex h-full w-72 shrink-0 flex-col rounded-lg border bg-muted/30"
            {...props}
        >
            <div className="flex items-center justify-between gap-2 border-b px-3 py-2">
                <div className="flex min-w-0 items-center gap-2">
                    <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">
                            #{meta?.id ?? value.replace('ls_', '')}
                            {meta?.tzone && ` · ${meta.tzone}`}
                        </div>
                        {laneDate && (
                            <div className="text-xs text-muted-foreground">
                                {laneDate}
                            </div>
                        )}
                    </div>
                    <Badge variant="secondary" className="tabular-nums">
                        {jobs.length}
                    </Badge>
                </div>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                    {formatVolume(totalVolume)} {VOLUME_UNIT}
                </span>
            </div>

            <ScrollArea className="min-h-0 flex-1">
                <KanbanColumnContent
                    value={value}
                    className="flex min-h-24 flex-col gap-1.5 p-2"
                >
                    {jobs.map((job, index) => (
                        <JobCard
                            key={job.id}
                            job={job}
                            index={index}
                            asHandle
                            dimmed={!matchesSearch(job, query)}
                        />
                    ))}
                    {jobs.length === 0 && (
                        <p className="py-6 text-center text-xs text-muted-foreground">
                            Drop job orders here
                        </p>
                    )}
                </KanbanColumnContent>
            </ScrollArea>
        </KanbanColumn>
    );
}

export default function Planning({
    columns: initialColumns,
    titles,
    filters,
    reorderUrl,
}: {
    columns: Columns;
    titles: Titles;
    filters: { date: string | null };
    reorderUrl: string;
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
    const allJobs = Object.values(columns).flat();
    const matchCount = query
        ? allJobs.filter((j) => matchesSearch(j, query)).length
        : allJobs.length;
    const totalVolume = allJobs.reduce((sum, j) => sum + toNumber(j.volum), 0);
    const laneEntries = Object.entries(columns);

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
        // { ls_1: [jobOrderId, ...], ls_2: [...] } — matches JobOrderController@reorder
        const payload = Object.fromEntries(
            Object.entries(snapshot).map(([key, jobs]) => [
                key,
                jobs.map((j) => j.id),
            ]),
        );

        router.patch(
            reorderUrl,
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
            <Head title="Job Order" />
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
                            ? `${matchCount} of ${allJobs.length} job orders match`
                            : `${allJobs.length} job orders`}
                        {' · '}
                        {laneEntries.length} logsheets
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
                        {laneEntries.length === 0 ? (
                            <p className="py-12 text-center text-sm text-muted-foreground">
                                No logsheets found
                                {date ? ` for ${format(date, 'dd MMM yyyy')}` : ''}.
                            </p>
                        ) : (
                            <KanbanBoard className="flex h-full w-max gap-3">
                                {laneEntries.map(([key, jobs]) => (
                                    <LogsheetLane
                                        key={key}
                                        value={key}
                                        jobs={jobs}
                                        meta={titles?.[key]}
                                        query={query}
                                    />
                                ))}
                            </KanbanBoard>
                        )}
                    </div>

                    <KanbanOverlay>
                        {({ value }) => {
                            const id = String(value);
                            const lane = Object.values(columns).find((list) =>
                                list.some((j) => String(j.id) === id),
                            );
                            const index = lane?.findIndex(
                                (j) => String(j.id) === id,
                            );
                            const job = lane?.[index ?? -1];

                            return job ? (
                                <JobCard job={job} index={index} isOverlay />
                            ) : null;
                        }}
                    </KanbanOverlay>
                </Kanban>
            </div>
        </>
    );
}