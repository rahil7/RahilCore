import {
    CarFront,
    CalendarDays,
    Palette,
    Fingerprint,
    Cog,
    Gauge,
    CalendarClock,
    UserRoundCheck,
    Pencil,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import type { InspectionVehicle } from "../../../../types/inspection";
import { Button } from "../../../../components/ui/button";

interface InspectionVehicleSectionProps {
    vehicle: InspectionVehicle;
}

function formatDate(value: string | null) {
    if (!value) return "—";

    return format(parseISO(value), "dd MMM yyyy");
}

function formatNumber(value: number | null) {
    if (value === null) return "—";

    return new Intl.NumberFormat("id-ID").format(value);
}

export default function InspectionVehicleSection({
    vehicle,
}: InspectionVehicleSectionProps) {
    const vehicleName = [vehicle.brand, vehicle.model]
        .filter(Boolean)
        .join(" ");

    const vehicleDescription = [vehicleName, vehicle.variant]
        .filter(Boolean)
        .join(" · ");

    const items = [
        {
            label: "Year of Manufacture",
            value: vehicle.yearOfManufacture?.toString() ?? "—",
            icon: CalendarDays,
        },
        {
            label: "Exterior Color",
            value: vehicle.exteriorColor || "—",
            icon: Palette,
        },
        {
            label: "VIN",
            value: vehicle.vin || "—",
            icon: Fingerprint,
        },
        {
            label: "Engine No.",
            value: vehicle.engineNo || "—",
            icon: Cog,
        },
        {
            label: "Odometer",
            value: vehicle.odometer !== null
                ? `${formatNumber(vehicle.odometer)} km`
                : "—",
            icon: Gauge,
        },
        {
            label: "Tax Expiry Date",
            value: formatDate(vehicle.taxExpiryDate),
            icon: CalendarClock,
        },
        {
            label: "First Ownership",
            value:
                vehicle.firstOwnership === null
                    ? "—"
                    : vehicle.firstOwnership
                        ? "Yes"
                        : "No",
            icon: UserRoundCheck,
        },
    ];

    return (
        <section className="rounded-xl border bg-card p-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="font-semibold">Vehicle Information</h3>

                <Button variant="outline" size="sm">
                    <Pencil className="h-4 w-4" />
                    Edit
                </Button>
            </div>

            {/* Vehicle Identity */}
            <div className="flex items-center gap-3 pt-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <CarFront className="h-6 w-6 text-muted-foreground" />
                </div>

                <div className="min-w-0 space-y-1">
                    <p className="font-semibold">
                        {vehicle.plateNo || "—"}
                    </p>

                    <p className="break-words text-sm text-muted-foreground">
                        {vehicleDescription || "—"}
                    </p>
                </div>
            </div>

            {/* Vehicle Details */}
            <div className="grid gap-x-8 gap-y-5 border-t mt-5 pt-5 sm:grid-cols-2">
                {items.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.label}
                            className="min-w-0 space-y-1.5"
                        >
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Icon className="h-4 w-4 shrink-0" />
                                <span className="text-sm">
                                    {item.label}
                                </span>
                            </div>

                            <p className="break-words text-sm font-medium">
                                {item.value}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}