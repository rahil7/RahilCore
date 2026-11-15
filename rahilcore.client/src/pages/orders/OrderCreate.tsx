import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { PageDetailHeader } from "../../components/layout/PageDetailHeader";
import { orderService } from "../../services/order-service";
import type {
    OrderCreateOptions,
    CreateOrderVehicleRequest,
    CreateOrderCustomerRequest,
    CreateOrderErrors,
} from "../../types/order";
import VehicleSection from "./components/VehicleSection";
import CustomerSection from "./components/CustomerSection";
import type { CustomerLookupItem } from "../../types/customer";
import type { NewOrderCustomer } from "./components/NewCustomerForm";
import OrderInformationSection from "./components/OrderInformationSection";

type OrderType = "customer" | "dealer";
type CustomerMode = "existing" | "new";

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
    const navigate = useNavigate();

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
            } catch (error) {
                if (active) {
                    setOptionsError(
                        error instanceof Error
                            ? error.message
                            : "Failed to load order options."
                    );
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

    const [custPresent, setCustPresent] = useState(true);
    const [picName, setPicName] = useState("");
    const [picPhone, setPicPhone] = useState("");

    const [inspectionFormId, setInspectionFormId] = useState<number | null>(null);
    const [note, setNote] = useState("");

    const [errors, setErrors] = useState<CreateOrderErrors>({});

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const clearError = (field: keyof CreateOrderErrors) => {
        setErrors((prev) => ({
            ...prev,
            [field]: undefined,
        }));
    };

    const [customerMode, setCustomerMode] = useState<CustomerMode>("existing");

    const handleCustomerModeChange = (mode: CustomerMode) => {
        setCustomerMode(mode);

        // Reset selected customer ketika mode berubah
        setSelectedCustomer(null);

        // Clear customer validation errors
        clearError("customerId");
        clearError("custName");
        clearError("email");
        clearError("phone");
        clearError("cityId");
    };

    function validateForm(): boolean {
        const nextErrors: CreateOrderErrors = {};

        if (customerMode === "existing") {
            if (!selectedCustomer) {
                nextErrors.customerId = "Customer wajib dipilih.";
            }
        } else {
            // Validasi New Customer
            if (!newCustomer.custName.trim()) {
                nextErrors.custName = "Nama customer wajib diisi.";
            } else if (newCustomer.custName.trim().length < 3) {
                nextErrors.custName = "Nama customer minimal 3 karakter.";
            } else if (newCustomer.custName.trim().length > 150) {
                nextErrors.custName = "Nama customer maksimal 150 karakter.";
            }

            if (!newCustomer.email.trim()) {
                nextErrors.email = "Email wajib diisi.";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newCustomer.email)) {
                nextErrors.email = "Format email tidak valid.";
            } else if (newCustomer.email.length > 254) {
                nextErrors.email = "Email maksimal 254 karakter.";
            }

            const phoneDigits = newCustomer.phone.replace(/\D/g, "");

            if (!phoneDigits) {
                nextErrors.phone = "Nomor telepon wajib diisi.";
            } else if (phoneDigits.length < 8) {
                nextErrors.phone = "Nomor telepon minimal 8 digit.";
            } else if (phoneDigits.length > 13) {
                nextErrors.phone = "Nomor telepon maksimal 13 digit setelah prefix 62.";
            }

            if (!newCustomer.cityId) {
                nextErrors.cityId = "Kota wajib dipilih.";
            }
        }

        // Vehicle
        if (!vehicle.plateNo.trim()) {
            nextErrors.plateNo = "Nomor polisi wajib diisi.";
        }

        if (!vehicle.brandId) {
            nextErrors.brandId = "Brand wajib dipilih.";
        }

        if (!vehicle.modelId) {
            nextErrors.modelId = "Model wajib dipilih.";
        }

        if (!vehicle.variantId) {
            nextErrors.variantId = "Variant wajib dipilih.";
        }

        if (
            vehicle.yearOfManufacture < 1999 ||
            vehicle.yearOfManufacture > new Date().getFullYear()
        ) {
            nextErrors.yearOfManufacture = "Tahun kendaraan tidak valid.";
        }

        if (!vehicle.exteriorColorId) {
            nextErrors.exteriorColorId = "Warna kendaraan wajib dipilih.";
        }

        // Order Information
        if (!inspectionFormId) {
            nextErrors.inspectionFormId = "Inspection Form wajib dipilih.";
        }

        if (!note.trim()) {
            nextErrors.note = "Note wajib diisi.";
        } else if (note.trim().length > 500) {
            nextErrors.note = "Note maksimal 500 karakter.";
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    }

    const handleSubmit = async () => {
        if (isSubmitting) return;

        setSubmitError("");

        if (orderType !== "customer") {
            setSubmitError("Dealer order belum tersedia.");
            return;
        }

        if (!validateForm()) return;

        const payload: CreateOrderCustomerRequest = {
            customerId:
                customerMode === "existing" ? selectedCustomer!.id : null,

            inspectionFormId: inspectionFormId!,

            custName:
                customerMode === "new" ? newCustomer.custName.trim() : null,

            email:
                customerMode === "new" ? newCustomer.email.trim() : null,

            phone:
                customerMode === "new" ? newCustomer.phone.trim() : null,

            cityId:
                customerMode === "new" ? newCustomer.cityId : null,

            address:
                customerMode === "new" ? newCustomer.address.trim() || null : null,

            custPresent,
            picName: picName.trim() || null,
            picPhone: picPhone.trim() || null,
            note: note.trim() || null,

            vehicle: {
                ...vehicle,
                plateNo: vehicle.plateNo.trim(),
            },
        };

        try {
            setIsSubmitting(true);

            const response = await orderService.create(payload);

            if (!response.success) {
                throw new Error(response.message || "Gagal membuat order.");
            }

            navigate("/orders");
        } catch (error) {
            setSubmitError(
                error instanceof Error
                    ? error.message
                    : "Terjadi kesalahan saat membuat order."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

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
                                    customerMode={customerMode}
                                    onCustomerModeChange={handleCustomerModeChange}
                                    cities={createOptions.cities}
                                    selectedCustomer={selectedCustomer}
                                    onSelectedCustomerChange={setSelectedCustomer}
                                    newCustomer={newCustomer}
                                    onNewCustomerChange={setNewCustomer}
                                    custPresent={custPresent}
                                    onCustPresentChange={setCustPresent}
                                    picName={picName}
                                    onPicNameChange={setPicName}
                                    picPhone={picPhone}
                                    onPicPhoneChange={setPicPhone}
                                    errors={errors}
                                    clearError={clearError}
                                />

                            {/* VehicleSection */}
                            <VehicleSection
                                brands={createOptions.brands}
                                exteriorColors={createOptions.exteriorColors}
                                value={vehicle}
                                onChange={setVehicle}
                                errors={errors}
                                isSubmitting={isSubmitting}
                                clearError={clearError}
                            />
                        </>
                    ) : (
                        <>
                            {/* DealerSection */}
                        </>
                    )}

                    {/* OrderInformationSection */}
                    <OrderInformationSection
                        inspectionForms={createOptions.inspectionForms}
                        inspectionFormId={inspectionFormId}
                        onInspectionFormChange={setInspectionFormId}
                        note={note}
                        onNoteChange={setNote}
                        errors={errors}
                        isSubmitting={isSubmitting}
                        clearError={clearError}
                    />
                </>
            )}

            {submitError && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                    {submitError}
                </div>
            )}

            <div className="flex justify-end gap-3 pt-1">
                <button
                    type="button"
                    onClick={() => navigate("/orders")}
                    disabled={isSubmitting}
                    className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
                >
                    Cancel
                </button>

                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting || loadingOptions || orderType === "dealer"}
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting ? "Creating..." : "Create Order"}
                </button>
            </div>
        </div>
    );
}
