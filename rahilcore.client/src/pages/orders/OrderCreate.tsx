
import { useEffect, useState } from "react";
import { PageDetailHeader } from "../../components/layout/PageDetailHeader";
import { orderService } from "../../services/order-service";
import type {
    OrderCreateOptions,
    CreateOrderVehicleRequest,
} from "../../types/order";
import VehicleSection from "./components/VehicleSection";
import CustomerSection from "./components/CustomerSection";
import type { CustomerLookupItem } from "../../types/customer";
import type { NewOrderCustomer } from "./components/NewCustomerForm";

type OrderType = "customer" | "dealer";

const initialCreateOptions: OrderCreateOptions = {
    inspectionForms: [],
    cities: [],
    exteriorColors: [],
    brands: [],
};

const initialVehicle: CreateOrderVehicleRequest = {
    plateNo: "",
    brandId: 0,
    modelId: 0,
    variantId: 0,
    yearOfManufacture: new Date().getFullYear(),
    exteriorColorId: 0,
};

export default function CreateOrder() {
    const [orderType, setOrderType] = useState<OrderType>("customer");

    const [createOptions, setCreateOptions] =
        useState<OrderCreateOptions>(initialCreateOptions);

    const [vehicle, setVehicle] =
        useState<CreateOrderVehicleRequest>(initialVehicle);

    const [loadingOptions, setLoadingOptions] = useState(true);
    const [optionsError, setOptionsError] = useState("");

    useEffect(() => {
        let active = true;

        const fetchOptions = async () => {
            setLoadingOptions(true);
            setOptionsError("");

            try {
                const response = await orderService.getCreateOptions();


                if (!response.success || !response.data) {
                    throw new Error(
                        response.message || "Gagal memuat opstions create."
                    );
                }

                if (active) {
                    setCreateOptions(response.data);
                }
            } catch {
                if (active) {
                    setOptionsError("Failed to load order options.");
                }
            } finally {
                if (active) {
                    setLoadingOptions(false);
                }
            }
        };

        fetchOptions();

        return () => {
            active = false;
        };
    }, []);

    const [selectedCustomer, setSelectedCustomer] =
        useState<CustomerLookupItem | null>(null);

    const [newCustomer, setNewCustomer] = useState<NewOrderCustomer>({
        custName: "",
        email: "",
        phone: "",
        cityId: 0,
        address: "",
    });

    return (
        <div className="w-full min-w-0 space-y-4">
            <PageDetailHeader
                title="Create Order"
                backTo="/orders"
            />

            {/* Order Type */}
            <div className="rounded-lg border bg-card p-5">
                <h3 className="mb-3 font-semibold">Tipe Customer</h3>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => setOrderType("customer")}
                        className={`rounded-lg border p-4 text-left transition-colors ${orderType === "customer"
                            ? "border-primary bg-primary/5"
                            : "hover:bg-muted/50"
                            }`}
                    >
                        <div className="font-medium">Customer</div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Individual customer order
                        </p>
                    </button>

                    <button
                        type="button"
                        onClick={() => setOrderType("dealer")}
                        className={`rounded-lg border p-4 text-left transition-colors ${orderType === "dealer"
                            ? "border-primary bg-primary/5"
                            : "hover:bg-muted/50"
                            }`}
                    >
                        <div className="font-medium">Dealer</div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Bulk order from registered dealer
                        </p>
                    </button>
                </div>
            </div>

            {optionsError && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                    {optionsError}
                </div>
            )}

            {loadingOptions ? (
                <div className="rounded-lg border bg-card p-5 text-sm text-muted-foreground">
                    Loading order options...
                </div>
            ) : (
                <>
                    {/* Conditional Sections */}
                    {orderType === "customer" ? (
                        <>
                            {/* CustomerSection */}

                            <CustomerSection
                                cities={createOptions.cities}
                                selectedCustomer={selectedCustomer}
                                onSelectedCustomerChange={setSelectedCustomer}
                                newCustomer={newCustomer}
                                onNewCustomerChange={setNewCustomer}
                            />

                            {/* VehicleSection */}

                            <VehicleSection
                                brands={createOptions.brands}
                                exteriorColors={createOptions.exteriorColors}
                                value={vehicle}
                                onChange={setVehicle}
                            />
                        </>
                    ) : (
                        <>
                            {/* DealerSection */}
                        </>
                    )}

                    {/* OrderInformationSection */}
                </>
            )}
        </div>
    );
}
