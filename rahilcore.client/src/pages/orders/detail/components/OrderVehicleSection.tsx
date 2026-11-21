import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import type { OrderVehicle } from "../../../../types/order";
import { Button } from "../../../../components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../../../../components/ui/alert-dialog";

interface OrderVehicleSectionProps {
    vehicles: OrderVehicle[];
    canDeleteVehicle: (vehicle: OrderVehicle) => boolean;
    onDeleteVehicle: (vehicleId: number) => Promise<void>;
}

export default function OrderVehicleSection({
    vehicles,
    canDeleteVehicle,
    onDeleteVehicle,
}: OrderVehicleSectionProps) {
    const [selectedVehicle, setSelectedVehicle] =
        useState<OrderVehicle | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const displayValue = (value: string | number | null | undefined) =>
        value !== null && value !== undefined && value !== "" && value !== 0
            ? value
            : "—";

    const handleDeleteClick = (vehicle: OrderVehicle) => {
        setSelectedVehicle(vehicle);
        setDeleteError(null);
    };

    const handleConfirmDelete = async () => {
        if (!selectedVehicle || isDeleting) return;

        setIsDeleting(true);
        setDeleteError(null);

        try {
            await onDeleteVehicle(selectedVehicle.vehicleId);
            setSelectedVehicle(null);
        } catch {
            setDeleteError("Failed to remove vehicle. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDialogChange = (open: boolean) => {
        if (!open && !isDeleting) {
            setSelectedVehicle(null);
            setDeleteError(null);
        }
    };

    return (
        <>
            <section className="rounded-xl border bg-card p-5">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold">
                        Informasi Kendaraan (Unit)
                    </h3>

                    <span className="text-sm text-muted-foreground">
                        {vehicles.length}{" "}
                        {vehicles.length === 1 ? "Unit" : "Units"}
                    </span>
                </div>

                {vehicles.length > 0 ? (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden overflow-auto md:block">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left">
                                        {[
                                            "No.",
                                            "Plate No.",
                                            "Brand",
                                            "Model",
                                            "Variant",
                                            "Year",
                                            "Exterior Color",
                                            "Action",
                                        ].map((header) => (
                                            <th
                                                key={header}
                                                className={`sticky top-0 z-20 whitespace-nowrap border-b bg-muted px-3 py-3 font-medium text-muted-foreground ${header === "Action" ? "w-[80px]" : ""
                                                    }`}
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {vehicles.map((vehicle, index) => (
                                        <tr
                                            key={vehicle.vehicleId}
                                            className="border-b last:border-0"
                                        >
                                            <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">
                                                {index + 1}
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-3 font-medium">
                                                {displayValue(vehicle.plateNo)}
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-3">
                                                {displayValue(vehicle.brand)}
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-3">
                                                {displayValue(vehicle.model)}
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-3">
                                                {displayValue(vehicle.variant)}
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-3">
                                                {displayValue(
                                                    vehicle.yearOfManufacture
                                                )}
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-3">
                                                {displayValue(
                                                    vehicle.exteriorColor
                                                )}
                                            </td>

                                            <td className="w-[80px] px-3 py-2 text-center">
                                                {canDeleteVehicle(vehicle) && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                        aria-label={`Remove ${ vehicle.plateNo } `}
                                                        onClick={() =>
                                                            handleDeleteClick(
                                                                vehicle
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="space-y-3 md:hidden">
                            {vehicles.map((vehicle, index) => (
                                <div
                                    key={vehicle.vehicleId}
                                    className="rounded-lg border p-4"
                                >
                                    {/* Plate & Action */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-xs text-muted-foreground">
                                                Unit {index + 1}
                                            </p>

                                            <p className="mt-1 break-words font-semibold">
                                                {displayValue(vehicle.plateNo)}
                                            </p>
                                        </div>

                                        {canDeleteVehicle(vehicle) && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                                                aria-label={`Remove ${ vehicle.plateNo } `}
                                                onClick={() =>
                                                    handleDeleteClick(vehicle)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>

                                    {/* Vehicle Description */}
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {displayValue(vehicle.brand)}
                                        {" · "}
                                        {displayValue(vehicle.model)}
                                        {" · "}
                                        {displayValue(vehicle.variant)}
                                    </p>

                                    {/* Additional Details */}
                                    <div className="mt-3 grid grid-cols-2 gap-3 border-t pt-3">
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Year
                                            </p>
                                            <p className="mt-1 text-sm font-medium">
                                                {displayValue(
                                                    vehicle.yearOfManufacture
                                                )}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Exterior Color
                                            </p>
                                            <p className="mt-1 text-sm font-medium">
                                                {displayValue(
                                                    vehicle.exteriorColor
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="rounded-lg border border-dashed px-3 py-8 text-center text-sm text-muted-foreground">
                        No vehicle information available.
                    </div>
                )}
            </section>

            {/* Delete Confirmation */}
            <AlertDialog
                open={!!selectedVehicle}
                onOpenChange={handleDialogChange}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Remove Vehicle?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            Are you sure you want to remove vehicle{" "}
                            <span className="font-medium text-foreground">
                                {selectedVehicle?.plateNo}
                            </span>{" "}
                            from this order? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    {deleteError && (
                        <p className="text-sm text-destructive">
                            {deleteError}
                        </p>
                    )}

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            disabled={isDeleting}
                            onClick={(event) => {
                                event.preventDefault();
                                void handleConfirmDelete();
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {isDeleting ? "Removing..." : "Remove"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}