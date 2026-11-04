import { useId } from "react";
import { Textarea } from "../ui/textarea";
import { FormLabel } from "./FormLabel";

interface FormTextareaProps
    extends React.ComponentProps<typeof Textarea> {
    label: string;
    error?: string;
    info?: string;
}

export function FormTextarea({
    label,
    info,
    error,
    id,
    required = false,
    ...props
}: FormTextareaProps) {
    const generatedId = useId();
    const textareaId = id ?? generatedId;

    return (
        <div className="space-y-2">
            <FormLabel
                label={label}
                htmlFor={textareaId}
                info={info}
                required={required}
            />

            <Textarea
                id={textareaId}
                aria-invalid={!!error}
                required={required}
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