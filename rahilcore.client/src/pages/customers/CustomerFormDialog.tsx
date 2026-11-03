import { useState } from "react";

import { Button } from "../../components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/dialog";

import { CustomerForm } from "./CustomerForm";

import { customerService } from "../../services/customer-service";

import type {
    CustomerDetail,
    CustomerFilterOptions,
    CreateCustomerRequest,
    UpdateCustomerRequest,
} from "../../types/customer";

interface CustomerFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "create" | "edit";
    customer?: CustomerDetail;
    filterOptions: CustomerFilterOptions;
    onSuccess: () => void;
}

export function CustomerFormDialog({
    open,
    onOpenChange,
    mode,
    customer,
    filterOptions,
    onSuccess,
}: CustomerFormDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEdit = mode === "edit";

    async function handleSubmit(
        data: CreateCustomerRequest | UpdateCustomerRequest
    ) {
        try {
            setIsSubmitting(true);
            setError(null);

            if (isEdit) {
                if (!customer) {
                    throw new Error("Data customer tidak ditemukan.");
                }

                await customerService.update(
                    customer.id,
                    data as UpdateCustomerRequest
                );
            } else {
                await customerService.create(
                    data as CreateCustomerRequest
                );
            }

            onOpenChange(false);
            onSuccess();
        } catch (err) {
            console.error("Failed to save customer:", err);

            setError(
                err instanceof Error
                    ? err.message
                    : "Gagal menyimpan customer."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleOpenChange(
        nextOpen: boolean,
        eventDetails?: { reason?: string }
    ) {
        if (isSubmitting) return;

        if (!nextOpen) {
            const reason = eventDetails?.reason;

            // Jangan tutup saat klik di luar atau tekan Escape.
            if (
                reason === "outside-press" ||
                reason === "escape-key"
            ) {
                return;
            }

            setError(null);
        }

        onOpenChange(nextOpen);
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="
        flex
        max-h-[90dvh]
        w-[calc(100%-2rem)]
        flex-col
        gap-0
        overflow-hidden
        p-0
        sm:max-w-xl
    "
            >
                {/* Header - Fixed */}
                <DialogHeader className="shrink-0 border-b px-5 py-4">
                    <DialogTitle>
                        {isEdit ? "Edit Customer" : "Tambah Customer"}
                    </DialogTitle>
                </DialogHeader>

                {/* Content - Scrollable */}
                <div className="min-h-0 flex-[0_1_auto] overflow-y-auto overscroll-contain px-5 py-5">
                    {error && (
                        <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    <CustomerForm
                        mode={mode}
                        customer={customer}
                        filterOptions={filterOptions}
                        isSubmitting={isSubmitting}
                        onSubmit={handleSubmit}
                    />
                </div>

                {/* Footer - Fixed */}
                <DialogFooter className="mx-0 mb-0 flex-row justify-end border-t bg-muted/30 px-5 py-3">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isSubmitting}
                        onClick={() => handleOpenChange(false)}
                    >
                        Batal
                    </Button>

                    <Button
                        type="submit"
                        form="customer-form"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? "Menyimpan..."
                            : isEdit
                                ? "Simpan Perubahan"
                                : "Simpan Customer"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}