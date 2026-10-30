
import {
    Select,
    SelectContent,
    SelectItem,
    SelectValue,
    SelectTrigger,
} from "../ui/select";

export interface SelectOption {
    value: string;
    label: string;
}

interface SelectFieldProps {
    value: string;
    options: SelectOption[];
    onChange: (value: string) => void;
    placeholder?: string;
    ariaLabel?: string;
    disabled?: boolean;
    className?: string;
}

export default function SelectField({
    value,
    options,
    onChange,
    placeholder = "Pilih...",
    ariaLabel,
    disabled = false,
    className = "",
}: SelectFieldProps) {
    return (
        <Select
            value={value}
            onValueChange={(nextValue) => {
                if (nextValue !== null) {
                    onChange(nextValue);
                }
            }}
            disabled={disabled}
        >
            <SelectTrigger
                aria-label={ariaLabel}
                className={`h-10 min-h-10 data-[size=default]:h-10 w-full rounded-md bg-background px-3 text-sm ${className}`}
            >
                <SelectValue placeholder={placeholder}>
                    {options.find((option) => option.value === value)?.label}
                </SelectValue>
            </SelectTrigger>

            <SelectContent
                side="bottom"
                align="start"
                sideOffset={4}
                className="max-h-60"
            >
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
    );
}
