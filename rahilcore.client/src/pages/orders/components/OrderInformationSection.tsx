
import type { FilterOption } from "../../../types/common";
import { FormSelect } from "../../../components/common/FormSelect";
import { FormTextarea } from "../../../components/common/FormTextarea";
import type { CreateOrderErrors } from "../../../types/order";

interface OrderInformationSectionProps {
    inspectionForms: FilterOption[];
    inspectionFormId: number | null;
    onInspectionFormChange: (value: number | null) => void;
    note: string;
    onNoteChange: (value: string) => void;
    isSubmitting?: boolean;
    errors?: CreateOrderErrors;
    clearError: (field: keyof CreateOrderErrors) => void;
}

export default function OrderInformationSection({
    inspectionForms,
    inspectionFormId,
    onInspectionFormChange,
    note,
    onNoteChange,
    isSubmitting = false,
    errors,
    clearError
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
                        );
                        clearError("inspectionFormId");
                    }}
                    error={errors?.inspectionFormId}
                    disabled={isSubmitting}
                    required
                />

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
