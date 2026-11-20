
import type { ChangeEvent } from "react";
import { FormInput } from "./FormInput";

interface CurrencyInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    placeholder?: string;
}

function formatCurrencyInput(value: string): string {
    if (!value) return "";

    const [integerPart, decimalPart] = value.split(".");

    const formattedInteger = integerPart.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        "."
    );

    return decimalPart !== undefined
        ? `${formattedInteger},${decimalPart}`
        : formattedInteger;
}

function parseCurrencyInput(value: string): string {
    // Hapus separator ribuan dan karakter selain angka/koma
    const cleaned = value.replace(/[^\d,]/g, "");

    const commaIndex = cleaned.indexOf(",");

    if (commaIndex === -1) return cleaned;

    const integerPart = cleaned.slice(0, commaIndex);
    const decimalPart = cleaned
        .slice(commaIndex + 1)
        .replace(/,/g, "");

    return `${integerPart}.${decimalPart}`;
}

export function CurrencyInput({
    label,
    value,
    onChange,
    error,
    disabled,
    required,
    placeholder = "0",
}: CurrencyInputProps) {
    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const parsedValue = parseCurrencyInput(event.target.value);
        onChange(parsedValue);
    }

    return (
        <FormInput
            label={label}
            type="text"
            inputMode="decimal"
            value={formatCurrencyInput(value)}
            onChange={handleChange}
            error={error}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
        />
    );
}
