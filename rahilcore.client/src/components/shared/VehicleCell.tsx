interface VehicleCellProps {
    plateNo: string | null;
    brand: string | null;
    model: string | null;
    variant: string | null;
}

export default function VehicleCell({
    plateNo,
    brand,
    model,
    variant,
}: VehicleCellProps) {
    const vehicleName = [brand, model].filter(Boolean).join(" · ");
    const vehicleDetail = [vehicleName, variant].filter(Boolean).join(" · ");

    return (
        <div className="flex min-w-0 flex-col gap-1">
            <span className="font-medium text-foreground">
                {plateNo || "—"}
            </span>

            <span
                className="truncate text-xs text-muted-foreground"
                title={vehicleDetail || undefined}
            >
                {vehicleDetail || "—"}
            </span>
        </div>
    );
}