import { useId } from "react";
import { Input } from "../ui/input";
import { FormLabel } from "./FormLabel";

interface FormInputProps extends React.ComponentProps<typeof Input> {
    label: string;
    error?: string;
    info?: string;
}

export function FormInput({
    label,
    error,
    info,
    id,
    ...props
}: FormInputProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-1.5">
                <FormLabel
                    label={label}
                    htmlFor={inputId}
                    info={info}
                    required={props.required}
                />
            </div>

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