export const orderStatusConfig: Record<number, string> = {
    4: "bg-blue-50 text-blue-700 border-blue-200",       // ORDER_CREATED
    5: "bg-amber-50 text-amber-700 border-amber-200",    // AWAITING_ASSIGNMENT
    6: "bg-indigo-50 text-indigo-700 border-indigo-200", // INSPECTOR_ASSIGNED
    7: "bg-cyan-50 text-cyan-700 border-cyan-200",       // INSPECTION_SUBMITTED
    8: "bg-indigo-50 text-indigo-700 border-indigo-200", // UNDER_SCORING
    9: "bg-amber-50 text-amber-700 border-amber-200",    // AWAITING_APPROVAL
    10: "bg-orange-50 text-orange-700 border-orange-200", // REVISION_REQUIRED
    11: "bg-green-50 text-green-700 border-green-200",   // APPROVED
    12: "bg-emerald-50 text-emerald-700 border-emerald-200", // COMPLETED
    13: "bg-red-50 text-red-700 border-red-200",         // CANCELLED
};

export const paymentStatusConfig: Record<number, string> = {
    14: "bg-amber-50 text-amber-700 border-amber-200", // UNPAID
    15: "bg-green-50 text-green-700 border-green-200", // PAID
    16: "bg-red-50 text-red-700 border-red-200",       // REJECTED
};