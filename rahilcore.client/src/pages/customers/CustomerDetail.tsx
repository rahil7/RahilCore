
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Building2 } from "lucide-react";

import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

import { CustomerInformation } from "../../features/customers/components/CustomerInformation";
import { CustomerEmailList } from "../../features/customers/components/CustomerEmailList";
import { CustomerPhoneList } from "../../features/customers/components/CustomerPhoneList";
import type { CustomerEmail } from "../../types/customer";
import type { CustomerPhone } from "../../types/customer";

export default function CustomerDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Temporary data
    const customer = {
        id: Number(id),
        custTypeId: 1,
        custTypeName: "Showroom",
        custCode: "CUST-00001",
        custName: "PT Contoh Customer",
        email: "info@example.com",
        phone: "08123456789",
        cityId: 156,
        cityName: "Jakarta Selatan",
        address: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since",
        isActive: true,
        createdAt: "2026-11-02T08:00:00",
        createdBy: "admin",
        updatedAt: "2026-11-02T10:00:00",
        updatedBy: "admin",
        createdNote: "Initial customer registration",
        updatedNote: "Customer information updated",
    };

const emails: CustomerEmail[] = [
    {
        id: 1,
        email: "info@example.com",
        isPrimary: true,
        isActive: true,
        createdAt: "2026-11-02T08:00:00",
        createdBy: "admin",
        updatedAt: "2026-11-02T10:00:00",
        updatedBy: "admin",
        createdNote: "Initial email registration",
        updatedNote: "Email verified",
    },
    {
        id: 2,
        email: "finance@example.com",
        isPrimary: false,
        isActive: true,
        createdAt: "2026-11-02T09:00:00",
        createdBy: "admin",
        updatedAt: null,
        updatedBy: null,
        createdNote: null,
        updatedNote: null,
    },
    {
        id: 3,
        email: "support@example.com",
        isPrimary: false,
        isActive: false,
        createdAt: "2026-11-02T09:30:00",
        createdBy: "admin",
        updatedAt: null,
        updatedBy: null,
        createdNote: "Old contact",
        updatedNote: null,
    },
    {
        id: 4,
        email: "support@example.com",
        isPrimary: false,
        isActive: false,
        createdAt: "2026-11-02T09:30:00",
        createdBy: "admin",
        updatedAt: null,
        updatedBy: null,
        createdNote: "Old contact",
        updatedNote: null,
    },
];

const phones: CustomerPhone[] = [
    {
        id: 1,
        phone: "08123456789",
        isPrimary: true,
        isActive: true,
        createdAt: "2026-11-02T08:00:00",
        createdBy: "admin",
        updatedAt: "2026-11-02T10:00:00",
        updatedBy: "admin",
        createdNote: "Initial phone registration",
        updatedNote: "Phone verified",
    },
    {
        id: 2,
        phone: "08234567890",
        isPrimary: false,
        isActive: true,
        createdAt: "2026-11-02T09:00:00",
        createdBy: "admin",
        updatedAt: null,
        updatedBy: null,
        createdNote: null,
        updatedNote: null,
    },
    {
        id: 3,
        phone: "08234567890",
        isPrimary: false,
        isActive: true,
        createdAt: "2026-11-02T09:00:00",
        createdBy: "admin",
        updatedAt: null,
        updatedBy: null,
        createdNote: null,
        updatedNote: null,
    },
    {
        id: 4,
        phone: "08234567890",
        isPrimary: false,
        isActive: true,
        createdAt: "2026-11-02T09:00:00",
        createdBy: "admin",
        updatedAt: null,
        updatedBy: null,
        createdNote: null,
        updatedNote: null,
    },
    {
        id: 5,
        phone: "08234567890",
        isPrimary: false,
        isActive: true,
        createdAt: "2026-11-02T09:00:00",
        createdBy: "admin",
        updatedAt: null,
        updatedBy: null,
        createdNote: null,
        updatedNote: null,
    },
];

    return (
        <div className="space-y-5">
            {/* Page Header */}
            <div className="space-y-2">
                <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-8 text-muted-foreground"
                    onClick={() => navigate("/customers")}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Daftar Customer
                </Button>

                <h1 className="text-xl font-semibold tracking-tight">
                    Detail Customer
                </h1>
            </div>

            {/* Customer Summary */}
            <div className="rounded-xl border bg-card px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <Building2 className="h-6 w-6 text-muted-foreground" />
                        </div>

                        <div className="min-w-0 space-y-1">
                            <h2 className="truncate font-semibold">
                                {customer.custName}
                            </h2>

                            <p className="text-sm text-muted-foreground">
                                {customer.custCode}
                                <span className="mx-2">·</span>
                                {customer.custTypeName}
                            </p>
                        </div>
                    </div>

                    <Badge
                        variant={customer.isActive ? "default" : "secondary"}
                        className="shrink-0"
                    >
                        {customer.isActive ? "Aktif" : "Tidak Aktif"}
                    </Badge>
                </div>
            </div>

            {/* Customer Information */}
            <CustomerInformation customer={customer} />

            <div className="grid gap-5 lg:grid-cols-2">
                <CustomerEmailList
                    emails={emails}
                    onAdd={() => console.log("Add email")}
                    onSetPrimary={(id) => console.log("Set primary email", id)}
                    onDelete={(id) => console.log("Delete email", id)}
                />

                <CustomerPhoneList
                    phones={phones}
                    onAdd={() => console.log("Add phone")}
                    onSetPrimary={(id) => console.log("Set primary phone", id)}
                    onDelete={(id) => console.log("Delete phone", id)}
                />
            </div>
        </div>
    );
}
