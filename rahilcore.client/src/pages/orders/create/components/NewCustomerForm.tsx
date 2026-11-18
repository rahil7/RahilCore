
import type { FilterOption } from "../../../../types/common";
import { FormInput } from "../../../../components/common/FormInput";
import { FormSelect } from "../../../../components/common/FormSelect";
import { PhoneInput } from "../../../../components/common/PhoneInput";
import { FormTextarea } from "../../../../components/common/FormTextarea";
import type { CreateOrderErrors } from "../../../../types/order";

export interface NewOrderCustomer {
    custName: string;
    email: string;
    phone: string;
    cityId: number;
    address: string;
}

interface NewCustomerFormProps {
    cities: FilterOption[];
    value: NewOrderCustomer;
    errors?: CreateOrderErrors;
    onChange: (value: NewOrderCustomer) => void;
    clearError: (field: keyof CreateOrderErrors) => void;
    isSubmitting?: boolean;
}

export default function NewCustomerForm({
    cities,
    value,
    onChange,
    errors = {},
    clearError,
    isSubmitting = false,
}: NewCustomerFormProps) {
    const updateField = <K extends keyof NewOrderCustomer>(
        field: K,
        fieldValue: NewOrderCustomer[K],
    ) => {
        onChange({
            ...value,
            [field]: fieldValue,
        });
    };

    const cityOptions = cities.map((item) => ({
        value: String(item.id),
        label: item.name,
    }));

    return (
        <div className="space-y-5">
            {/* Customer Name */}
            <FormInput
                label="Nama Customer"
                placeholder="Masukkan nama customer"
                className="h-9"
                value={value.custName}
                onChange={(e) => {
                    updateField("custName", e.target.value);
                    clearError("custName");
                }}
                disabled={isSubmitting}
                error={errors?.custName}
                required
            />

            {/* Email & Phone */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput
                    label="Email"
                    type="email"
                    className="h-9"
                    placeholder="name@example.com"
                    value={value?.email}
                    onChange={(e) => {
                        updateField("email", e.target.value)
                        clearError("email");
                    }}
                    disabled={isSubmitting}
                />

                <PhoneInput
                    label="Phone"
                    value={value?.phone}
                    className="h-9"
                    onChange={(phone) => {
                        updateField("phone", phone);
                        clearError("phone");
                    }}
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
                error={errors?.cityId}
                value={value.cityId ? String(value.cityId) : null}
                onValueChange={(selected) => {
                    updateField("cityId", Number(selected) || 0);
                    clearError("cityId");
                }}
                disabled={isSubmitting}
            />

            {/* Address */}
            <FormTextarea
                label="Alamat"
                placeholder="Masukkan alamat customer"
                value={value?.address}
                onChange={(e) => {
                    updateField("address", e.target.value);
                }}
                rows={3}
                disabled={isSubmitting}
            />
        </div>
    );
}
