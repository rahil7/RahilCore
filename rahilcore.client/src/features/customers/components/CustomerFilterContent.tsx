
import { useEffect, useState } from "react";
import { X } from "lucide-react";

import type {
    CustomerFilterOptions,
} from "../../../types/customer";

import { Checkbox } from "../../../components/ui/checkbox";
import { Separator } from "../../../components/ui/separator";
import { Search } from "lucide-react";
import { Input } from "../../../components/ui/input";

export interface CustomerFilters {
    custTypeIds: number[];
    cityIds: number[];
    status: boolean[];
}

interface CustomerFilterDialogProps {
    open: boolean;
    options: CustomerFilterOptions;
    appliedFilters: CustomerFilters;
    onApply: (filters: CustomerFilters) => void;
    onClose: () => void;
}

export default function CustomerFilterDialog({
    open,
    options,
    appliedFilters,
    onApply,
    onClose,
}: CustomerFilterDialogProps) {
    const [draft, setDraft] = useState<CustomerFilters>(appliedFilters);
    const [citySearch, setCitySearch] = useState("");

    useEffect(() => {
        if (!open) return;

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") onClose();
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, onClose]);

    if (!open) return null;

    const selectedCount =
        draft.custTypeIds.length +
        draft.cityIds.length +
        draft.status.length;

    function toggleCustomerType(id: number, checked: boolean) {
        setDraft((current) => ({
            ...current,
            custTypeIds: checked
                ? [...current.custTypeIds, id]
                : current.custTypeIds.filter((item) => item !== id),
        }));
    }

    function toggleStatus(status: boolean, checked: boolean) {
        setDraft((current) => ({
            ...current,
            status: checked
                ? [...current.status, status]
                : current.status.filter((item) => item !== status),
        }));
    }

    function toggleCity(id: number, checked: boolean) {
        setDraft((current) => ({
            ...current,
            cityIds: checked
                ? [...current.cityIds, id]
                : current.cityIds.filter((item) => item !== id),
        }));
    }

    function toggleAllCities() {
        setDraft((current) => ({
            ...current,
            cityIds: allCitiesSelected
                ? []
                : options.cities.map((city) => city.id),
        }));
    }

    const filteredCities = options.cities.filter((city) =>
        city.name.toLowerCase().includes(citySearch.trim().toLowerCase())
    );

    const allCitiesSelected =
        options.cities.length > 0 &&
        options.cities.every((city) => draft.cityIds.includes(city.id));

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="customer-filter-title"
                className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-xl border bg-background shadow-xl"
            >
                <header className="flex items-start justify-between border-b px-5 py-4">
                    <div>
                        <h2 id="customer-filter-title" className="text-lg font-semibold">
                            Filter Customers
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Pilih satu atau beberapa opsi filter.
                        </p>
                    </div>

                    <button
                        type="button"
                        aria-label="Tutup filter"
                        onClick={onClose}
                        className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                        <X size={18} />
                    </button>
                </header>

                <div className="space-y-5 overflow-y-auto p-5">
                    {/* Customer Type */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium">Tipe Customer</h3>

                        <div className="space-y-3">
                            {options.customerTypes.map((item) => (
                                <label
                                    key={item.id}
                                    className="flex cursor-pointer items-center gap-3 text-sm"
                                >
                                    <Checkbox
                                        checked={draft.custTypeIds.includes(item.id)}
                                        onCheckedChange={(checked) =>
                                            toggleCustomerType(item.id, checked === true)
                                        }
                                    />

                                    <span>{item.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <Separator/>

                    {/* Status */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium">Status</h3>

                        <div className="space-y-3">
                            {options.statuses.map((item) => (
                                <label
                                    key={String(item.value)}
                                    className="flex cursor-pointer items-center gap-3 text-sm"
                                >
                                    <Checkbox
                                        checked={draft.status.includes(item.value)}
                                        onCheckedChange={(checked) =>
                                            toggleStatus(item.value, checked === true)
                                        }
                                    />

                                    <span>{item.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* City */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium">Kota</h3>

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                            <Input
                                value={citySearch}
                                onChange={(event) => setCitySearch(event.target.value)}
                                placeholder="Search city..."
                                className="h-9 pl-9"
                            />
                        </div>

                        {/* Select All & City Count */}
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">
                                Showing {filteredCities.length} of {options.cities.length} cities
                            </p>

                            <button
                                type="button"
                                onClick={toggleAllCities}
                                className="text-xs font-medium text-primary hover:underline"
                            >
                                {allCitiesSelected ? "Clear All" : "Select All"}
                            </button>
                        </div>

                        {/* City List */}
                        <div className="relative overflow-hidden rounded-md border bg-background">

                            {/* Top fade */}
                            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-3 bg-gradient-to-b from-background to-transparent" />

                            {/* Scroll area */}
                            <div className="max-h-56 overflow-y-auto">
                                <div className="space-y-3 px-3 py-3">
                                    {filteredCities.length > 0 ? (
                                        filteredCities.map((item) => (
                                            <label
                                                key={item.id}
                                                className="flex cursor-pointer items-center gap-3 text-sm"
                                            >
                                                <Checkbox
                                                    checked={draft.cityIds.includes(item.id)}
                                                    onCheckedChange={(checked) =>
                                                        toggleCity(item.id, checked === true)
                                                    }
                                                />

                                                <span>{item.name}</span>
                                            </label>
                                        ))
                                    ) : (
                                        <p className="py-3 text-center text-sm text-muted-foreground">
                                            No cities found.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Bottom fade */}
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-3 bg-gradient-to-t from-background to-transparent" />

                        </div>
                    </div>
                </div>

                <footer className="flex items-center justify-between gap-3 border-t bg-muted/20 px-5 py-4">
                    <button
                        type="button"
                        onClick={() =>
                            setDraft({
                                custTypeIds: [],
                                cityIds: [],
                                status: [],
                            })
                        }
                        className="text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                        Reset pilihan
                    </button>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-9 rounded-md border px-4 text-sm font-medium hover:bg-muted"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={() => onApply(draft)}
                            className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
                        >
                            Terapkan{selectedCount > 0 ? ` (${selectedCount})` : ""}
                        </button>
                    </div>
                </footer>
            </section>
        </div>
    );
}
