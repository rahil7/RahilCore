
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Badge } from "../../../components/ui/badge";

import CustomerActions from "./CustomerActions";
import CustomerActivityCell from "./CustomerActivityCell";
import type { CustomerListItem } from "../../../types/customer";

interface CustomerMobileCardProps {
    customer: CustomerListItem;
}

export default function CustomerMobileCard({
    customer,
}: CustomerMobileCardProps) {
    const initials = customer.custName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();

    return (
        <div className="rounded-lg border bg-card p-3 shadow-sm">
            {/* Customer Header */}
            <div className="flex min-w-0 items-center gap-3">
                <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="bg-muted text-xs font-medium">
                        {initials}
                    </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1 space-y-1">
                    <p
                        className="truncate text-sm font-semibold"
                        title={customer.custName}
                    >
                        {customer.custName}
                    </p>

                    <p className="text-xs text-muted-foreground">
                        {customer.custCode}
                    </p>
                </div>

                <Badge
                    variant={customer.isActive ? "default" : "secondary"}
                    className="shrink-0"
                >
                    {customer.isActive ? "Active" : "Inactive"}
                </Badge>

                <CustomerActions customerId={customer.id} />
            </div>

            {/* Customer Information */}
            <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-3 border-t pt-3">
                <div className="min-w-0 space-y-1">
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="truncate text-sm" title={customer.phone}>
                        {customer.phone}
                    </p>
                </div>

                <div className="min-w-0 space-y-1">
                    <p className="text-xs text-muted-foreground">City</p>
                    <p className="truncate text-sm" title={customer.cityName ?? "-"}>
                        {customer.cityName ?? "-"}
                    </p>
                </div>

                <div className="col-span-2 min-w-0 space-y-1">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="truncate text-sm" title={customer.email ?? "-"}>
                        {customer.email}
                    </p>
                </div>
            </div>

            {/* Activity Information */}
            <div className="mt-3 grid grid-cols-2 gap-3 border-t pt-3">
                <div className="min-w-0 space-y-1">
                    <p className="text-xs text-muted-foreground">Created</p>

                    <CustomerActivityCell date={customer.createdAt} />
                </div>

                <div className="min-w-0 space-y-1">
                    <p className="text-xs text-muted-foreground">
                        Last Activity
                    </p>

                    <CustomerActivityCell
                        date={customer.lastActivityAt}
                        by={customer.lastActivityBy}
                        showTime
                    />
                </div>
            </div>
        </div>
    );
}
