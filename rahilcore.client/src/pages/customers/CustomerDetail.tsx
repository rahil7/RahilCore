
import { useParams } from "react-router-dom";
import { Building2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "../../components/ui/badge";
import { customerService } from "../../services/customer-service";
import { CustomerInformation } from "../../features/customers/components/CustomerInformation";
import { CustomerEmailList } from "../../features/customers/components/CustomerEmailList";
import { CustomerPhoneList } from "../../features/customers/components/CustomerPhoneList";
import type {
    CustomerDetail as CustomerDetailType,
    CustomerEmail,
    CustomerPhone,
    CustomerFilterOptions,
} from "../../types/customer";
import { PageDetailHeader } from "../../components/layout/PageDetailHeader";
import { ContentLoading } from "../../components/feedback/ContentLoading";
import { CustomerFormDialog } from "./CustomerFormDialog";
import { useCustomerContext } from "../../contexts/customers/useCustomerContext";

export default function CustomerDetail() {
    const { id } = useParams<{ id: string }>();

    const [customer, setCustomer] = useState<CustomerDetailType | null>(null);
    const [emails, setEmails] = useState<CustomerEmail[]>([]);
    const [phones, setPhones] = useState<CustomerPhone[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isEditOpen, setIsEditOpen] = useState(false);

    const [filterOptions, setFilterOptions] = useState<CustomerFilterOptions | null>(null);

    const { setShouldRefresh } = useCustomerContext();

    useEffect(() => {
        let cancelled = false;

        async function loadData() {
            try {
                setIsLoading(true);
                setError(null);

                //await new Promise((resolve) => setTimeout(resolve, 1500));

                const customerId = Number(id);

                if (!Number.isSafeInteger(customerId) || customerId <= 0) {
                    throw new Error("ID Customer tidak valid.");
                }

                const [customerRes, emailsRes, phonesRes, filterOptionsRes] =
                    await Promise.all([
                        customerService.getById(customerId),
                        customerService.getEmails(customerId),
                        customerService.getPhones(customerId),
                        customerService.getFilterOptions(),
                    ]);

                if (cancelled) return;

                setCustomer(customerRes.data);
                setEmails(emailsRes.data ?? []);
                setPhones(phonesRes.data ?? []);
                setFilterOptions(filterOptionsRes.data);
            } catch (err) {
                if (cancelled) return;

                console.error("Failed to load customer detail:", err);

                setError(
                    err instanceof Error
                        ? err.message
                        : "Gagal memuat detail customer."
                );
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        loadData();

        return () => {
            cancelled = true;
        };
    }, [id]);

    async function handleEditSuccess() {
        if (!id) return;

        setShouldRefresh(true);

        try {
            const response = await customerService.getById(Number(id));

            if (!response.success || !response.data) {
                throw new Error(
                    response.message || "Gagal memperbarui detail customer."
                );
            }

            setCustomer(response.data);
        } catch (error) {
            console.error("Failed to refresh customer detail:", error);
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-3">
                <PageDetailHeader
                    title="Detail Customer"
                    backTo="/customers"
                />

                <ContentLoading
                    message="Memuat data customer..."
                    description="Sedang mengambil informasi customer."
                />
            </div>
        );
    }

    if (error || !customer) {
        return (
            <div className="space-y-5">
                <PageDetailHeader
                    title="Detail Customer"
                    backTo="/customers"
                />

                <div className="rounded-xl border bg-card p-5">
                    <p className="text-sm text-destructive">
                        {error ?? "Customer tidak ditemukan."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <PageDetailHeader
                title="Detail Customer"
                backTo="/customers"
            />

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
            <CustomerInformation
                customer={customer}
                onEdit={() => setIsEditOpen(true)}
            />

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

            {filterOptions && (
                <CustomerFormDialog
                    key={customer.id}
                    open={isEditOpen}
                    onOpenChange={setIsEditOpen}
                    mode="edit"
                    customer={customer}
                    filterOptions={filterOptions}
                    onSuccess={handleEditSuccess}
                />
            )}
        </div>
    );
}
