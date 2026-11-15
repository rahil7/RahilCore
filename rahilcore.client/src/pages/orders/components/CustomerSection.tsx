
import { useEffect, useRef, useState } from "react";
import type { CustomerLookupItem } from "../../../types/customer";
import type { FilterOption } from "../../../types/common";
import { customerService } from "../../../services/customer-service";
import { FormSelect } from "../../../components/common/FormSelect";
import NewCustomerForm, {
    type NewOrderCustomer,
} from "./NewCustomerForm";
import { FormInput } from "../../../components/common/FormInput";
import { PhoneInput } from "../../../components/common/PhoneInput";
import type { CreateOrderErrors } from "../../../types/order";

type CustomerMode = "existing" | "new";

interface CustomerSectionProps {
    cities: FilterOption[];
    customerMode: CustomerMode;
    onCustomerModeChange: (mode: CustomerMode) => void;
    selectedCustomer: CustomerLookupItem | null;
    onSelectedCustomerChange: (
        customer: CustomerLookupItem | null,
    ) => void;
    newCustomer: NewOrderCustomer;
    onNewCustomerChange: (value: NewOrderCustomer) => void;
    custPresent: boolean;
    onCustPresentChange: (value: boolean) => void;
    picName: string;
    onPicNameChange: (value: string) => void;
    picPhone: string;
    onPicPhoneChange: (value: string) => void;
    errors?: CreateOrderErrors;
    clearError: (field: keyof CreateOrderErrors) => void;
    isSubmitting?: boolean;
}

export default function CustomerSection({
    cities,
    customerMode,
    onCustomerModeChange,
    selectedCustomer,
    onSelectedCustomerChange,
    newCustomer,
    onNewCustomerChange,
    custPresent,
    onCustPresentChange,
    picName,
    onPicNameChange,
    picPhone,
    onPicPhoneChange,
    errors,
    clearError,
    isSubmitting = false,
}: CustomerSectionProps) {
    const [customers, setCustomers] = useState<CustomerLookupItem[]>([]);
    const [customerSearch, setCustomerSearch] = useState("");
    const [customerPage, setCustomerPage] = useState(1);

    const [loadingCustomers, setLoadingCustomers] = useState(false);
    const [customerError, setCustomerError] = useState("");
    const [hasMoreCustomers, setHasMoreCustomers] = useState(false);

    const requestIdRef = useRef(0);
    const loadingMoreRef = useRef(false);

    // Fetch customer data
    const fetchCustomers = async (
        page: number,
        searchKey: string,
        append = false,
    ) => {
        const requestId = ++requestIdRef.current;

        try {
            setLoadingCustomers(true);
            setCustomerError("");

            const response = await customerService.getLookup(2,{
                page,
                searchKey: searchKey.trim() || undefined,
            });

            // Ignore outdated requests
            if (requestId !== requestIdRef.current) return;

            if (!response.success) {
                throw new Error(
                    response.message || "Gagal memuat customer.",
                );
            }

            const items = response.data ?? [];

            setCustomers((prev) => {
                if (!append) return items;

                const existingIds = new Set(
                    prev.map((item) => item.id),
                );

                const newItems = items.filter(
                    (item) => !existingIds.has(item.id),
                );

                return [...prev, ...newItems];
            });

            setCustomerPage(page);
            setHasMoreCustomers(items.length === 10);
        } catch (error) {
            if (requestId !== requestIdRef.current) return;

            setCustomerError(
                error instanceof Error
                    ? error.message
                    : "Gagal memuat customer.",
            );
        } finally {
            if (requestId === requestIdRef.current) {
                setLoadingCustomers(false);
                loadingMoreRef.current = false;
            }
        }
    };

    // Initial load and server-side search
    useEffect(() => {
        const timeout = setTimeout(() => {
            setCustomerPage(1);
            setHasMoreCustomers(false);
            fetchCustomers(1, customerSearch);
        }, 400);

        const requestId = requestIdRef.current;

        return () => {
            clearTimeout(timeout);
            requestIdRef.current = requestId + 1;
        };
    }, [customerSearch]);

    // Load next page
    const handleLoadMoreCustomers = () => {
        if (
            loadingCustomers ||
            loadingMoreRef.current ||
            !hasMoreCustomers
        ) {
            return;
        }

        loadingMoreRef.current = true;

        fetchCustomers(
            customerPage + 1,
            customerSearch,
            true,
        );
    };

    const customerOptions = [
        ...(selectedCustomer &&
            !customers.some((item) => item.id === selectedCustomer.id)
            ? [selectedCustomer]
            : []),
        ...customers,
    ].map((item) => ({
        value: String(item.id),
        label: item.custName,
        description: item.custCode,
    }));

    // Change customer mode
    const handleModeChange = (mode: CustomerMode) => {
        if (mode === customerMode) return;

        onCustomerModeChange(mode);

        if (mode === "new") {
            onSelectedCustomerChange(null);
            clearError("customerId");
        } else {
            clearError("custName");
            clearError("email");
            clearError("phone");
            clearError("cityId");
        }
    };

    // Select existing customer
    const handleCustomerChange = (selected: string | null) => {
        const customer = customers.find(
            (item) => String(item.id) === selected,
        ) ?? (
                selectedCustomer &&
                    String(selectedCustomer.id) === selected
                    ? selectedCustomer
                    : null
            );

        onSelectedCustomerChange(customer);

        if (customer) {
            clearError("customerId");
        }
    };

    return (
        <div className="rounded-lg border bg-card p-5 space-y-4">
            <div>
                <h3 className="font-semibold">Customer Information</h3>
            </div>

            {/* Customer Type */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={() => handleModeChange("existing")}
                    disabled={isSubmitting}
                    className={`rounded-lg border p-3 text-left transition-colors ${customerMode === "existing"
                            ? "border-primary bg-primary/5"
                            : "hover:bg-muted/50"
                        }`}
                >
                    <div className="font-medium">Existing Customer</div>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Select registered customer
                    </p>
                </button>

                <button
                    type="button"
                    onClick={() => handleModeChange("new")}
                    disabled={isSubmitting}
                    className={`rounded-lg border p-3 text-left transition-colors ${customerMode === "new"
                            ? "border-primary bg-primary/5"
                            : "hover:bg-muted/50"
                        }`}
                >
                    <div className="font-medium">New Customer</div>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Enter new customer details
                    </p>
                </button>
            </div>

            {/* Existing Customer */}
            {customerMode === "existing" ? (
                <div className="space-y-3">
                    <FormSelect
                        label="Customer"
                        placeholder="Pilih customer"
                        searchPlaceholder="Cari customer..."
                        searchable
                        options={customerOptions}
                        value={
                            selectedCustomer
                                ? String(selectedCustomer.id)
                                : ""
                        }
                        onValueChange={handleCustomerChange}
                        onSearchChange={setCustomerSearch}
                        onLoadMore={handleLoadMoreCustomers}
                        loading={loadingCustomers}
                        error={errors?.customerId || customerError}
                        disabled={isSubmitting}
                        required
                    />

                    {selectedCustomer && (
                        <div className="rounded-lg border bg-muted/30 p-4">
                            <div className="mb-3 font-medium">
                                Customer Details
                            </div>

                            <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                                <div>
                                    <p className="text-muted-foreground">
                                        Customer Code
                                    </p>
                                    <p className="font-medium">
                                        {selectedCustomer.custCode}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-muted-foreground">
                                        Customer Type
                                    </p>
                                    <p className="font-medium">
                                        {selectedCustomer.custTypeName}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-muted-foreground">
                                        Email
                                    </p>
                                    <p className="font-medium">
                                        {selectedCustomer.email || "-"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-muted-foreground">
                                        Phone
                                    </p>
                                    <p className="font-medium">
                                        {selectedCustomer.phone || "-"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <NewCustomerForm
                    cities={cities}
                    value={newCustomer}
                    onChange={onNewCustomerChange}
                    isSubmitting={isSubmitting}
                    errors={errors}
                    clearError={clearError}
                />
            )}

            <div className="space-y-4 border-t pt-4">
                <div>
                    <h4 className="text-sm font-semibold">
                        Customer Attendance
                    </h4>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Apakah customer ikut saat proses inspeksi?
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => onCustPresentChange(true)}
                        disabled={isSubmitting}
                        className={`rounded-lg border p-3 text-left transition-colors ${custPresent
                                ? "border-primary bg-primary/5"
                                : "hover:bg-muted/50"
                            }`}
                    >
                        <div className="text-sm font-medium">Ikut</div>
                    </button>

                    <button
                        type="button"
                        onClick={() => onCustPresentChange(false)}
                        disabled={isSubmitting}
                        className={`rounded-lg border p-3 text-left transition-colors ${!custPresent
                                ? "border-primary bg-primary/5"
                                : "hover:bg-muted/50"
                            }`}
                    >
                        <div className="text-sm font-medium">Tidak Ikut</div>
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormInput
                        label="Nama PIC"
                        placeholder="Masukkan nama PIC"
                        className="h-9"
                        value={picName}
                        onChange={(e) => onPicNameChange(e.target.value)}
                        disabled={isSubmitting}
                    />

                    <PhoneInput
                        label="Phone PIC"
                        value={picPhone}
                        onChange={onPicPhoneChange}
                        disabled={isSubmitting}
                    />
                </div>
            </div>
        </div>
    );
}
