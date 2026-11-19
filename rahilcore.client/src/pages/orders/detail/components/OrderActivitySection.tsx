
import {
    ClipboardList,
    CreditCard,
    UserRound,
    Pencil,
    RefreshCw,
    CircleDot,
} from "lucide-react";

interface OrderActivityItem {
    id: number;
    action: string;
    description: string;
    createdAt: string;
    createdBy: string;
    type: "ORDER" | "PAYMENT" | "ASSIGNMENT" | "UPDATE";
}

interface OrderActivitySectionProps {
    activities: OrderActivityItem[];
}

const activityIcons = {
    ORDER: ClipboardList,
    PAYMENT: CreditCard,
    ASSIGNMENT: UserRound,
    UPDATE: Pencil,
};

export default function OrderActivitySection({
    activities,
}: OrderActivitySectionProps) {
    return (
        <section className="rounded-xl border bg-card p-5">
            <div className="mb-5 flex items-center justify-between">
                <h3 className="font-semibold">
                    Activity History
                </h3>

                <span className="text-sm text-muted-foreground">
                    {activities.length} Activities
                </span>
            </div>

            {activities.length > 0 ? (
                <div className="relative space-y-5">
                    {activities.map((activity, index) => {
                        const Icon = activityIcons[activity.type];

                        return (
                            <div
                                key={activity.id}
                                className="relative flex gap-3"
                            >
                                <div className="relative flex shrink-0 flex-col items-center">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-muted">
                                        <Icon className="h-4 w-4 text-muted-foreground" />
                                    </div>

                                    {index !== activities.length - 1 && (
                                        <div className="absolute top-9 h-full w-px bg-border" />
                                    )}
                                </div>

                                <div className="min-w-0 flex-1 pb-2">
                                    <p className="text-sm font-medium">
                                        {activity.action}
                                    </p>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {activity.description}
                                    </p>

                                    <p className="mt-2 text-xs text-muted-foreground">
                                        {activity.createdAt} · {activity.createdBy}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-8">
                    <CircleDot className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                        No activity history available.
                    </p>
                </div>
            )}
        </section>
    );
}
