
import { useEffect, useRef, useState } from "react";
import type { CustomerLookupItem } from "../../../../types/customer";
import { customerService } from "../../../../services/customer-service";
import { FormSelect } from "../../../../components/common/FormSelect";
import { FormInput } from "../../../../components/common/FormInput";
import type { CreateOrderErrors } from "../../../../types/order";
import { PhoneInput } from "../../../../components/common/PhoneInput";

interface DealerSectionProps {
    selectedDealer: CustomerLookupItem | null;
    onSelectedDealerChange: (dealer: CustomerLookupItem | null) => void;
    totalUnit: number | "";
    onTotalUnitChange: (value: number | "") => void;
    picName: string;
    onPicNameChange: (value: string) => void;
    picPhone: string;
    onPicPhoneChange: (value: string) => void;
    errors?: CreateOrderErrors;
    clearError: (field: keyof CreateOrderErrors) => void;
    isSubmitting?: boolean;
}

export default function DealerSection({
    selectedDealer,
    onSelectedDealerChange,
    totalUnit,
    onTotalUnitChange,
    picName,
    onPicNameChange,
    picPhone,
    onPicPhoneChange,
    errors,
    clearError,
    isSubmitting = false,
}: DealerSectionProps) {
    const [dealers, setDealers] = useState<CustomerLookupItem[]>([]);
    const [searchKey, setSearchKey] = useState("");
    const [page, setPage] = useState(1);
    const [loadingDealers, setLoadingDealers] = useState(false);
    const [dealerError, setDealerError] = useState("");
    const [hasMoreDealers, setHasMoreDealers] = useState(false);

    const requestIdRef = useRef(0);
    const loadingMoreRef = useRef(false);

    const fetchDealers = async (
        pageNumber: number,
        keyword: string,
        append = false,
    ) => {
        const requestId = ++requestIdRef.current;

        try {
            setLoadingDealers(true);
            setDealerError("");

            const response = await customerService.getLookup(1, {
                page: pageNumber,
                searchKey: keyword.trim() || undefined,
            });

            if (requestId !== requestIdRef.current) return;

            if (!response.success) {
                throw new Error(
                    response.message || "Gagal memuat Dealer.",
                );
            }

            const items = response.data ?? [];

            setDealers((prev) => {
                if (!append) return items;

                const existingIds = new Set(prev.map((item) => item.id));
                return [
                    ...prev,
                    ...items.filter((item) => !existingIds.has(item.id)),
                ];
            });

            setPage(pageNumber);
            setHasMoreDealers(items.length === 10);
        } catch (error) {
            if (requestId !== requestIdRef.current) return;

            setDealerError(
                error instanceof Error
                    ? error.message
                    : "Gagal memuat Dealer.",
            );
        } finally {
            if (requestId === requestIdRef.current) {
                setLoadingDealers(false);
                loadingMoreRef.current = false;
            }
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            setPage(1);
            setHasMoreDealers(false);
            fetchDealers(1, searchKey);
        }, 400);

        const requestId = requestIdRef.current;

        return () => {
            clearTimeout(timeout);
            requestIdRef.current = requestId + 1;
        };
    }, [searchKey]);

    const handleLoadMoreDealers = () => {
        if (
            loadingDealers ||
            loadingMoreRef.current ||
            !hasMoreDealers
        ) {
            return;
        }

        loadingMoreRef.current = true;
        fetchDealers(page + 1, searchKey, true);
    };

    const dealerOptions = [
        ...(selectedDealer &&
            !dealers.some((item) => item.id === selectedDealer.id)
            ? [selectedDealer]
            : []),
        ...dealers,
    ].map((item) => ({
        value: String(item.id),
        label: item.custName,
        description: item.custCode,
    }));

    const handleDealerChange = (selected: string | null) => {
        const dealer =
            dealers.find((item) => String(item.id) === selected) ??
            (selectedDealer &&
                String(selectedDealer.id) === selected
                ? selectedDealer
                : null);

        onSelectedDealerChange(dealer);

        if (dealer) clearError("customerId");
    };

    return (
        <div className="rounded-lg border bg-card p-5 space-y-4">
            <div>
                <h3 className="font-semibold">Showroom Information</h3>
            </div>

            {/* Dealer & Total Unit */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr]">
                <FormSelect
                    label="Showroom"
                    placeholder="Pilih showroom"
                    searchPlaceholder="Cari showroom..."
                    searchable
                    options={dealerOptions}
                    value={selectedDealer ? String(selectedDealer.id) : ""}
                    onValueChange={handleDealerChange}
                    onSearchChange={setSearchKey}
                    onLoadMore={handleLoadMoreDealers}
                    loading={loadingDealers}
                    error={errors?.customerId || dealerError}
                    disabled={isSubmitting}
                    required
                />

                <FormInput
                    label="Total Unit (Max. 15)"
                    type="number"
                    min={1}
                    max={15}
                    value={totalUnit}
                    onChange={(e) => {
                        const value = e.target.value;

                        if (value === "") {
                            onTotalUnitChange("");
                            clearError("totalUnit");
                            return;
                        }

                        const number = Number(value);

                        if (number > 15) return;

                        onTotalUnitChange(number);
                        clearError("totalUnit");
                    }}
                    error={errors?.totalUnit}
                    disabled={isSubmitting}
                    required
                />
            </div>

            {/* Dealer Details */}
            {selectedDealer && (
                <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="mb-3 font-medium">Showroom Details</div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                            <p className="text-sm text-muted-foreground">Showroom Code</p>
                            <p className="text-sm font-medium">
                                {selectedDealer.custCode}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">Customer Type</p>
                            <p className="text-sm font-medium">
                                {selectedDealer.custTypeName}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="text-sm font-medium">
                                {selectedDealer.email || "-"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">Phone</p>
                            <p className="text-sm font-medium">
                                {selectedDealer.phone || "-"}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* PIC Information */}
            <div className="space-y-4 border-t pt-4">
                <h4 className="text-sm font-semibold">PIC Information</h4>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormInput
                        label="Nama PIC"
                        placeholder="Masukkan nama PIC"
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
