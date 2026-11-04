import { useState } from "react";
import { FormInput } from "../../components/common/FormInput";
import { FormSelect } from "../../components/common/FormSelect";
import { PhoneInput } from "../../components/common/PhoneInput";
import { FormTextarea } from "../../components/common/FormTextarea";
import type {
    CustomerFilterOptions,
    CustomerDetail,
    CreateCustomerRequest,
    UpdateCustomerRequest
} from "../../types/customer";

interface CustomerFormProps {
    mode: "create" | "edit";
    filterOptions: CustomerFilterOptions;
    customer?: CustomerDetail;
    isSubmitting?: boolean;
    onSubmit: (
        data: CreateCustomerRequest | UpdateCustomerRequest
    ) => void | Promise<void>;
}

interface CustomerFormErrors {
    custTypeId?: string;
    custCode?: string;
    custName?: string;
    email?: string;
    phone?: string;
    cityId?: string;
    note?: string;
}

export function CustomerForm({
    mode,
    filterOptions,
    customer,
    onSubmit,
    isSubmitting
}: CustomerFormProps) {
    const isEdit = mode === "edit";

    const [custTypeId, setCustTypeId] = useState(
        customer ? String(customer.custTypeId) : null
    );

    const [custCode, setCustCode] = useState(
        customer?.custCode ?? ""
    );

    const [custName, setCustName] = useState(
        customer?.custName ?? ""
    );

    const [email, setEmail] = useState(
        customer?.email ?? ""
    );

    const [phone, setPhone] = useState(
        customer?.phone ?? ""
    );

    const [cityId, setCityId] = useState(
        customer?.cityId ? String(customer.cityId) : null
    );

    const [address, setAddress] = useState(
        customer?.address ?? ""
    );

    const [note, setNote] = useState("");

    const customerTypeOptions = filterOptions.customerTypes.map(
        (item) => ({
            value: String(item.id),
            label: item.name,
        })
    );

    const cityOptions = filterOptions.cities.map((item) => ({
        value: String(item.id),
        label: item.name,
    }));

    const [errors, setErrors] = useState<CustomerFormErrors>({});

    function validateForm(): boolean {
        const nextErrors: CustomerFormErrors = {};

        if (!isEdit) {
            if (!custTypeId) {
                nextErrors.custTypeId = "Tipe customer wajib dipilih.";
            }

            if (!custCode.trim()) {
                nextErrors.custCode = "Customer code wajib diisi.";
            } else if (custCode.trim().length < 3) {
                nextErrors.custCode = "Customer code minimal 3 karakter.";
            } else if (custCode.length > 30) {
                nextErrors.custCode = "Customer code maksimal 30 karakter.";
            }
        }

        if (!custName.trim()) {
            nextErrors.custName = "Nama customer wajib diisi.";
        } else if (custName.trim().length < 3) {
            nextErrors.custName = "Nama customer minimal 3 karakter.";
        } else if (custName.trim().length > 150) {
            nextErrors.custName = "Nama customer maksimal 150 karakter.";
        }

        if (!email.trim()) {
            nextErrors.email = "Email wajib diisi.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            nextErrors.email = "Format email tidak valid.";
        } else if (email.length > 254) {
            nextErrors.email = "Email maksimal 254 karakter.";
        }

        const phoneDigits = phone.replace(/\D/g, "");

        if (!phoneDigits) {
            nextErrors.phone = "Nomor telepon wajib diisi.";
        } else if (phoneDigits.length < 8) {
            nextErrors.phone = "Nomor telepon minimal 8 digit.";
        } else if (phoneDigits.length > 13) {
            nextErrors.phone = "Nomor telepon maksimal 13 digit setelah prefix 62.";
        }

        if (!isEdit && !cityId) {
            nextErrors.cityId = "Kota wajib dipilih.";
        }

        if (!note.trim()) {
            nextErrors.note = "Catatan wajib diisi.";
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    }

    async function handleSubmit(
        event: Parameters<
            NonNullable<React.ComponentProps<"form">["onSubmit"]>
        >[0]
    ) {
        event.preventDefault();

        if (!validateForm()) return;

        if (isEdit) {
            const data: UpdateCustomerRequest = {
                custName,
                email,
                phone,
                cityId: cityId ? Number(cityId) : null,
                address: address || null,
                note,
            };

            await onSubmit(data);
            return;
        }

        const data: CreateCustomerRequest = {
            custTypeId: Number(custTypeId),
            custCode: custCode.trim(),
            custName: custName.trim(),
            email: email.trim() || null,
            phone: phone || null,
            cityId: cityId ? Number(cityId) : null,
            address: address.trim() || null,
            note: note.trim(),
        };

        await onSubmit(data);
    }

    return (
        <form
            id="customer-form"
            onSubmit={handleSubmit}
            className="space-y-5"
            noValidate
        >
            {/* Customer Type & Code */}
            {!isEdit && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormSelect
                        label="Tipe Customer"
                        placeholder="Pilih tipe customer"
                        options={customerTypeOptions}
                        value={custTypeId}
                        onValueChange={setCustTypeId}
                        error={errors.custTypeId}
                        disabled={isSubmitting}
                        required
                    />

                    <FormInput
                        label="Customer Code"
                        info="Gunakan huruf A-Z, angka 0-9, dan karakter khusus / - ."
                        placeholder="Masukkan customer code"
                        value={custCode}
                        onChange={(e) => {
                            const value = e.target.value
                                .toUpperCase()
                                .replace(/[^A-Z0-9/.-]/g, "");

                            setCustCode(value);
                        }}
                        error={errors.custCode}
                        disabled={isSubmitting}
                        required
                    />
                </div>
            )}

            {/* Customer Name */}
            <FormInput
                label="Nama Customer"
                placeholder="Masukkan nama customer"
                value={custName}
                onChange={(e) => setCustName(e.target.value)}
                error={errors.custName}
                disabled={isSubmitting}
                required
            />

            {/* Email & Phone */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput
                    label="Email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                    disabled={isSubmitting}
                    required
                />

                <PhoneInput
                    label="Nomor Telepon"
                    value={phone}
                    onChange={setPhone}
                    error={errors.phone}
                    disabled={isSubmitting}
                    required
                />
            </div>

            {/* City */}
            <FormSelect
                label="Kota"
                placeholder="Pilih kota"
                searchPlaceholder="Cari kota..."
                searchable
                options={cityOptions}
                value={cityId}
                onValueChange={setCityId}
                error={errors.cityId}
                disabled={isSubmitting}
                required
            />

            {/* Address */}
            <FormTextarea
                label="Alamat"
                placeholder="Masukkan alamat customer"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                disabled={isSubmitting}
            />


            {/* Note */}
            <FormTextarea
                label="Catatan"
                placeholder="Tambahkan catatan"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                error={errors.note}
                disabled={isSubmitting}
                required
            />
        </form>
    );
}