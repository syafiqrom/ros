'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

interface DatePickerProps {
    value?: Date;
    onChange: (date: Date | undefined) => void;
    placeholder?: string;
}

export function DatePicker({
    value,
    onChange,
    placeholder = 'Pick a date',
}: DatePickerProps) {
    return (
        <div className="flex items-center gap-1">
            <Popover>
                <PopoverTrigger
                    render={
                        <Button
                            variant="outline"
                            data-empty={!value}
                            className="justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
                        />
                    }
                >
                    <CalendarIcon />
                    {value ? format(value, 'PPP') : <span>{placeholder}</span>}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={value}
                        onSelect={onChange}
                    />
                </PopoverContent>
            </Popover>

            {value && (
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Clear date"
                    onClick={() => onChange(undefined)}
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
