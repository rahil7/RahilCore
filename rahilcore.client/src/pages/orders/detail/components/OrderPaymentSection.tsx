import { FileText, Plus, Pencil } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import type { OrderPayment } from "../../../../types/order";
import StatusBadge from "../../../../components/shared/StatusBadge";
import { paymentStatusConfig } from "../../../../config/status-config";
import { formatDateTime } from "../../../../utils/date-utils";
import { Separator } from "../../../../components/ui/separator";

interface OrderPaymentSectionProps {
    payment: OrderPayment | null;
    paymentStatusId: number;
    paymentStatusName: string;
    proofLoading: boolean;
    onCreate: () => void;
    onEdit: () => void;
    onViewProof: (paymentId: number) => void;
}

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(amount);

export default function OrderPaymentSection({
    payment,
    paymentStatusId,
    paymentStatusName,
    proofLoading,
    onCreate,
    onEdit,
    onViewProof,
}: OrderPaymentSectionProps) {
    return (
        <section className="rounded-xl border bg-card p-5">
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
                <h3 className="font-semibold">
                    Payment Information
                </h3>

                <StatusBadge
                    statusId={paymentStatusId}
                    label={paymentStatusName}
                    config={paymentStatusConfig}
                />
            </div>

            {!payment ? (
                /* Empty state */
                <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-8">
                    <FileText className="h-8 w-8 text-muted-foreground" />

                    <div className="text-center">
                        <p className="text-sm font-medium">
                            No payment record yet
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Payment information has not been added.
                        </p>
                    </div>

                    <Button size="sm" onClick={onCreate}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Payment
                    </Button>
                </div>
            ) : (
                <div className="space-y-5">
                    {/* Transaction Information */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Payment Via
                            </p>
                            <p className="mt-1 text-sm font-medium">
                                {payment.paymentMethodName || "-"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Payment Date
                            </p>
                            <p className="mt-1 text-sm font-medium">
                                {formatDateTime(payment.paymentDate)}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Reference No.
                            </p>
                            <p className="mt-1 break-all text-sm font-medium">
                                {payment.referenceNo || "-"}
                            </p>
                        </div>
                    </div>

                    {/* Amount Breakdown */}
                    <div className="rounded-lg border bg-muted/30 p-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between gap-4">
                                <p className="text-sm text-muted-foreground">
                                    Subtotal Amount
                                </p>
                                <p className="text-sm font-medium tabular-nums">
                                    {formatCurrency(payment.subtotalAmount)}
                                </p>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <p className="text-sm text-muted-foreground">
                                    Discount Amount
                                </p>
                                <p className="text-sm font-medium tabular-nums">
                                    {formatCurrency(payment.discountAmount)}
                                </p>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between gap-4">
                                <p className="text-sm font-medium">
                                    Total Amount
                                </p>
                                <p className="text-lg font-semibold tabular-nums">
                                    {formatCurrency(payment.totalAmount)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Note */}
                    {payment.lastActivityNote && (
                        <div className="mb-3">
                            <p className="text-sm text-muted-foreground">
                                Note
                            </p>
                            <p className="mt-1 whitespace-pre-wrap text-sm">
                                {payment.lastActivityNote}
                            </p>
                        </div>
                    )}

                    {/* Payment Proof */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Payment Proof
                            </p>

                            {payment.hasPaymentProof ? (
                                <button
                                    type="button"
                                    disabled={proofLoading}
                                    onClick={() =>
                                        onViewProof(payment.paymentId)
                                    }
                                    className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <FileText className="h-4 w-4" />
                                    {proofLoading
                                        ? "Opening..."
                                        : "View Attachment"}
                                </button>
                            ) : (
                                <p className="mt-1 text-sm text-muted-foreground">
                                    No payment proof uploaded
                                </p>
                            )}
                        </div>

                        <Button
                            size="sm"
                            variant="outline"
                            onClick={onEdit}
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                    </div>
                </div>
            )}
        </section>
    );
}
