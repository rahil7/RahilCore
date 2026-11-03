import { useId } from "react";
import { Input } from "../ui/input";

interface PhoneInputProps
    extends Omit<
        React.ComponentProps<typeof Input>,
        "value" | "onChange" | "type"
    > {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

const PHONE_PREFIX = "628";

export function PhoneInput({
    label,
    value,
    onChange,
    error,
    id,
    ...props
}: PhoneInputProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const normalizedValue = value.replace(/\D/g, "");

    const inputValue = normalizedValue.startsWith(PHONE_PREFIX)
        ? normalizedValue.slice(PHONE_PREFIX.length)
        : normalizedValue;

    function handleChange(rawValue: string) {
        const digits = rawValue.replace(/\D/g, "");

        // Menghindari prefix 628 terduplikasi jika user paste nomor lengkap.
        const phoneNumber = digits.startsWith(PHONE_PREFIX)
            ? digits.slice(PHONE_PREFIX.length)
            : digits;

        onChange(phoneNumber ? `${PHONE_PREFIX}${phoneNumber}` : "");
    }

    return (
        <div className="space-y-2">
            <label
                htmlFor={inputId}
                className="mb-2 block text-sm font-medium"
            >
                {label}
            </label>

            <div className="flex w-full">
                <div className="flex h-9 min-w-[60px] shrink-0 items-center justify-center rounded-l-lg border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                    628
                </div>

                <Input
                    {...props}
                    id={inputId}
                    type="tel"
                    inputMode="numeric"
                    value={inputValue}
                    onChange={(event) => handleChange(event.target.value)}
                    placeholder="8123456789"
                    className="h-9 min-w-0 flex-1 rounded-l-none"
                    aria-invalid={!!error}
                />
            </div>

            {error && (
                <p className="text-xs text-destructive">
                    {error}
                </p>
            )}
        </div>
    );
}