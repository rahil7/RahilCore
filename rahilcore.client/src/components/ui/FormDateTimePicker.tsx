
import { useMemo } from "react";
import { format, parseISO, setHours, setMinutes } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { CalendarDays, Clock3 } from "lucide-react";

import { Calendar } from "../../components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../../components/ui/popover";
import { FormLabel } from "../common/FormLabel";

interface FormDateTimePickerProps {
    label: string;
    value: string | null;
    onChange: (value: string | null) => void;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    placeholder?: string;
    info?: string;
}

const hours = Array.from({ length: 24 }, (_, index) =>
    String(index).padStart(2, "0"),
);

const minutes = Array.from({ length: 60 }, (_, index) =>
    String(index).padStart(2, "0"),
);

export function FormDateTimePicker({
    label,
    value,
    onChange,
    error,
    disabled = false,
    required = false,
    placeholder = "Pilih tanggal dan waktu",
    info,
}: FormDateTimePickerProps) {
    const selectedDate = useMemo(() => {
        if (!value) return undefined;

        const parsedDate = parseISO(value);

        return Number.isNaN(parsedDate.getTime())
            ? undefined
            : parsedDate;
    }, [value]);

    const selectedHour = selectedDate
        ? format(selectedDate, "HH")
        : "09";

    const selectedMinute = selectedDate
        ? format(selectedDate, "mm")
        : "00";

    const inputId = "form-date-time-picker";

    const handleDateChange = (date: Date | undefined) => {
        if (!date) {
            onChange(null);
            return;
        }

        // Jika sebelumnya sudah ada value, pertahankan waktu.
        // Jika belum ada, gunakan default pukul 09:00.
        const hour = selectedDate
            ? selectedDate.getHours()
            : 9;

        const minute = selectedDate
            ? selectedDate.getMinutes()
            : 0;

        const newDate = setMinutes(
            setHours(date, hour),
            minute,
        );

        onChange(format(newDate, "yyyy-MM-dd'T'HH:mm"));
    };

    const handleTimeChange = (
        type: "hour" | "minute",
        selectedValue: string,
    ) => {
        if (!selectedDate) return;

        const newDate =
            type === "hour"
                ? setHours(selectedDate, Number(selectedValue))
                : setMinutes(selectedDate, Number(selectedValue));

        onChange(format(newDate, "yyyy-MM-dd'T'HH:mm"));
    };

    return (
        <div className="space-y-2">
            <FormLabel
                label={label}
                htmlFor={inputId}
                info={info}
                required={required}
            />

            <Popover>
                <PopoverTrigger
                    id={inputId}
                    type="button"
                    disabled={disabled}
                    className={[
                        "flex h-9 w-full items-center justify-between rounded-md border bg-background px-3 text-sm shadow-sm transition-colors",
                        "hover:bg-accent/50",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        error
                            ? "border-destructive"
                            : "border-input",
                    ].join(" ")}
                >
                    <span
                        className={
                            value
                                ? "text-foreground"
                                : "text-muted-foreground"
                        }
                    >
                        {selectedDate
                            ? format(
                                selectedDate,
                                "dd/MM/yyyy HH:mm",
                                { locale: localeId },
                            )
                            : placeholder}
                    </span>

                    <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
                </PopoverTrigger>

                <PopoverContent
                    align="start"
                    side="bottom"
                    sideOffset={8}
                    className="z-[100] w-auto rounded-lg border bg-popover p-3 shadow-xl"
                >
                    <div className="flex gap-3">
                        {/* Calendar */}
                        <div>
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={handleDateChange}
                                locale={localeId}
                            />
                        </div>

                        {/* Time Picker */}
                        <div className="w-24 border-l pl-3">
                            <div className="mb-3 flex items-center gap-1.5 text-sm font-medium">
                                <Clock3 className="h-4 w-4" />
                                Time
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                {/* Hour */}
                                <div>
                                    <p className="mb-1 text-center text-xs text-muted-foreground">
                                        Hour
                                    </p>

                                    <select
                                        size={5}
                                        value={selectedHour}
                                        disabled={!selectedDate || disabled}
                                        onChange={(e) =>
                                            handleTimeChange(
                                                "hour",
                                                e.target.value,
                                            )
                                        }
                                        className="h-40 w-full rounded-md border bg-background text-center text-sm outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                                    >
                                        {hours.map((hour) => (
                                            <option
                                                key={hour}
                                                value={hour}
                                            >
                                                {hour}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Minute */}
                                <div>
                                    <p className="mb-1 text-center text-xs text-muted-foreground">
                                        Min
                                    </p>

                                    <select
                                        size={5}
                                        value={selectedMinute}
                                        disabled={!selectedDate || disabled}
                                        onChange={(e) =>
                                            handleTimeChange(
                                                "minute",
                                                e.target.value,
                                            )
                                        }
                                        className="h-40 w-full rounded-md border bg-background text-center text-sm outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                                    >
                                        {minutes.map((minute) => (
                                            <option
                                                key={minute}
                                                value={minute}
                                            >
                                                {minute}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t pt-3">
                        <button
                            type="button"
                            disabled={!value || disabled}
                            onClick={() => onChange(null)}
                            className="text-xs text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Clear
                        </button>

                        <span className="text-xs text-muted-foreground">
                            24-hour format
                        </span>
                    </div>
                </PopoverContent>
            </Popover>

            {error && (
                <p className="text-xs text-destructive">
                    {error}
                </p>
            )}
        </div>
    );
}
