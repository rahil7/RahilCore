
import { FileText, Plus, Pencil } from "lucide-react";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";

interface OrderPaymentSectionProps {
    payment: {
        status: string;
        paymentMethod: string;
        paymentDate: string;
        subtotalAmount: number;
        discountAmount: number;
        totalAmount: number;
        referenceNo?: string | null;
        note?: string | null;
        paymentProof?: string | null;
    } | null;
    onCreate: () => void;
    onEdit: () => void;
}

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(amount);

export default function OrderPaymentSection({
    payment,
    onCreate,
    onEdit,
}: OrderPaymentSectionProps) {
    const isPaid = payment?.status === "PAID";

    return (
        <section className="rounded-xl border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold">
                    Payment Information
                </h3>

                {payment ? (
                    <Badge
                        variant="outline"
                        className={
                            isPaid
                                ? "border-green-200 bg-green-50 text-green-700"
                                : "border-amber-200 bg-amber-50 text-amber-700"
                        }
                    >
                        {payment.status}
                    </Badge>
                ) : (
                    <Badge variant="outline">UNPAID</Badge>
                )}
            </div>

            {!payment ? (
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
                <>
                    <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Payment Via
                            </p>
                            <p className="mt-1 text-sm font-medium">
                                {payment.paymentMethod}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Payment Date
                            </p>
                            <p className="mt-1 text-sm font-medium">
                                {payment.paymentDate}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Reference No.
                            </p>
                            <p className="mt-1 text-sm font-medium">
                                {payment.referenceNo || "-"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Subtotal Amount
                            </p>
                            <p className="mt-1 text-sm font-medium">
                                {formatCurrency(payment.subtotalAmount)}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Discount Amount
                            </p>
                            <p className="mt-1 text-sm font-medium">
                                {formatCurrency(payment.discountAmount)}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Total Amount
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                {formatCurrency(payment.totalAmount)}
                            </p>
                        </div>

                        <div className="sm:col-span-2 lg:col-span-3">
                            <p className="text-sm text-muted-foreground">
                                Note
                            </p>
                            <p className="mt-1 whitespace-pre-wrap text-sm">
                                {payment.note || "-"}
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Payment Proof
                            </p>

                            {payment.paymentProof ? (
                                <a
                                    href={payment.paymentProof}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                                >
                                    <FileText className="h-4 w-4" />
                                    View Attachment
                                </a>
                            ) : (
                                <p className="mt-1 text-sm">-</p>
                            )}
                        </div>

                        <Button
                            size="sm"
                            variant="outline"
                            onClick={onEdit}
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Payment
                        </Button>
                    </div>
                </>
            )}
        </section>
    );
}
