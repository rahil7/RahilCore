
import { useState, type ComponentProps } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import {
    ArrowRight,
    Eye,
    EyeOff,
    Layers3,
    LockKeyhole,
    UserRound,
    ShieldCheck,
    CircleAlert
} from "lucide-react";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { branding } from "../config/branding";
import { useLoading } from "../contexts/LoadingContext";

export default function Login() {
    const [username, setUsername] = useState("admin");
    const [password, setPassword] = useState("FastInsp2026");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const { withLoading } = useLoading();

    const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/dashboard";

    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(
        event: Parameters<
            NonNullable<ComponentProps<"form">["onSubmit"]>
        >[0]
    ) {
        event.preventDefault();
        setMessage("");
        setIsSubmitting(true);

        try {
            await withLoading(
                () => login(username, password),
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
        <main className="grid min-h-screen bg-background lg:grid-cols-2">

            {/* Brand panel */}
            <section className="relative hidden flex-col justify-between overflow-hidden bg-[#0B2D5C] p-10 text-white lg:flex xl:p-14">
                <div className="absolute -right-24 -top-24 size-96 rounded-full border border-white/10" />
                <div className="absolute -bottom-40 -left-20 size-[30rem] rounded-full border border-white/10" />
                <div className="absolute right-20 top-1/3 size-52 rounded-full bg-indigo-500/20 blur-3xl" />

                <div className="relative z-10 flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
                        <Layers3 size={24} />
                    </div>
                    <div>
                        <p className="text-lg font-semibold tracking-tight">
                            {branding.appName}
                        </p>
                        <p className="text-sm text-indigo-200">
                            {branding.appDescription}
                        </p>
                    </div>
                </div>

                <div className="relative z-10 max-w-xl py-12">
                    <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                        <ShieldCheck size={30} />
                    </div>

                    <h1 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
                        One workspace.
                        <br />
                        Everything in control.
                    </h1>

                    <p className="mt-6 max-w-md text-base leading-7 text-indigo-200">
                        Access your business workspace with a simple,
                        secure, and consistent experience.
                    </p>

                    <div className="mt-10 flex items-center gap-3 text-sm text-indigo-100">
                        <span className="flex size-8 items-center justify-center rounded-full bg-white/10">
                            <ShieldCheck size={16} />
                        </span>
                        Designed for your business workspace
                    </div>
                </div>

                <p className="relative z-10 text-xs text-indigo-200/80">
                    {branding.footerText}
                </p>
            </section>

            {/* Login form */}
            <section className="flex min-h-screen flex-col justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-20">
                <div className="mx-auto w-full max-w-md">
                    <div className="mb-10 flex items-center gap-3 lg:hidden">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                            <Layers3 size={22} />
                        </div>
                        <div>
                            <p className="font-semibold">{branding.appName}</p>
                            <p className="text-xs text-muted-foreground">
                                {branding.appDescription}
                            </p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <p className="mb-3 text-sm font-medium text-primary">
                            ACCOUNT ACCESS
                        </p>
                        <h2 className="text-3xl font-semibold tracking-tight">
                            {branding.loginTitle}
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            {branding.loginDescription}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>

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
                                    placeholder="Masukkan username"
                                    value={username}
                                    onChange={(event) => {
                                        setUsername(event.target.value);
                                        setMessage("");
                                    }}
                                    className="h-11 pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between gap-3">
                                <Label htmlFor="password">Password</Label>
                                <button
                                    type="button"
                                    className="text-xs font-medium text-primary hover:underline"
                                    onClick={() =>
                                        setMessage(
                                            "Fitur reset password akan tersedia setelah backend dihubungkan."
                                        )
                                    }
                                >
                                    Forgot password?
                                </button>
                            </div>

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
                                    required
                                />
                                <button
                                    type="button"
                                    aria-label={
                                        showPassword ? "Hide password" : "Show password"
                                    }
                                    onClick={() => setShowPassword((value) => !value)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                        </div>

                        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(event) => setRememberMe(event.target.checked)}
                                className="size-4 rounded border-border accent-primary"
                            />
                            Remember me
                        </label>

                        <Button
                            type="submit"
                            className="h-11 w-full gap-2 bg-[#F5B51B] text-[#0B2D5C] hover:bg-[#E5A610]"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Signing in..." : "Sign in"}
                            {!isSubmitting && <ArrowRight size={17} />}
                        </Button>


                        {message && (
                            <div
                                role="alert"
                                aria-live="assertive"
                                className="flex items-start gap-3 rounded-lg border border-red-300 bg-red-50 p-3.5 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                            >
                                <CircleAlert
                                    size={20}
                                    className="mt-0.5 shrink-0 text-red-600 dark:text-red-400"
                                />

                                <div className="min-w-0">
                                    <p className="font-semibold">Login gagal</p>
                                    <p className="mt-0.5 leading-5">{message}</p>
                                </div>
                            </div>
                        )}

                    </form>

                    <div className="mt-8 flex items-start gap-3 rounded-xl border bg-card p-4">
                        <ShieldCheck
                            size={19}
                            className="mt-0.5 shrink-0 text-primary"
                        />
                        <p className="text-xs leading-5 text-muted-foreground">
                            Your account access is intended for authorized users.
                            Keep your login credentials private.
                        </p>
                    </div>

                    <p className="mt-8 text-center text-xs text-muted-foreground lg:hidden">
                        {branding.footerText}
                    </p>
                </div>
            </section>
        </main>
    );
}
