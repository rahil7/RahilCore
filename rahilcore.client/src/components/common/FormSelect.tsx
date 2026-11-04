import { useId } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Combobox } from "@base-ui/react/combobox";
import { FormLabel } from "./FormLabel";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
export interface FormSelectOption {
    value: string;
    label: string;
}

interface FormSelectProps {
    label: string;
    info?: string;
    required?: boolean;
    options: FormSelectOption[];
    value: string | null;
    onValueChange: (value: string | null) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    searchable?: boolean;
    error?: string;
    disabled?: boolean;
}

export function FormSelect({
    label,
    info,
    options,
    required = false,
    value,
    onValueChange,
    placeholder = "Pilih pilihan",
    searchPlaceholder = "Cari...",
    searchable = false,
    error,
    disabled = false,
}: FormSelectProps) {
    const generatedId = useId();
    const inputId = `form-select-${generatedId}`;

    return (
        <div className="space-y-2">
            <FormLabel
                label={label}
                htmlFor={inputId}
                info={info}
                required={required}
            />

            {!searchable ? (
                <Select
                    items={options.map((option) => ({
                        label: option.label,
                        value: option.value,
                    }))}
                    value={value}
                    onValueChange={onValueChange}
                    disabled={disabled}
                >
                    <SelectTrigger
                        id={inputId}
                        className="w-full"
                        aria-invalid={!!error}
                    >
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>

                    <SelectContent>
                        {options.map((option) => (
                            <SelectItem
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            ) : (
                <Combobox.Root<FormSelectOption>
                    items={options}
                    value={options.find((item) => item.value === value) ?? null}
                    onValueChange={(item) => onValueChange(item?.value ?? null)}
                    itemToStringLabel={(item) => item.label}
                    isItemEqualToValue={(item, selectedItem) =>
                        item.value === selectedItem.value
                    }
                    disabled={disabled}
                >
                    <div className="relative">
                        <Combobox.Input
                            id={inputId}
                            placeholder={searchPlaceholder}
                            className="h-9 w-full rounded-lg border border-input bg-transparent py-2 pr-9 pl-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                            aria-invalid={!!error}
                        />

                        <Combobox.Trigger className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-muted-foreground">
                            <ChevronDown className="h-4 w-4" />
                        </Combobox.Trigger>
                    </div>

                    <Combobox.Portal>
                        <Combobox.Positioner
                            sideOffset={4}
                            className="z-50"
                        >
                            <Combobox.Popup className="max-h-60 w-(--anchor-width) overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-md">
                                <Combobox.List className="max-h-60 overflow-y-auto p-1">
                                    {(option: FormSelectOption) => (
                                        <Combobox.Item
                                            key={option.value}
                                            value={option}
                                            className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
                                        >
                                            {option.label}

                                            <Combobox.ItemIndicator>
                                                <Check className="h-4 w-4" />
                                            </Combobox.ItemIndicator>
                                        </Combobox.Item>
                                    )}
                                </Combobox.List>

                                <Combobox.Empty className="px-3 py-4 text-center text-sm text-muted-foreground">
                                    Data tidak ditemukan.
                                </Combobox.Empty>
                            </Combobox.Popup>
                        </Combobox.Positioner>
                    </Combobox.Portal>
                </Combobox.Root>
            )}

            {error && (
                <p className="text-xs text-destructive">
                    {error}
                </p>
            )}
        </div>
    );
}