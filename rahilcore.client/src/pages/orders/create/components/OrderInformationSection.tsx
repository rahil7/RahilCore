
import type { FilterOption } from "../../../../types/common";
import { FormSelect } from "../../../../components/common/FormSelect";
import { FormTextarea } from "../../../../components/common/FormTextarea";
import { FormDateTimePicker } from "../../../../components/ui/FormDateTimePicker";

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

    return (
        <section className="rounded-xl border bg-card p-5">
            <h3 className="mb-5 text-base font-semibold">
                Order Information
            </h3>

            <div className="space-y-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormSelect
                        label="Inspection Form"
                        placeholder="Select inspection form"
                        options={inspectionFormOptions}
                        value={
                            inspectionFormId
                                ? String(inspectionFormId)
                                : null
                        }
                        onValueChange={(selected) => {
                            onInspectionFormChange(
                                selected ? Number(selected) : null,
                            );
                            clearError("inspectionFormId");
                        }}
                        error={errors?.inspectionFormId}
                        disabled={isSubmitting}
                        required
                    />

                    <FormDateTimePicker
                        label="Inspection Date"
                        value={scheduleAt || null}
                        onChange={(value) => {
                            onScheduleAtChange(value ?? "");
                            clearError("scheduleAt");
                        }}
                        error={errors?.scheduleAt}
                        disabled={isSubmitting}
                        required
                    />
                </div>

                <FormTextarea
                    label="Notes"
                    placeholder="Enter notes..."
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
                    {note.length}/500 character
                </div>
            </div>
        </section>
    );
}
