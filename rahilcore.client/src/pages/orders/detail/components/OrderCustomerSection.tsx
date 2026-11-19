
interface OrderCustomerSectionProps {
    customer: {
        code: string;
        name: string;
        type: string;
        email?: string | null;
        phone?: string | null;
        address?: string | null;
    };
    picName?: string | null;
    picPhone?: string | null;
}

export default function OrderCustomerSection({
    customer,
    picName,
    picPhone,
}: OrderCustomerSectionProps) {
    return (
        <section className="rounded-xl border bg-card p-5">
            <h3 className="mb-4 font-semibold">
                Informasi Customer
            </h3>

            <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                        Name
                    </p>
                    <p className="text-sm font-medium">
                        {customer.name}
                    </p>
                </div>

                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                        Code
                    </p>
                    <p className="text-sm font-medium">
                        {customer.code}
                    </p>
                </div>

                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                        Tipe
                    </p>
                    <p className="text-sm font-medium">
                        {customer.type}
                    </p>
                </div>

                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                        Email
                    </p>
                    <p className="text-sm font-medium">
                        {customer.email || "-"}
                    </p>
                </div>

                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                        Phone
                    </p>
                    <p className="text-sm font-medium">
                        {customer.phone || "-"}
                    </p>
                </div>

                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                        Nama PIC
                    </p>
                    <p className="text-sm font-medium">
                        {picName || "-"}
                    </p>
                </div>

                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                        Phone PIC
                    </p>
                    <p className="text-sm font-medium">
                        {picPhone || "-"}
                    </p>
                </div>

                <div className="space-y-1 sm:col-span-2">
                    <p className="text-sm text-muted-foreground">
                        Alamat
                    </p>
                    <p className="text-sm font-medium">
                        {customer.address || "-"}
                    </p>
                </div>
            </div>
        </section>
    );
}
