import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "../../components/ui/button";

export default function CustomerDetail() {
    const navigate = useNavigate();
    const { id } = useParams();

    return (
        <div className="w-full min-w-0 space-y-4">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate("/customers")}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>

                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            Customer Detail
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Informasi lengkap customer.
                        </p>
                    </div>
                </div>

                <Button onClick={() => navigate(`/customers/${id}/edit`)}>
                    <Pencil className="h-4 w-4" />
                    Edit
                </Button>
            </div>

            {/* Customer Information */}
            <div className="rounded-lg border bg-card p-4">
                Customer Information
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-lg border bg-card p-4">
                    Customer Emails
                </div>

                <div className="rounded-lg border bg-card p-4">
                    Customer Phones
                </div>
            </div>
        </div>
    );
}