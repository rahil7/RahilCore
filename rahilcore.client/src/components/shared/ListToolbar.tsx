
import type {
    FilterOption,
    QueryFieldOption,
    StatusFilterOption,
} from "../../types/common";

interface ListToolbarProps {
    searchFields: QueryFieldOption[];
    sortFields: QueryFieldOption[];
    statuses: StatusFilterOption[];
    cities: FilterOption[];
    customerTypes: FilterOption[];

    searchBy: string;
    searchKey: string;
    sortBy: string;
    sortDirection: "asc" | "desc";
    status: boolean[];
    cityIds: number[];
    custTypeIds: number[];

    onSearchByChange: (value: string) => void;
    onSearchKeyChange: (value: string) => void;
    onSortByChange: (value: string) => void;
    onSortDirectionChange: (value: "asc" | "desc") => void;
    onStatusChange: (value: boolean[]) => void;
    onCityIdsChange: (value: number[]) => void;
    onCustTypeIdsChange: (value: number[]) => void;

    onApply: () => void;
    onReset: () => void;
    isLoading?: boolean;
}

// function getSelectedNumbers(select: HTMLSelectElement): number[] {
//     return Array.from(select.selectedOptions)
//         .map((option) => Number(option.value))
//         .filter((value) => Number.isFinite(value) && value > 0);
// }

interface MultiSelectProps {
    label: string;
    values: number[] | boolean[];
    options: { value: string; label: string }[];
    onChange: (values: number[] | boolean[]) => void;
}

function MultiSelect({
    label,
    values,
    options,
    onChange,
}: MultiSelectProps) {
    return (
        <label className="flex min-w-0 flex-col gap-1.5 text-sm">
            <span className="font-medium text-foreground">{label}</span>
            <select
                multiple
                value={values.map(String)}
                onChange={(event) => {
                    const selected = Array.from(event.target.selectedOptions)
                        .map((option) => option.value);

                    if (label === "Status") {
                        onChange(
                            selected.map((value) => value === "true"),
                        );
                    } else {
                        onChange(
                            selected.map(Number).filter((value) => value > 0),
                        );
                    }
                }}
                className="h-[76px] w-full rounded-md border bg-background px-2 py-1.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <span className="text-xs text-muted-foreground">
                Gunakan Ctrl atau Cmd untuk memilih beberapa opsi.
            </span>
        </label>
    );
}

export default function ListToolbar({
    searchFields,
    sortFields,
    statuses,
    cities,
    customerTypes,
    searchBy,
    searchKey,
    sortBy,
    sortDirection,
    status,
    cityIds,
    custTypeIds,
    onSearchByChange,
    onSearchKeyChange,
    onSortByChange,
    onSortDirectionChange,
    onStatusChange,
    onCityIdsChange,
    onCustTypeIdsChange,
    onApply,
    onReset,
    isLoading = false,
}: ListToolbarProps) {
    return (
        <section className="space-y-4 rounded-lg border bg-card p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium">Cari berdasarkan</span>
                    <select
                        value={searchBy}
                        onChange={(event) => onSearchByChange(event.target.value)}
                        className="h-10 rounded-md border bg-background px-3 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        {searchFields.map((field) => (
                            <option key={field.value} value={field.value}>
                                {field.label}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium">Kata kunci</span>
                    <input
                        value={searchKey}
                        onChange={(event) => onSearchKeyChange(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") onApply();
                        }}
                        placeholder="Masukkan kata kunci..."
                        className="h-10 rounded-md border bg-background px-3 outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                    />
                </label>

                <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium">Urutkan berdasarkan</span>
                    <select
                        value={sortBy}
                        onChange={(event) => onSortByChange(event.target.value)}
                        className="h-10 rounded-md border bg-background px-3 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        {sortFields.map((field) => (
                            <option key={field.value} value={field.value}>
                                {field.label}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium">Arah sorting</span>
                    <select
                        value={sortDirection}
                        onChange={(event) =>
                            onSortDirectionChange(event.target.value as "asc" | "desc")
                        }
                        className="h-10 rounded-md border bg-background px-3 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <option value="asc">Ascending (A–Z)</option>
                        <option value="desc">Descending (Z–A)</option>
                    </select>
                </label>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <MultiSelect
                    label="Status"
                    values={status}
                    options={statuses.map((item) => ({
                        value: String(item.value),
                        label: item.label,
                    }))}
                    onChange={(value) => onStatusChange(value as boolean[])}
                />

                <MultiSelect
                    label="Customer Type"
                    values={custTypeIds}
                    options={customerTypes.map((item) => ({
                        value: String(item.id),
                        label: item.name,
                    }))}
                    onChange={(value) => onCustTypeIdsChange(value as number[])}
                />

                <MultiSelect
                    label="City"
                    values={cityIds}
                    options={cities.map((item) => ({
                        value: String(item.id),
                        label: item.name,
                    }))}
                    onChange={(value) => onCityIdsChange(value as number[])}
                />
            </div>

            <div className="flex flex-wrap justify-end gap-2 border-t pt-3">
                <button
                    type="button"
                    onClick={onReset}
                    disabled={isLoading}
                    className="h-9 rounded-md border px-4 text-sm font-medium hover:bg-muted disabled:opacity-50"
                >
                    Reset
                </button>
                <button
                    type="button"
                    onClick={onApply}
                    disabled={isLoading}
                    className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
                >
                    {isLoading ? "Memuat..." : "Terapkan"}
                </button>
            </div>
        </section>
    );
}
