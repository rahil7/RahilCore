
interface OrderVehicleItem {
    plateNo: string;
    brand: string;
    model: string;
    variant: string;
    yearOfManufacture: number;
    exteriorColor: string;
}

interface OrderVehicleSectionProps {
    vehicles: OrderVehicleItem[];
}

export default function OrderVehicleSection({
    vehicles,
}: OrderVehicleSectionProps) {
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
                            <th className="sticky top-0 z-20 whitespace-nowrap border-b bg-muted px-3 py-3 font-medium text-muted-foreground">
                                No.
                            </th>
                            <th className="sticky top-0 z-20 whitespace-nowrap border-b bg-muted px-3 py-3 font-medium text-muted-foreground">
                                Plate No.
                            </th>
                            <th className="sticky top-0 z-20 whitespace-nowrap border-b bg-muted px-3 py-3 font-medium text-muted-foreground">
                                Brand
                            </th>
                            <th className="sticky top-0 z-20 whitespace-nowrap border-b bg-muted px-3 py-3 font-medium text-muted-foreground">
                                Model
                            </th>
                            <th className="sticky top-0 z-20 whitespace-nowrap border-b bg-muted px-3 py-3 font-medium text-muted-foreground">
                                Variant
                            </th>
                            <th className="sticky top-0 z-20 whitespace-nowrap border-b bg-muted px-3 py-3 font-medium text-muted-foreground">
                                Year
                            </th>
                            <th className="sticky top-0 z-20 whitespace-nowrap border-b bg-muted px-3 py-3 font-medium text-muted-foreground">
                                Exterior Color
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehicles.length > 0 ? (
                            vehicles.map((vehicle, index) => (
                                <tr
                                    key={`${vehicle.plateNo}-${index}`}
                                    className="border-b last:border-0"
                                >
                                    <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">
                                        {index + 1}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3 font-medium">
                                        {vehicle.plateNo}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {vehicle.brand}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {vehicle.model}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {vehicle.variant}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {vehicle.yearOfManufacture}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {vehicle.exteriorColor}
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
