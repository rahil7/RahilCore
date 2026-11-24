
import { useState } from "react";
import type { FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";

interface OrderCancelDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    orderNo: string;
    onSubmit: (note: string) => Promise<string>;
}

export default function OrderCancelDialog({
    open,
    onOpenChange,
    orderNo,
    onSubmit,
}: OrderCancelDialogProps) {
    const [note, setNote] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: Parameters<
        NonNullable<React.ComponentProps<"form">["onSubmit"]>
        >[0]
    ) => {
        e.preventDefault();

        if (!note.trim()) {
            setError("Note is required.");
            return;
        }

        setIsSubmitting(true);

        try {
            const message = await onSubmit(note.trim());

            toast.success(message);

            setNote("");
            setError("");
            onOpenChange(false);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to cancel order."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenChange = (value: boolean) => {
        if (isSubmitting) return;

        if (!value) {
            setNote("");
            setError("");
        }

        onOpenChange(value);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <DialogHeader>
                        <DialogTitle>Cancel Order?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to cancel order{" "}
                            <span className="font-medium text-foreground">
                                {orderNo}
                            </span>
                            ? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Note */}
                    <div className="space-y-2">
                        <Label>
                            Note <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            value={note}
                            onChange={(e) => {
                                setNote(e.target.value);
                                setError("");
                            }}
                            placeholder="Enter cancellation reason"
                            maxLength={500}
                            rows={3}
                            disabled={isSubmitting}
                        />
                        <div className="flex justify-between">
                            {error ? (
                                <p className="text-xs text-destructive">
                                    {error}
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
                            onClick={() => handleOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Keep Order
                        </Button>

                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={isSubmitting}
                        >
                            {isSubmitting && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Confirm Cancellation
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
