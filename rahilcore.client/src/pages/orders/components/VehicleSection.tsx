
import { useEffect, useState } from "react";
import type { FilterOption } from "../../../types/common";
import { vehicleService } from "../../../services/vehicle-service";
import type { CreateOrderVehicleRequest } from "../../../types/order";
import { FormSelect } from "../../../components/common/FormSelect";

interface VehicleSectionProps {
    brands: FilterOption[];
    exteriorColors: FilterOption[];
    value: CreateOrderVehicleRequest;
    onChange: (value: CreateOrderVehicleRequest) => void;
    isSubmitting?: boolean;
}

export default function VehicleSection({
    brands,
    exteriorColors,
    value,
    onChange,
    isSubmitting = false,
}: VehicleSectionProps) {
    const [models, setModels] = useState<FilterOption[]>([]);
    const [variants, setVariants] = useState<FilterOption[]>([]);

    const [loadingModels, setLoadingModels] = useState(false);
    const [loadingVariants, setLoadingVariants] = useState(false);

    const [modelError, setModelError] = useState("");
    const [variantError, setVariantError] = useState("");

    // Load models when Brand changes
    useEffect(() => {
        if (!value.brandId) return;

        let active = true;

        const fetchModels = async () => {
            setLoadingModels(true);
            setModelError("");

            try {
                const response = await vehicleService.getModelLookup(
                    value.brandId,
                );

                if (active) {
                    setModels(response.data ?? []);
                }
            } catch {
                if (active) {
                    setModelError("Gagal memuat data model.");
                }
            } finally {
                if (active) {
                    setLoadingModels(false);
                }
            }
        };

        fetchModels();

        return () => {
            active = false;
        };
    }, [value.brandId]);

    // Load variants when Model changes
    useEffect(() => {
        if (!value.modelId) return;

        let active = true;

        const fetchVariants = async () => {
            setLoadingVariants(true);
            setVariantError("");

            try {
                const response = await vehicleService.getVariantLookup(
                    value.modelId,
                );

                if (active) {
                    setVariants(response.data ?? []);
                }
            } catch {
                if (active) {
                    setVariantError("Gagal memuat data variant.");
                }
            } finally {
                if (active) {
                    setLoadingVariants(false);
                }
            }
        };

        fetchVariants();

        return () => {
            active = false;
        };
    }, [value.modelId]);

    const updateField = <K extends keyof CreateOrderVehicleRequest>(
        field: K,
        fieldValue: CreateOrderVehicleRequest[K],
    ) => {
        onChange({
            ...value,
            [field]: fieldValue,
        });
    };

    const handleBrandChange = (selected: string | null) => {
        onChange({
            ...value,
            brandId: Number(selected) || 0,
            modelId: 0,
            variantId: 0,
        });

        setModels([]);
        setVariants([]);
        setModelError("");
        setVariantError("");
    };

    const handleModelChange = (selected: string | null) => {
        onChange({
            ...value,
            modelId: Number(selected) || 0,
            variantId: 0,
        });

        setVariants([]);
        setVariantError("");
    };

    const brandOptions = brands.map((item) => ({
        value: String(item.id),
        label: item.name,
    }));

    const modelOptions = models.map((item) => ({
        value: String(item.id),
        label: item.name,
    }));

    const variantOptions = variants.map((item) => ({
        value: String(item.id),
        label: item.name,
    }));

    const exteriorColorOptions = exteriorColors.map((item) => ({
        value: String(item.id),
        label: item.name,
    }));

    const inputClassName =
        "h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

    const labelClassName = "mb-1.5 block text-sm font-medium";

    return (
        <div className="rounded-lg border bg-card p-5 space-y-4">
            <div>
                <h3 className="font-semibold">Data Kendaraan</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* License Plate */}
                <div>
                    <label className={labelClassName}>
                        License Plate <span className="text-destructive">*</span>
                    </label>
                    <input
                        type="text"
                        value={value.plateNo}
                        onChange={(e) =>
                            updateField("plateNo", e.target.value)
                        }
                        placeholder="e.g. B 1234 ABC"
                        disabled={isSubmitting}
                        className={inputClassName}
                    />
                </div>

                {/* Brand */}
                <FormSelect
                    label="Brand"
                    placeholder="Pilih brand"
                    searchPlaceholder="Cari brand..."
                    searchable
                    options={brandOptions}
                    value={value.brandId ? String(value.brandId) : ""}
                    onValueChange={handleBrandChange}
                    disabled={isSubmitting}
                    required
                />

                {/* Model */}
                <FormSelect
                    label="Model"
                    placeholder={
                        loadingModels ? "Memuat model..." : "Pilih model"
                    }
                    searchPlaceholder="Cari model..."
                    searchable
                    options={modelOptions}
                    value={value.modelId ? String(value.modelId) : ""}
                    onValueChange={handleModelChange}
                    error={modelError}
                    disabled={
                        isSubmitting ||
                        !value.brandId ||
                        loadingModels
                    }
                    required
                />

                {/* Variant */}
                <FormSelect
                    label="Variant"
                    placeholder={
                        loadingVariants
                            ? "Memuat variant..."
                            : "Pilih variant"
                    }
                    searchPlaceholder="Cari variant..."
                    searchable
                    options={variantOptions}
                    value={value.variantId ? String(value.variantId) : ""}
                    onValueChange={(selected) =>
                        updateField("variantId", Number(selected) || 0)
                    }
                    error={variantError}
                    disabled={
                        isSubmitting ||
                        !value.modelId ||
                        loadingVariants
                    }
                    required
                />

                {/* Year of Manufacture */}
                <div>
                    <label className={labelClassName}>
                        Year of Manufacture{" "}
                        <span className="text-destructive">*</span>
                    </label>
                    <input
                        type="number"
                        min={1999}
                        max={9999}
                        value={value.yearOfManufacture || ""}
                        onChange={(e) =>
                            updateField(
                                "yearOfManufacture",
                                e.target.value === ""
                                    ? 0
                                    : Number(e.target.value),
                            )
                        }
                        placeholder="e.g. 2024"
                        disabled={isSubmitting}
                        className={inputClassName}
                    />
                </div>

                {/* Exterior Color */}
                <FormSelect
                    label="Exterior Color"
                    placeholder="Pilih warna kendaraan"
                    searchPlaceholder="Cari warna..."
                    searchable
                    options={exteriorColorOptions}
                    value={
                        value.exteriorColorId
                            ? String(value.exteriorColorId)
                            : ""
                    }
                    onValueChange={(selected) =>
                        updateField(
                            "exteriorColorId",
                            Number(selected) || 0,
                        )
                    }
                    disabled={isSubmitting}
                    required
                />
            </div>
        </div>
    );
}
