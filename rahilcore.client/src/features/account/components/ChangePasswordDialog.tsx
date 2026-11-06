
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../../components/ui/dialog";

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

interface ChangePasswordDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: ChangePasswordRequest) => Promise<void>;
}

interface PasswordFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

function PasswordField({
    id,
    label,
    value,
    onChange,
    disabled,
}: PasswordFieldProps) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="space-y-2">
            <label
                htmlFor={id}
                className="block text-sm font-medium"
            >
                {label}
            </label>

            <div className="relative">
                <Input
                    id={id}
                    type={isVisible ? "text" : "password"}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    disabled={disabled}
                    autoComplete="new-password"
                    className="pr-10"
                />

                <button
                    type="button"
                    tabIndex={-1}
                    aria-label={isVisible ? "Hide password" : "Show password"}
                    onClick={() => setIsVisible((current) => !current)}
                    disabled={disabled}
                    className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-50"
                >
                    {isVisible
                        ? <EyeOff size={17} />
                        : <Eye size={17} />
                    }
                </button>
            </div>
        </div>
    );
}

export function ChangePasswordDialog({
    open,
    onOpenChange,
    onSubmit,
}: ChangePasswordDialogProps) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleOpenChange = (nextOpen: boolean) => {
        if (isSubmitting) return;

        if (nextOpen) {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setError(null);
        }

        onOpenChange(nextOpen);
    };

    const handleSubmit = async (
        event: Parameters<
            NonNullable<React.ComponentProps<"form">["onSubmit"]>
        >[0]
    ) => {
        event.preventDefault();
        setError(null);

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("Semua field wajib diisi.");
            return;
        }

        if (newPassword.length < 8) {
            setError("Password baru minimal 8 karakter.");
            return;
        }

        if (currentPassword === newPassword) {
            setError("Password baru harus berbeda dari password saat ini.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Konfirmasi password tidak sesuai.");
            return;
        }

        try {
            setIsSubmitting(true);

            await onSubmit({
                currentPassword,
                newPassword,
            });

            handleOpenChange(false);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Gagal mengubah password."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={handleOpenChange}
        >
            <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                        Perbarui password akun untuk menjaga keamanan.
                    </DialogDescription>
                </DialogHeader>

                <form
                    id="change-password-form"
                    onSubmit={handleSubmit}
                    noValidate
                    className="space-y-4"
                >
                    {error && (
                        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    <PasswordField
                        id="current-password"
                        label="Current Password"
                        value={currentPassword}
                        onChange={setCurrentPassword}
                        disabled={isSubmitting}
                    />

                    <PasswordField
                        id="new-password"
                        label="New Password"
                        value={newPassword}
                        onChange={setNewPassword}
                        disabled={isSubmitting}
                    />

                    <PasswordField
                        id="confirm-password"
                        label="Confirm New Password"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        disabled={isSubmitting}
                    />
                </form>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isSubmitting}
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        form="change-password-form"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Updating..." : "Update Password"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
