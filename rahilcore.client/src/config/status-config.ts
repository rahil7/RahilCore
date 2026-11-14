export interface StatusConfig {
    label: string;
    className: string;
}

export const orderStatusConfig: Record<number, StatusConfig> = {
    1: {
        label: "New Order",
        className: "bg-blue-50 text-blue-700 border-blue-200",
    },
    2: {
        label: "In Progress",
        className: "bg-amber-50 text-amber-700 border-amber-200",
    },
    3: {
        label: "Completed",
        className: "bg-green-50 text-green-700 border-green-200",
    },
    4: {
        label: "Cancelled",
        className: "bg-red-50 text-red-700 border-red-200",
    },
};

export const paymentStatusConfig: Record<number, StatusConfig> = {
    1: {
        label: "Unpaid",
        className: "bg-amber-50 text-amber-700 border-amber-200",
    },
    2: {
        label: "Paid",
        className: "bg-green-50 text-green-700 border-green-200",
    },
};