
import { useState, type ComponentProps } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    ArrowRight,
    Eye,
    EyeOff,
    LockKeyhole,
    UserRound,
    ShieldCheck,
    CircleAlert,
} from "lucide-react";

import { useAuth } from "../contexts/useAuth";
import { useLoading } from "../contexts/LoadingContext";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

import { branding } from "../config/branding";

export default function Login() {
    const [username, setUsername] = useState("admin");
    const [password, setPassword] = useState("FastInsp2026");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const { login } = useAuth();
    const { withLoading } = useLoading();

    const from =
        (location.state as { from?: { pathname?: string } } | null)
            ?.from?.pathname ?? "/dashboard";

    async function handleSubmit(
        event: Parameters<
            NonNullable<ComponentProps<"form">["onSubmit"]>
        >[0]
    ) {
        event.preventDefault();
        setMessage("");

        if (!username.trim() || !password) {
            setMessage("Username dan password wajib diisi.");
            return;
        }

        try {
            setIsSubmitting(true);

            await withLoading(
                () => login(username.trim(), password),
                "Memverifikasi akun",
            );

            navigate(from, { replace: true });
        } catch (error) {
            setPassword("");
            setShowPassword(false);

            setMessage(
                error instanceof Error
                    ? error.message
                    : "Login gagal. Silakan coba kembali."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#F5F7FB] px-4 py-10">
            <div className="w-full max-w-md">

                {/* Login Card */}
                <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm sm:p-9">

                    {/* Brand */}
                    <div className="mb-9 flex flex-col items-center text-center">
                        <img
                            src={branding.logo}
                            alt="FAST"
                            className="h-auto w-44 object-contain"
                        />

                        <h1 className="mt-3 text-lg font-semibold tracking-tight text-[#0B2D5C]">
                            {branding.appName}
                        </h1>

                        <p className="mt-0.5 text-sm text-muted-foreground">
                            { branding.appDescription}
                        </p>
                    </div>

                    {/* Heading */}
                    <div className="mb-7">
                        <h2 className="text-2xl font-semibold tracking-tight text-[#0B2D5C]">
                            {branding.loginTitle}
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            {branding.loginDescription}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Error Message */}
                        {message && (
                            <div
                                role="alert"
                                aria-live="assertive"
                                className="flex items-start gap-3 rounded-lg border border-red-300 bg-red-50 p-3.5 text-sm text-red-800"
                            >
                                <CircleAlert
                                    size={19}
                                    className="mt-0.5 shrink-0 text-red-600"
                                />

                                <div className="min-w-0">
                                    <p className="font-semibold">
                                        Login gagal
                                    </p>

                                    <p className="mt-0.5 leading-5">
                                        {message}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Username */}
                        <div className="space-y-2">
                            <Label htmlFor="username">
                                Username
                            </Label>

                            <div className="relative">
                                <UserRound
                                    size={18}
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                />

                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(event) => {
                                        setUsername(event.target.value);
                                        setMessage("");
                                    }}
                                    className="h-11 pl-10"
                                    disabled={isSubmitting}
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password">
                                Password
                            </Label>

                            <div className="relative">
                                <LockKeyhole
                                    size={18}
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                />

                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(event) => {
                                        setPassword(event.target.value);
                                        setMessage("");
                                    }}
                                    className="h-11 pl-10 pr-11"
                                    disabled={isSubmitting}
                                    required
                                />

                                <button
                                    type="button"
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    disabled={isSubmitting}
                                    onClick={() =>
                                        setShowPassword((value) => !value)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-11 w-full gap-2 bg-[#0B2D5C] text-white hover:bg-[#09244A]"
                        >
                            {isSubmitting
                                ? "Signing in..."
                                : "Sign In"
                            }

                            {!isSubmitting && (
                                <ArrowRight size={17} />
                            )}
                        </Button>
                    </form>

                    {/* Security Notice */}
                    <div className="mt-7 flex items-start gap-3 rounded-lg border bg-[#F8FAFC] p-3.5">
                        <ShieldCheck
                            size={19}
                            className="mt-0.5 shrink-0 text-[#0B2D5C]"
                        />

                        <p className="text-xs leading-5 text-muted-foreground">
                            Your account access is intended for authorized
                            users. Keep your login credentials private.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-muted-foreground">
                    {branding.footerText}
                </p>
            </div>
        </main>
    );
}
