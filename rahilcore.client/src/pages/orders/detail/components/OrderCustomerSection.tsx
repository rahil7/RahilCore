import {
    UserRound,
    Hash,
    Tags,
    Mail,
    Phone,
    MapPinned,
} from "lucide-react";

import type { Customer } from "../../../../types/base";

interface OrderCustomerSectionProps {
    customer: Customer;
}

export default function OrderCustomerSection({
    customer,
}: OrderCustomerSectionProps) {
    const items = [
        {
            label: "Name",
            value: customer.customerName,
            icon: UserRound,
        },
        {
            label: "Code",
            value: customer.customerCode,
            icon: Hash,
        },
        {
            label: "Type",
            value: customer.customerType,
            icon: Tags,
        },
        {
            label: "Email",
            value: customer.email || "-",
            icon: Mail,
        },
        {
            label: "Phone",
            value: customer.phone || "-",
            icon: Phone,
        },
        {
            label: "Address",
            value: customer.address || "-",
            icon: MapPinned,
            fullWidth: true,
        },
    ];

    return (
        <section className="rounded-xl border bg-card p-5">
            <h3 className="font-semibold">Customer Information</h3>

            <div className="grid gap-x-8 gap-y-5 pt-5 sm:grid-cols-2">
                {items.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.label}
                            className={`min-w-0 space-y-1.5 ${item.fullWidth ? "sm:col-span-2" : ""
                                }`}
                        >
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Icon className="h-4 w-4 shrink-0" />
                                <span className="text-sm">
                                    {item.label}
                                </span>
                            </div>

                            <p className="break-words text-sm font-medium">
                                {item.value || "-"}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}