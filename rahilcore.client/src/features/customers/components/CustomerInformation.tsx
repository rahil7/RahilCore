
import {
    Hash,
    Tags,
    Mail,
    Phone,
    MapPin,
    MapPinned,
    Clock3,
    Pencil,
    CalendarDays,
    UserRound,
    MessageSquareText,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import type { CustomerDetail as CustomerDetailType } from "../../../types/customer";
import { formatDateTime } from "../../../utils/date-utils";

interface CustomerInformationProps {
    customer: CustomerDetailType;
    onEdit: () => void;
}

export function CustomerInformation({
    customer,
    onEdit
}: CustomerInformationProps) {
    const items = [
        {
            label: "Kode Customer",
            value: customer.custCode,
            icon: Hash,
        },
        {
            label: "Tipe Customer",
            value: customer.custTypeName,
            icon: Tags,
        },
        {
            label: "Email",
            value: customer.email || "-",
            icon: Mail,
        },
        {
            label: "Nomor Telepon",
            value: customer.phone || "-",
            icon: Phone,
        },
        {
            label: "Kota",
            value: customer.cityName || "-",
            icon: MapPin,
        },
        {
            label: "Alamat",
            value: customer.address || "-",
            icon: MapPinned,
        },
    ];

    return (
        <div className="rounded-xl border bg-card">
            <div className="flex items-center justify-between gap-3 border-b px-5 py-4">
                <h3 className="font-semibold">Informasi Customer</h3>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={onEdit}
                >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                </Button>
            </div>

            <div className="grid gap-x-8 gap-y-6 p-5 sm:grid-cols-2">
                {items.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div key={item.label} className="min-w-0 space-y-1.5">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Icon className="h-4 w-4 shrink-0" />
                                <span className="text-sm">
                                    {item.label}
                                </span>
                            </div>

                            <p className="break-words text-sm font-medium">
                                {item.value}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Informasi Pencatatan */}
            <div className="border-t px-5 py-3">
                <div className="mb-3 flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-muted-foreground" />
                    <h4 className="text-sm font-medium">
                        Informasi Pencatatan
                    </h4>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground mb-2">Dibuat</p>

                        <div className="flex items-center gap-2">
                            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs font-medium">
                                {formatDateTime(customer.createdAt)}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <UserRound className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                                {customer.createdBy || "-"}
                            </span>
                        </div>

                        <div className="flex items-start gap-2">
                            <MessageSquareText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                            <span className="text-xs">
                                {customer.createdNote || "-"}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground mb-2">Diperbarui</p>

                        <div className="flex items-center gap-2">
                            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs font-medium">
                                {formatDateTime(customer.updatedAt)}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <UserRound className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                                {customer.updatedBy || "-"}
                            </span>
                        </div>

                        <div className="flex items-start gap-2">
                            <MessageSquareText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                            <span className="text-xs">
                                {customer.updatedNote || "-"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
