import { useState } from 'react';
import { useForm } from '@inertiajs/react';
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

interface ImportPopoverProps {
    title: string;
    description: string;
    accept: string;
    route: string;
}

export function ImportPopover({
    title,
    description,
    accept,
    route,
}: ImportPopoverProps) {
    const [open, setOpen] = useState(false);

    const { setData, post, processing, errors, reset, clearErrors } = useForm<{
        file: File | null;
    }>({
        file: null,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(route, {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    }

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
                                onChange={(e) => {
                                    clearErrors('file');
                                    setData(
                                        'file',
                                        e.target.files?.[0] ?? null,
                                    );
                                }}
                            />
                            {errors.file && (
                                <p className="text-sm text-destructive">
                                    {errors.file}
                                </p>
                            )}
                        </Field>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Importing...' : 'Import file'}
                        </Button>
                    </FieldGroup>
                </form>
            </PopoverContent>
        </Popover>
    );
}
