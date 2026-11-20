import type { OrderVehicle } from "../../../../types/order";

interface OrderVehicleSectionProps {
    vehicles: OrderVehicle[];
}

export default function OrderVehicleSection({
    vehicles,
}: OrderVehicleSectionProps) {

    const displayValue = (value: string | number | null | undefined) =>
        value && value !== 0 ? value : "—";

    return (
        <section className="rounded-xl border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold">
                    Informasi Kendaraan (Unit)
                </h3>

                <span className="text-sm text-muted-foreground">
                    {vehicles.length} {vehicles.length === 1 ? "Unit" : "Units"}
                </span>
            </div>

            <div className="max-h-[400px] overflow-auto">
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
                            ].map((header) => (
                                <th
                                    key={header}
                                    className="sticky top-0 z-20 whitespace-nowrap border-b bg-muted px-3 py-3 font-medium text-muted-foreground"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {vehicles.length > 0 ? (
                            vehicles.map((vehicle, index) => (
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
                                        {displayValue(vehicle.yearOfManufacture)}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {displayValue(vehicle.exteriorColor)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-3 py-8 text-center text-muted-foreground"
                                >
                                    No vehicle information available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}