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

export function CustomerForm({
    mode,
    filterOptions,
    customer,
    onSubmit,
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

    async function handleSubmit(event: Parameters<NonNullable<React.ComponentProps<"form">["onSubmit"]>>[0]) {
        event.preventDefault();

        if (isEdit) {
            const data: UpdateCustomerRequest = {
                custName,
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
        <form id="customer-form" onSubmit={handleSubmit} className="space-y-5">
            {/* Customer Type & Code */}
            {!isEdit && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormSelect
                        label="Tipe Customer"
                        placeholder="Pilih tipe customer"
                        options={customerTypeOptions}
                        value={custTypeId}
                        onValueChange={setCustTypeId}
                    />

                    <FormInput
                        label="Customer Code"
                        placeholder="Masukkan customer code"
                        value={custCode}
                        onChange={(e) => setCustCode(e.target.value)}
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
                required
            />

            {/* Email & Phone */}
            {!isEdit && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormInput
                        label="Email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <PhoneInput
                        label="Nomor Telepon"
                        value={phone}
                        onChange={setPhone}
                    />
                </div>
            )}

            {/* City */}
            <FormSelect
                label="Kota"
                placeholder="Pilih kota"
                searchPlaceholder="Cari kota..."
                searchable
                options={cityOptions}
                value={cityId}
                onValueChange={setCityId}
            />

            {/* Address */}
            <FormTextarea
                label="Alamat"
                placeholder="Masukkan alamat customer"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
            />


            {/* Note */}
            <FormTextarea
                label="Catatan"
                placeholder="Masukkan catatan"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                required
            />
        </form>
    );
}