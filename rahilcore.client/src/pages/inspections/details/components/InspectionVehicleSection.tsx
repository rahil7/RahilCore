import { CarFront } from "lucide-react";

interface InspectionVehicleSectionProps {
    vehicle: {
        plateNo: string | null;
        brand: string | null;
        model: string | null;
        variant: string | null;
        year: number | null;
        exteriorColor: string | null;
    };
}

export default function InspectionVehicleSection({
    vehicle,
}: InspectionVehicleSectionProps) {
    const vehicleName = [vehicle.brand, vehicle.model]
        .filter(Boolean)
        .join(" ");

    const vehicleDescription = [
        vehicleName,
        vehicle.variant,
    ]
        .filter(Boolean)
        .join(" · ");

    return (
        <div className="rounded-lg border bg-card p-4 shadow-sm space-y-4">
            <div>
                <h3 className="font-semibold">Vehicle Information</h3>
                <p className="text-xs text-muted-foreground mt-1">
                    Inspected vehicle
                </p>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <CarFront className="h-6 w-6 text-muted-foreground" />
                </div>

                <div className="min-w-0 space-y-1">
                    <p className="font-semibold">
                        {vehicle.plateNo || "—"}
                    </p>

                    <p className="text-sm font-medium truncate">
                        {vehicleDescription || "—"}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t pt-3 sm:grid-cols-3">
                <VehicleField label="Year" value={vehicle.year?.toString()} />
                <VehicleField label="Exterior Color" value={vehicle.exteriorColor} />
            </div>
        </div>
    );
}

function VehicleField({
    label,
    value,
}: {
    label: string;
    value: string | undefined | null;
}) {
    return (
        <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-medium">{value || "—"}</p>
        </div>
    );
}