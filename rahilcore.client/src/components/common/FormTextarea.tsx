import { useId } from "react";
import { Textarea } from "../ui/textarea";

interface FormTextareaProps
    extends React.ComponentProps<typeof Textarea> {
    label: string;
    error?: string;
}

export function FormTextarea({
    label,
    error,
    id,
    ...props
}: FormTextareaProps) {
    const generatedId = useId();
    const textareaId = id ?? generatedId;

    return (
        <div className="space-y-2">
            <label
                htmlFor={textareaId}
                className="mb-2 block text-sm font-medium"
            >
                {label}
            </label>

            <Textarea
                id={textareaId}
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