import { useEffect, useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldGroup } from '@/components/ui/field';
import {
    Popover,
    PopoverContent,
    PopoverHeader,
    PopoverTitle,
    PopoverDescription,
    PopoverTrigger,
} from '@/components/ui/popover';

interface ImportStatus {
    status: 'queued' | 'processing' | 'done' | 'failed' | 'unknown';
    total: number | null;
    processed: number;
}

interface ImportPopoverProps {
    title: string;
    description: string;
    accept: string;
    route: string;
    statusUrl: (id: string) => string; // e.g. (id) => `/orders/import/${id}/status`
}

export function ImportPopover({ title, description, accept, route, statusUrl }: ImportPopoverProps) {
    const [open, setOpen] = useState(false);
    const [importId, setImportId] = useState<string | null>(null);
    const [status, setStatus] = useState<ImportStatus | null>(null);

    const { setData, post, processing, progress, errors, reset, clearErrors } =
        useForm<{ file: File | null }>({ file: null });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        setStatus(null); // clear a stale "failed" message
        post(route, {
            forceFormData: true,
            onSuccess: (page) => {
                const id = (page.props as any).flash?.import_id;
                reset();
                if (id) setImportId(id);
                else setOpen(false);
            },
        });
    }

    useEffect(() => {
        if (!importId) return;
        const startedAt = Date.now();

        const timer = setInterval(async () => {
            if (Date.now() - startedAt > 5 * 60 * 1000) {   // give up after 5 min
                clearInterval(timer);
                setStatus({ status: 'failed', total: null, processed: 0 });
                setImportId(null);
                return;
            }
            try {
                const res = await fetch(statusUrl(importId), {
                    headers: { Accept: 'application/json' },
                });
                const data: ImportStatus = await res.json();
                setStatus(data);

                if (data.status === 'unknown') {
                    clearInterval(timer);
                    setStatus({ ...data, status: 'failed' }); // cache expired or id invalid
                    setImportId(null);
                } else if (data.status === 'done' || data.status === 'failed') {
                    clearInterval(timer);
                    if (data.status === 'done') {
                        router.reload();
                        setTimeout(finish, 800);
                    } else {
                        setImportId(null); // unlock the form, keep the error visible
                    }
                }
            } catch {
                /* ignore a failed poll, try again next tick */
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [importId]);

    function finish() {
        setImportId(null);
        setStatus(null);
        setOpen(false);
    }

    const importing = importId !== null;
    const percent =
        status?.total ? Math.round((status.processed / status.total) * 100) : null;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger render={<Button>Import</Button>} />
            <PopoverContent className="w-64" align="end">
                <PopoverHeader>
                    <PopoverTitle>{title}</PopoverTitle>
                    <PopoverDescription>{description}</PopoverDescription>
                </PopoverHeader>

                <form onSubmit={submit}>
                    <FieldGroup className="gap-4">
                        <Field>
                            <Input
                                id="file"
                                type="file"
                                accept={accept}
                                disabled={processing || importing}
                                onChange={(e) => {
                                    clearErrors('file');
                                    setData('file', e.target.files?.[0] ?? null);
                                }}
                            />
                            {errors.file && (
                                <p className="text-sm text-destructive">{errors.file}</p>
                            )}
                        </Field>

                        {processing && progress && (
                            <ProgressBar label="Uploading" percent={progress.percentage ?? 0} />
                        )}

                        {importing && status?.status !== 'failed' && (
                            <ProgressBar
                                label={status?.status === 'done' ? 'Done' : 'Importing'}
                                percent={status?.status === 'done' ? 100 : percent}
                            />
                        )}

                        {status?.status === 'failed' && (
                            <p className="text-sm text-destructive">
                                Import failed. Check the file and try again.
                            </p>
                        )}

                        <Button type="submit" disabled={processing || importing}>
                            {processing ? 'Uploading...' : importing ? 'Importing...' : 'Import file'}
                        </Button>
                    </FieldGroup>
                </form>
            </PopoverContent>
        </Popover>
    );
}

function ProgressBar({ label, percent }: { label: string; percent: number | null }) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
                <span>{label}</span>
                <span>{percent !== null ? `${percent}%` : '...'}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded bg-muted">
                <div
                    className={`h-full bg-primary transition-all ${percent === null ? 'w-1/3 animate-pulse' : ''}`}
                    style={percent !== null ? { width: `${percent}%` } : undefined}
                />
            </div>
        </div>
    );
}