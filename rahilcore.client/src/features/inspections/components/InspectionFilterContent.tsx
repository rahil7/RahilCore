import { CalendarIcon } from "lucide-react";
import { Label } from "../../../components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/popover";
import type { InspectionFilterOptions, InspectionFilters } from "../../../types/inspection";
import { id } from "date-fns/locale";
import { Calendar } from "../../../components/ui/calendar";
import { format, parseISO } from "date-fns";
import { Separator } from "../../../components/ui/separator";
import { Checkbox } from "../../../components/ui/checkbox";

interface InspectionFilterContentProps {
    options: InspectionFilterOptions;
    draftFilters: InspectionFilters;
    onChange: (filters: InspectionFilters) => void;
}

export default function InspectionFilterContent({
    options,
    draftFilters,
    onChange,
}: InspectionFilterContentProps) {
    const toggleCustomerType = (id: number, checked: boolean) => {
        onChange({
            ...draftFilters,
            custTypeIds: checked
                ? [...draftFilters.custTypeIds, id]
                : draftFilters.custTypeIds.filter((item) => item !== id),
        });
    };

    const toggleStatus = (id: number, checked: boolean) => {
        onChange({
            ...draftFilters,
            statusIds: checked
                ? [...draftFilters.statusIds, id]
                : draftFilters.statusIds.filter((item) => item !== id),
        });
    };

    const toggleInspectors = (username: string, checked: boolean) => {
        onChange({
            ...draftFilters,
            inspectors: checked
                ? [...draftFilters.inspectors, username]
                : draftFilters.inspectors.filter((item) => item !== username),
        });
    };

    const renderDatePicker = (
        label: string,
        value: string,
        onSelect: (value: string) => void,
        minDate?: string,
        maxDate?: string
    ) => (
        <div className="space-y-2">
            <Label>{label}</Label>

            <Popover>
                <PopoverTrigger
                    type="button"
                    className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm shadow-sm hover:bg-accent/50"
                >
                    <span>
                        {value
                            ? format(parseISO(value), "dd/MM/yyyy", { locale: id })
                            : "Select date"}
                    </span>

                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </PopoverTrigger>

                <PopoverContent
                    align="start"
                    side="bottom"
                    sideOffset={8}
                    className="z-[100] w-auto rounded-lg border bg-popover p-0 shadow-xl"
                >
                    <Calendar
                        mode="single"
                        selected={value ? parseISO(value) : undefined}
                        onSelect={(date) =>
                            onSelect(date ? format(date, "yyyy-MM-dd") : "")
                        }
                        disabled={(date) =>
                            (minDate ? date < parseISO(minDate) : false) ||
                            (maxDate ? date > parseISO(maxDate) : false)
                        }
                    />
                </PopoverContent>
            </Popover>
        </div>
    );

    return (
        <div className="space-y-2">
            <h3 className="text-sm font-medium">Inspection Date</h3>
            <div className="grid grid-cols-2 gap-3">
                {renderDatePicker(
                    "From",
                    draftFilters.scheduleFrom,
                    (value) =>
                        onChange({
                            ...draftFilters,
                            scheduleFrom: value,
                        }),
                    undefined,
                    draftFilters.scheduleTo
                )}

                {renderDatePicker(
                    "To",
                    draftFilters.scheduleTo,
                    (value) =>
                        onChange({
                            ...draftFilters,
                            scheduleTo: value,
                        }),
                    draftFilters.scheduleFrom
                )}
            </div>

            {/* Customer Type */}
            <div className="space-y-3 pt-1">
                <h3 className="text-sm font-medium">Customer Type</h3>

                <div className="space-y-3">
                    {options.customerTypes.map((item) => (
                        <label
                            key={item.id}
                            className="flex cursor-pointer items-center gap-3 text-sm"
                        >
                            <Checkbox
                                checked={draftFilters.custTypeIds.includes(item.id)}
                                onCheckedChange={(checked) =>
                                    toggleCustomerType(item.id, checked === true)
                                }
                            />

                            <span>{item.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            <Separator className="my-2 bg-border" />

            {/* Inspection Status */}
            <div className="space-y-3">
                <h3 className="text-sm font-medium">Status</h3>

                <div className="space-y-3">
                    {options.inspectionStatus.map((item) => (
                        <label
                            key={item.id}
                            className="flex cursor-pointer items-center gap-3 text-sm"
                        >
                            <Checkbox
                                checked={draftFilters.statusIds.includes(item.id)}
                                onCheckedChange={(checked) =>
                                    toggleStatus(item.id, checked === true)
                                }
                            />

                            <span>{item.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            <Separator className="my-2 bg-border" />

            {/* Inspector */}
            <div className="space-y-3">
                <h3 className="text-sm font-medium">Inspector</h3>

                <div className="space-y-3">
                    {options.inspectors.map((item) => (
                        <label
                            key={item.username}
                            className="flex cursor-pointer items-center gap-3 text-sm"
                        >
                            <Checkbox
                                checked={draftFilters.inspectors.includes(item.username)}
                                onCheckedChange={(checked) =>
                                    toggleInspectors(item.username, checked === true)
                                }
                            />

                            <span>{item.displayName}</span>
                        </label>
                    ))}
                </div>
            </div>

        </div>
    );
}
