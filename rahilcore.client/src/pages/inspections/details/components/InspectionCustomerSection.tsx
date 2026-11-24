interface InspectionCustomerSectionProps {
    customer: {
        name: string | null;
        code: string | null;
        type: string | null;
        email: string | null;
        phone: string | null;
        address: string | null;
    };
}

export default function InspectionCustomerSection({
    customer,
}: InspectionCustomerSectionProps) {
    const fields = [
        { label: "Customer Code", value: customer.code },
        { label: "Customer Type", value: customer.type },
        { label: "Email", value: customer.email },
        { label: "Phone", value: customer.phone },
        { label: "Address", value: customer.address },
    ];

    return (
        <div className="rounded-lg border bg-card p-4 shadow-sm space-y-4">
            <div>
                <h3 className="font-semibold">Customer Information</h3>
                <p className="text-xs text-muted-foreground mt-1">
                    Customer details
                </p>
            </div>

            <div className="space-y-1">
                <p className="text-sm font-medium">
                    {customer.name || "—"}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {fields.map((field) => (
                    <div key={field.label} className="min-w-0 space-y-1">
                        <p className="text-xs text-muted-foreground">
                            {field.label}
                        </p>
                        <p className="text-sm break-words">
                            {field.value || "—"}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}