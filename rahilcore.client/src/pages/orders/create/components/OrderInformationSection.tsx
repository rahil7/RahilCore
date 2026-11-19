
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarDays, Clock3 } from "lucide-react";

import type { FilterOption } from "../../../../types/common";
import { FormSelect } from "../../../../components/common/FormSelect";
import { FormTextarea } from "../../../../components/common/FormTextarea";
import { Calendar } from "../../../../components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../../../../components/ui/popover";

interface OrderInformationSectionProps {
    inspectionForms: FilterOption[];
    inspectionFormId: number | null;
    onInspectionFormChange: (value: number | null) => void;
    scheduleAt: string;
    onScheduleAtChange: (value: string) => void;
    note: string;
    onNoteChange: (value: string) => void;
    clearError: (field: "note" | "scheduleAt" | "inspectionFormId") => void;
    isSubmitting?: boolean;
    errors?: {
        inspectionFormId?: string;
        scheduleAt?: string;
        note?: string;
    };
}

export default function OrderInformationSection({
    inspectionForms,
    inspectionFormId,
    onInspectionFormChange,
    scheduleAt,
    onScheduleAtChange,
    note,
    onNoteChange,
    clearError,
    isSubmitting = false,
    errors,
}: OrderInformationSectionProps) {
    const inspectionFormOptions = inspectionForms.map((item) => ({
        value: String(item.id),
        label: item.name,
    }));

    const selectedDate = scheduleAt ? parseISO(scheduleAt) : undefined;
    const selectedTime = scheduleAt.split("T")[1] || "09:00";

    const [selectedHour, selectedMinute] = selectedTime.split(":");

    const hours = Array.from({ length: 24 }, (_, i) =>
        String(i).padStart(2, "0"),
    );

    const minutes = Array.from({ length: 60 }, (_, i) =>
        String(i).padStart(2, "0"),
    );

    const handleDateChange = (date: Date | undefined) => {
        if (!date) {
            onScheduleAtChange("");
            clearError("scheduleAt");
            return;
        }

        const dateValue = format(date, "yyyy-MM-dd");
        const timeValue = scheduleAt
            ? selectedTime
            : "09:00";

        onScheduleAtChange(`${dateValue}T${timeValue}`);
        clearError("scheduleAt");
    };

    const handleTimeChange = (
        type: "hour" | "minute",
        value: string,
    ) => {
        if (!scheduleAt) return;

        const hour = type === "hour" ? value : selectedHour;
        const minute = type === "minute" ? value : selectedMinute;

        onScheduleAtChange(
            `${scheduleAt.split("T")[0]}T${hour}:${minute}`,
        );

        clearError("scheduleAt");
    };

    return (
        <section className="rounded-xl border bg-card p-5">
            <h3 className="mb-5 text-base font-semibold">
                Order Information
            </h3>

            <div className="space-y-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormSelect
                        label="Inspection Form"
                        placeholder="Pilih inspection form"
                        options={inspectionFormOptions}
                        value={
                            inspectionFormId
                                ? String(inspectionFormId)
                                : null
                        }
                        onValueChange={(selected) => {
                            onInspectionFormChange(
                                selected ? Number(selected) : null,
                            )
                            clearError("inspectionFormId");
                        }}
                        error={errors?.inspectionFormId}
                        disabled={isSubmitting}
                        required
                    />

                    {/* Schedule Date & Time */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Jadwal Inspeksi
                            <span className="ml-1 text-destructive">*</span>
                        </label>

                        <Popover>
                            <PopoverTrigger
                                type="button"
                                disabled={isSubmitting}
                                className={[
                                    "flex h-9 w-full items-center justify-between rounded-md border bg-background px-3 text-sm shadow-sm transition-colors",
                                    "hover:bg-accent/50",
                                    errors?.scheduleAt
                                        ? "border-destructive"
                                        : "border-input",
                                ].join(" ")}
                            >
                                <span
                                    className={
                                        scheduleAt
                                            ? "text-foreground"
                                            : "text-muted-foreground"
                                    }
                                >
                                    {selectedDate
                                        ? format(
                                            selectedDate,
                                            "dd/MM/yyyy HH:mm",
                                            { locale: id },
                                        )
                                        : "Pilih tanggal dan waktu"}
                                </span>

                                <CalendarDays className="h-4 w-4 text-muted-foreground" />
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
                                            locale={id}
                                        />
                                    </div>

                                    {/* Time Picker */}
                                    <div className="w-24 border-l pl-3">
                                        <div className="mb-3 flex items-center gap-1.5 text-sm font-medium">
                                            <Clock3 className="h-4 w-4" />
                                            Time
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <p className="mb-1 text-center text-xs text-muted-foreground">
                                                    Hour
                                                </p>

                                                <select
                                                    size={5}
                                                    value={selectedHour}
                                                    disabled={!scheduleAt}
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

                                            <div>
                                                <p className="mb-1 text-center text-xs text-muted-foreground">
                                                    Min
                                                </p>

                                                <select
                                                    size={5}
                                                    value={selectedMinute}
                                                    disabled={!scheduleAt}
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
                                        onClick={() => handleDateChange(undefined)}
                                        className="text-xs text-muted-foreground hover:text-foreground"
                                    >
                                        Clear
                                    </button>

                                    <span className="text-xs text-muted-foreground">
                                        24-hour format
                                    </span>
                                </div>
                            </PopoverContent>
                        </Popover>

                        {errors?.scheduleAt && (
                            <p className="text-xs text-destructive">
                                {errors.scheduleAt}
                            </p>
                        )}
                    </div>
                </div>

                <FormTextarea
                    label="Note"
                    placeholder="Masukkan catatan order..."
                    value={note}
                    onChange={(e) => {
                        onNoteChange(e.target.value);
                        clearError("note");
                    }}
                    maxLength={500}
                    rows={4}
                    error={errors?.note}
                    disabled={isSubmitting}
                    required
                />

                <div className="text-right text-xs text-muted-foreground">
                    {note.length}/500 karakter
                </div>
            </div>
        </section>
    );
}
