
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";
import { toast } from "sonner";
import type { UpdateOrderRequest } from "../../../../types/order";
import { FormDateTimePicker } from "../../../../components/ui/FormDateTimePicker";

interface OrderEditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    canEditSchedule: boolean;
    order: {
        scheduleAt: string | null;
        picName: string | null;
        picPhone: string | null;
        note: string;
    };
    onSubmit: (request: UpdateOrderRequest) => Promise<void>;
}

function toDateTimeLocal(value: string | null): string {
    if (!value) return "";

    const date = new Date(value);

    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);

    return localDate.toISOString().slice(0, 16);
}

export default function OrderEditDialog({
    open,
    canEditSchedule,
    onOpenChange,
    order,
    onSubmit,
}: OrderEditDialogProps) {
    const [scheduleAt, setScheduleAt] = useState<string | null>(null);
    const [picName, setPicName] = useState("");
    const [picPhone, setPicPhone] = useState("");
    const [note, setNote] = useState("");
    const [errors, setErrors] = useState({note: ""});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!open) return;

        const initializeForm = () => {
            setScheduleAt(toDateTimeLocal(order.scheduleAt));
            setPicName(order.picName ?? "");
            setPicPhone(order.picPhone ?? "");
            setNote("");
        };

        initializeForm();
    }, [open, order]);

    const handleSubmit = async (e: Parameters<
        NonNullable<React.ComponentProps<"form">["onSubmit"]>
        >[0]
    ) => {
        e.preventDefault();

        if (!note.trim()) {
            setErrors((prev) => ({
                ...prev,
                note: "Note is required.",
            }));
            return;
        }

        setIsSubmitting(true);

        try {
            await onSubmit({
                scheduleAt: canEditSchedule
                    ? scheduleAt
                        ? new Date(scheduleAt).toISOString()
                        : null
                    : order.scheduleAt,
                picName: picName.trim(),
                picPhone: picPhone.trim(),
                note: note.trim(),
            });

            toast.success("Order berhasil diperbarui.");

            onOpenChange(false);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Gagal memperbarui order."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <DialogHeader>
                        <DialogTitle>Edit Order</DialogTitle>
                        <DialogDescription>
                            Update order information and schedule.
                        </DialogDescription>
                    </DialogHeader>

                    <FormDateTimePicker
                        label="Schedule At"
                        value={scheduleAt}
                        onChange={setScheduleAt}
                        required
                        disabled={isSubmitting || !canEditSchedule}
                    />

                    {!canEditSchedule && (
                        <p className="text-xs text-muted-foreground">
                            Schedule cannot be changed at this stage.
                        </p>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="picName">PIC Name</Label>
                            <Input
                                id="picName"
                                value={picName}
                                onChange={(e) => setPicName(e.target.value)}
                                placeholder="Enter PIC name"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="picPhone">PIC Phone</Label>
                            <Input
                                id="picPhone"
                                value={picPhone}
                                onChange={(e) => setPicPhone(e.target.value)}
                                placeholder="Enter PIC phone"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    {/* Note */}
                    <div className="space-y-2">
                        <Label>
                            Note <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            value={note}
                            onChange={(e) => {
                                setNote(e.target.value);
                                setErrors((prev) => ({
                                    ...prev,
                                    note: "",
                                }));
                            }}
                            placeholder="Enter update reason"
                            maxLength={500}
                            rows={3}
                            disabled={isSubmitting}
                        />
                        <div className="flex justify-between">
                            {errors.note ? (
                                <p className="text-xs text-destructive">
                                    {errors.note}
                                </p>
                            ) : (
                                <span />
                            )}
                            <span className="text-xs text-muted-foreground">
                                {note.length}/500
                            </span>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
