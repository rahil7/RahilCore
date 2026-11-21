import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { FormSelect } from "../../../../components/common/FormSelect";
import { Textarea } from "../../../../components/ui/textarea";
import { Label } from "../../../../components/ui/label";
import { orderService } from "../../../../services/order-service";
import type { OrderAssignmentOptions, OrderAssignRequest } from "../../../../types/order";
import { FormDateTimePicker } from "../../../../components/ui/FormDateTimePicker";

interface OrderAssignmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (request: OrderAssignRequest) => Promise<void>;
    currentAssignment?: {
        inspectorUsername: string;
        inspectorName: string;
        scheduleAt: string;
    } | null;
}

export default function OrderAssignmentDialog({
    open,
    onOpenChange,
    onSubmit,
    currentAssignment,
}: OrderAssignmentDialogProps) {
    const isReassign = Boolean(currentAssignment);

    const [inspectors, setInspectors] = useState<OrderAssignmentOptions["inspectors"]>([]);
    const [loadingOptions, setLoadingOptions] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [inspectorUsername, setInspectorUsername] = useState(
        currentAssignment?.inspectorUsername ?? ""
    );

    const [scheduleAt, setScheduleAt] = useState<string | null>(
        currentAssignment?.scheduleAt ?? null
    );

    const [note, setNote] = useState("");

    const [errors, setErrors] = useState<{
        inspectorUsername?: string;
        scheduleAt?: string;
        note?: string;
    }>({});

    useEffect(() => {
        if (!open) return;

        const loadOptions = async () => {
            try {
                setLoadingOptions(true);

                const response = await orderService.getAssignmentOptions();

                setInspectors(response.data?.inspectors ?? []);
            } catch (error) {
                console.error("Failed to load assignment options:", error);
            } finally {
                setLoadingOptions(false);
            }
        };

        loadOptions();
    }, [open]);

    function resetForm() {
        setInspectorUsername("");
        setScheduleAt(null);
        setNote("");
        setErrors({});
    }

    function handleDialogOpenChange(nextOpen: boolean) {
        if (nextOpen) {
            onOpenChange(true);
            return;
        }

        // Prevent closing from outside the dialog.
    }

    function validate(): boolean {
        const nextErrors: typeof errors = {};

        if (!inspectorUsername) {
            nextErrors.inspectorUsername = "Inspector is required.";
        }

        if (!scheduleAt) {
            nextErrors.scheduleAt = "Schedule is required.";
        }

        if (!note.trim()) {
            nextErrors.note = "Note is required.";
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    }

    async function handleSubmit(
        event: Parameters<
            NonNullable<React.ComponentProps<"form">["onSubmit"]>
        >[0]
    ) {
        event.preventDefault();

        if (!validate()) return;

        try {
            setSubmitting(true);

            await onSubmit({
                inspectorUsername,
                scheduleAt: scheduleAt!,
                note: note.trim(),
            });

            resetForm();
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to assign inspector:", error);
        } finally {
            setSubmitting(false);
        }
    }

    const inspectorOptions = inspectors.map((inspector) => ({
        value: inspector.username,
        label: inspector.displayName,
    }));

    return (
        <Dialog open={open} onOpenChange={handleDialogOpenChange}>
            <DialogContent
                className="flex max-h-[90vh] flex-col overflow-hidden sm:max-w-xl"
                showCloseButton={false}
            >
                <DialogHeader className="shrink-0">
                    <DialogTitle>
                        {isReassign ? "Reassign Inspector" : "Assign Inspector"}
                    </DialogTitle>
                    <DialogDescription>
                        {isReassign
                            ? "Update inspector assignment and inspection schedule."
                            : "Assign an inspector and set the inspection schedule."}
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    {/* Scrollable Form */}
                    <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-1 py-2">

                        {/* Inspector */}
                        <FormSelect
                            label="Inspector"
                            placeholder={
                                loadingOptions
                                    ? "Loading inspectors..."
                                    : "Select inspector"
                            }
                            options={inspectorOptions}
                            value={inspectorUsername || null}
                            onValueChange={(value) => {
                                setInspectorUsername(value ?? "");
                                setErrors((prev) => ({
                                    ...prev,
                                    inspectorUsername: "",
                                }));
                            }}
                            error={errors.inspectorUsername}
                            disabled={loadingOptions || submitting}
                            required
                        />

                        {/* Schedule */}
                        <FormDateTimePicker
                            label="Schedule At"
                            value={scheduleAt}
                            onChange={(value) => {
                                setScheduleAt(value);
                                setErrors((prev) => ({
                                    ...prev,
                                    scheduleAt: "",
                                }));
                            }}
                            error={errors.scheduleAt}
                            disabled={submitting}
                            required
                        />

                        {/* Note */}
                        <div className="space-y-2">
                            <Label htmlFor="assignment-note">Note</Label>
                            <Textarea
                                id="assignment-note"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Enter note"
                                maxLength={500}
                                disabled={submitting}
                                required
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <DialogFooter className="shrink-0 border-t bg-background pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={submitting}
                            onClick={() => {
                                resetForm();
                                onOpenChange(false);
                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={submitting || loadingOptions}
                        >
                            {submitting
                                ? "Saving..."
                                : isReassign
                                    ? "Reassign Inspector"
                                    : "Assign Inspector"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}