import { Info } from "lucide-react";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../ui/popover";

interface FormLabelProps {
    label: string;
    htmlFor?: string;
    info?: string;
    required?: boolean;
}

export function FormLabel({
    label,
    htmlFor,
    info,
    required = false,
}: FormLabelProps) {
    return (
        <div className="flex items-center gap-1.5">
            <label htmlFor={htmlFor} className="text-sm font-medium">
                {label}
                {required && (
                    <span className="ml-1 text-destructive">*</span>
                )}
            </label>

            {info && (
                <Popover>
                    <PopoverTrigger
                        render={
                            <button
                                type="button"
                                aria-label={`Informasi ${label}`}
                                className="inline-flex items-center text-muted-foreground transition-colors hover:text-foreground"
                            />
                        }
                    >
                        <Info className="h-3.5 w-3.5" />
                    </PopoverTrigger>

                    <PopoverContent
                        side="top"
                        align="start"
                        className="max-w-xs text-sm"
                    >
                        {info}
                    </PopoverContent>
                </Popover>
            )}
        </div>
    );
}