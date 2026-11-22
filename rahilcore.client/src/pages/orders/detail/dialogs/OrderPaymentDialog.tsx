import type { CreatePaymentRequest, OrderDetailResponse, UpdatePaymentRequest } from "../../../../types/order";

import { useEffect, useState } from "react";
import { FileText, Upload, X } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { Textarea } from "../../../../components/ui/textarea";
import { Label } from "../../../../components/ui/label";
import { orderService } from "../../../../services/order-service";
import { FormDateTimePicker } from "../../../../components/ui/FormDateTimePicker";
import { FormSelect } from "../../../../components/common/FormSelect";
import { FormInput } from "../../../../components/common/FormInput";
import type { FilterOption } from "../../../../types/common";
import { CurrencyInput } from "../../../../components/common/CurrencyInput";

interface OrderPaymentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "create" | "edit";
    payment?: OrderDetailResponse["payment"];
    onViewPaymentProof?: () => void;
    onSubmit: (
        request: CreatePaymentRequest | UpdatePaymentRequest
    ) => Promise<void>;
}

const MAX_FILE_SIZE = 3 * 1024 * 1024;

const ALLOWED_FILE_TYPES = [
    "image/jpeg",
    "image/png",
    "application/pdf",
];

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(amount);

export default function OrderPaymentDialog({
    open,
    onOpenChange,
    mode,
    payment,
    onViewPaymentProof,
    onSubmit,
}: OrderPaymentDialogProps) {
    const [paymentMethods, setPaymentMethods] = useState<FilterOption[]>([]);
    const [loadingOptions, setLoadingOptions] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [paymentMethodId, setPaymentMethodId] = useState(
        payment ? String(payment.paymentMethodId) : ""
    );

    const [paymentDate, setPaymentDate] = useState<string | null>(
        payment?.paymentDate ?? null
    );

    const [referenceNo, setReferenceNo] = useState(
        payment?.referenceNo ?? ""
    );

    const [subtotalAmount, setSubtotalAmount] = useState(
        payment ? String(payment.subtotalAmount) : ""
    );

    const [discountAmount, setDiscountAmount] = useState(
        payment ? String(payment.discountAmount ?? 0) : ""
    );

    const [note, setNote] = useState("");

    const [paymentProof, setPaymentProof] = useState<File | null>(null);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [fileError, setFileError] = useState("");

    const subtotal = Number(subtotalAmount) || 0;
    const discount = Number(discountAmount) || 0;
    const totalAmount = subtotal - discount;

    useEffect(() => {
        if (!open) return;

        const fetchPaymentOptions = async () => {
            try {
                setLoadingOptions(true);

                const response = await orderService.getPaymentOptions();

                setPaymentMethods(response.data?.paymentMethods ?? []);
            } catch (error) {
                console.error("Failed to fetch payment methods:", error);
            } finally {
                setLoadingOptions(false);
            }
        };

        fetchPaymentOptions();
    }, [open]);

    const resetForm = () => {
        setPaymentMethodId(payment ? String(payment.paymentMethodId) : "");
        setPaymentDate(payment?.paymentDate ?? null);
        setReferenceNo(payment?.referenceNo ?? "");
        setSubtotalAmount(payment ? String(payment.subtotalAmount) : "");
        setDiscountAmount(payment ? String(payment.discountAmount ?? 0) : "");
        setPaymentProof(null);
        setErrors({});
        setFileError("");
    };

    const handleFileChange = (file: File | null) => {
        setFileError("");

        if (!file) {
            setPaymentProof(null);
            return;
        }

        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            setFileError("File harus berupa JPG, PNG, atau PDF.");
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setFileError("Ukuran file maksimal 3 MB.");
            return;
        }

        setPaymentProof(file);
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!paymentMethodId) {
            newErrors.paymentMethodId = "Payment method wajib dipilih.";
        }

        if (!paymentDate) {
            newErrors.paymentDate = "Payment date wajib diisi.";
        }

        if (!subtotalAmount || subtotal <= 0) {
            newErrors.subtotalAmount = "Subtotal amount harus lebih dari 0.";
        }

        if (discount < 0) {
            newErrors.discountAmount = "Discount tidak boleh negatif.";
        }

        if (discount > subtotal) {
            newErrors.discountAmount = "Discount tidak boleh melebihi subtotal.";
        }

        if (!note.trim()) {
            newErrors.note = "Note wajib diisi.";
        } else if (note.length > 500) {
            newErrors.note = "Note maksimal 500 karakter.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0 && !fileError;
    };

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
                paymentMethodId: Number(paymentMethodId),
                subtotalAmount: subtotal,
                discountAmount: discountAmount.trim() ? discount : null,
                paymentDate: paymentDate!,
                referenceNo: referenceNo.trim() || null,
                note: note.trim(),
                paymentProof,
            });

            resetForm();
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to create payment:", error);

            if (error instanceof Error) {
                console.error("Error message:", error.message);
            }

            console.error("Error detail:", error);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) return;
                onOpenChange(true);
            }}
        >
            <DialogContent
                className="flex max-h-[90vh] flex-col overflow-hidden sm:max-w-xl"
                showCloseButton={false}
            >
                <DialogHeader className="shrink-0">
                    <DialogTitle>
                        {mode === "edit" ? "Edit Payment" : "Create Payment"}
                    </DialogTitle>

                    <DialogDescription>
                        {mode === "edit"
                            ? "Update payment information for this order."
                            : "Add payment information for this order."}
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    {/* Scrollable Form */}
                    <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-1 py-2">
                        {/* Payment Method */}
                        <FormSelect
                            label="Payment Via"
                            placeholder={
                                loadingOptions
                                    ? "Loading payment methods..."
                                    : "Select payment method"
                            }
                            options={paymentMethods.map((item) => ({
                                value: String(item.id),
                                label: item.name,
                            }))}
                            value={paymentMethodId || null}
                            onValueChange={(value) => {
                                setPaymentMethodId(value ?? "");
                                setErrors((prev) => ({
                                    ...prev,
                                    paymentMethodId: "",
                                }));
                            }}
                            error={errors.paymentMethodId}
                            disabled={loadingOptions || submitting}
                            required
                        />

                        {/* Payment Date */}
                        <FormDateTimePicker
                            label="Payment Date"
                            value={paymentDate}
                            onChange={(value) => {
                                setPaymentDate(value);
                                setErrors((prev) => ({
                                    ...prev,
                                    paymentDate: "",
                                }));
                            }}
                            error={errors.paymentDate}
                            required
                            disabled={submitting}
                        />

                        {/* Reference Number */}
                        <FormInput
                            label="Reference No."
                            type="input"
                            placeholder="Reference No"
                            value={referenceNo}
                            onChange={(e) => {
                                setReferenceNo(e.target.value)
                            }}
                            disabled={submitting}
                        />

                        {/* Amount */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <CurrencyInput
                                label="Subtotal Amount"
                                value={subtotalAmount}
                                onChange={(value) => {
                                    setSubtotalAmount(value);
                                    setErrors((prev) => ({
                                        ...prev,
                                        subtotalAmount: "",
                                    }));
                                }}
                                error={errors.subtotalAmount}
                                disabled={submitting}
                                required
                            />

                            <CurrencyInput
                                label="Discount Amount"
                                value={discountAmount}
                                onChange={(value) => {
                                    setDiscountAmount(value);
                                    setErrors((prev) => ({
                                        ...prev,
                                        discountAmount: "",
                                    }));
                                }}
                                error={errors.discountAmount}
                                disabled={submitting}
                            />
                        </div>

                        {/* Total Amount */}
                        <div className="rounded-lg bg-muted/50 p-3">
                            <p className="text-sm text-muted-foreground">
                                Total Amount
                            </p>
                            <p className="mt-1 text-lg font-semibold">
                                {formatCurrency(totalAmount)}
                            </p>
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
                                placeholder="Enter payment note"
                                maxLength={500}
                                rows={3}
                                disabled={submitting}
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

                        {/* Payment Proof */}
                        {/* Payment Proof */}
                        <div className="space-y-2">
                            <Label>Payment Proof</Label>

                            {/* Existing Payment Proof */}
                            {mode === "edit" &&
                                payment?.hasPaymentProof &&
                                !paymentProof && (
                                    <div className="flex items-center justify-between rounded-lg border p-3">
                                        <div className="flex min-w-0 items-center gap-2">
                                            <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium">
                                                    Existing Payment Proof
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Payment proof is already uploaded.
                                                </p>
                                            </div>
                                        </div>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={onViewPaymentProof}
                                            disabled={submitting}
                                        >
                                            View
                                        </Button>
                                    </div>
                                )}

                            {/* New Payment Proof */}
                            {paymentProof ? (
                                <div className="flex items-center justify-between rounded-lg border p-3">
                                    <div className="flex min-w-0 items-center gap-2">
                                        <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium">
                                                {paymentProof.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {(paymentProof.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleFileChange(null)}
                                        disabled={submitting}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-6 text-center hover:bg-muted/30">
                                    <Upload className="h-6 w-6 text-muted-foreground" />
                                    <span className="text-sm font-medium">
                                        Click to upload payment proof
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        JPG, PNG, PDF (Max. 3 MB)
                                    </span>
                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        className="hidden"
                                        disabled={submitting}
                                        onChange={(e) => {
                                            handleFileChange(e.target.files?.[0] ?? null);
                                            e.target.value = "";
                                        }}
                                    />
                                </label>
                            )}

                            {fileError && (
                                <p className="text-xs text-destructive">
                                    {fileError}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Sticky Footer */}
                    <DialogFooter className="shrink-0 border-t bg-background pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                resetForm();
                                onOpenChange(false);
                            }}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" disabled={submitting || loadingOptions}>
                            {submitting
                                ? "Saving..."
                                : mode === "edit"
                                    ? "Update Payment"
                                    : "Create Payment"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}