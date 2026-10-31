import { useState } from "react";
import { Checkbox } from "../../../components/ui/checkbox";
import { Separator } from "../../../components/ui/separator";
import { Search } from "lucide-react";
import { Input } from "../../../components/ui/input";

import CityFilterList from "./CityFilterList";

import type {
    CustomerFilterOptions
} from "../../../types/customer";

export interface CustomerFilters {
    custTypeIds: number[];
    cityIds: number[];
    status: boolean[];
}

interface CustomerFilterContentProps {
    options: CustomerFilterOptions;
    draftFilters: CustomerFilters;
    onChange: (filters: CustomerFilters) => void;
}

export default function CustomerFilterContent({
    options,
    draftFilters,
    onChange,
}: CustomerFilterContentProps) {
    const toggleCustomerType = (id: number, checked: boolean) => {
        onChange({
            ...draftFilters,
            custTypeIds: checked
                ? [...draftFilters.custTypeIds, id]
                : draftFilters.custTypeIds.filter((item) => item !== id),
        });
    };

    function toggleStatus(status: boolean, checked: boolean) {
        onChange({
            ...draftFilters,
            status: checked
                ? [...draftFilters.status, status]
                : draftFilters.status.filter((item) => item !== status),
        });
    }

    function toggleCity(id: number, checked: boolean) {
        onChange({
            ...draftFilters,
            cityIds: checked
                ? [...draftFilters.cityIds, id]
                : draftFilters.cityIds.filter((item) => item !== id),
        });
    }

    const [citySearch, setCitySearch] = useState("");

    const filteredCities = options.cities.filter((city) =>
        city.name
            .toLowerCase()
            .includes(citySearch.trim().toLowerCase())
    );

    const allCitiesSelected =
        filteredCities.length > 0 &&
        filteredCities.every((city) =>
            draftFilters.cityIds.includes(city.id)
        );

    function toggleAllCities() {
        const visibleCityIds = filteredCities.map((city) => city.id);

        onChange({
            ...draftFilters,
            cityIds: allCitiesSelected
                ? draftFilters.cityIds.filter(
                    (id) => !visibleCityIds.includes(id)
                )
                : [
                    ...new Set([
                        ...draftFilters.cityIds,
                        ...visibleCityIds,
                    ]),
                ],
        });
    }

    return (
        <div className="space-y-2">
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
                                checked={draftFilters.custTypeIds.includes(item.id)}
                                onCheckedChange={(checked) =>
                                    toggleCustomerType(item.id, checked === true)
                                }
                            />

                            <span>{item.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            <Separator className="my-2 bg-border" />

            {/* Customer Status */}
            <div className="space-y-3">
                <h3 className="text-sm font-medium">Status</h3>

                <div className="space-y-3">
                    {options.statuses.map((item) => (
                        <label
                            key={String(item.value)}
                            className="flex cursor-pointer items-center gap-3 text-sm"
                        >
                            <Checkbox
                                checked={draftFilters.status.includes(item.value)}
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

            {/* Cities */}
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

                    {options.cities.length > 0 ? (
                        <CityFilterList
                            cities={filteredCities}
                            selectedIds={draftFilters.cityIds}
                            onChange={toggleCity}
                        />
                    ) : (
                        <p className="py-3 text-center text-sm text-muted-foreground">
                            No cities found.
                        </p>
                    )}

                    {/* Bottom fade */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-3 bg-gradient-to-t from-background to-transparent" />
                </div>
            </div>
        </div>
    );
}
