import { useId } from "react";
import { Input } from "../ui/input";

interface FormInputProps
    extends React.ComponentProps<typeof Input> {
    label: string;
    error?: string;
}

export function FormInput({
    label,
    error,
    id,
    ...props
}: FormInputProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
        <div className="space-y-2">
            <label
                htmlFor={inputId}
                className="mb-2 block text-sm font-medium"
            >
                {label}
            </label>

            <Input
                id={inputId}
                aria-invalid={!!error}
                {...props}
            />

            {error && (
                <p className="text-xs text-destructive">
                    {error}
                </p>
            )}
        </div>
    );
}