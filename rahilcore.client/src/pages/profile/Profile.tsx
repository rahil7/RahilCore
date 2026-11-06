
import { UserRound } from "lucide-react";
import { useAuth } from "../../contexts/useAuth";
import { PageHeader } from "../../components/layout/PageHeader";

export default function Profile() {
    const { user } = useAuth();

    return (
        <div className="w-full min-w-0 space-y-5">
            {/* Page Heading */}
            <PageHeader
                title="My Profile"
                description="Informasi akun dan profil pengguna"
            />

            {/* Profile Summary */}
            <div className="rounded-xl border bg-card p-5">
                <div className="flex items-center gap-4">
                    <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-[#0B2D5C] text-white">
                        <UserRound size={30} />
                    </div>

                    <div className="min-w-0">
                        <h2 className="truncate text-lg font-semibold">
                            {user?.displayName ?? "User"}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            @{user?.username ?? "user"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Account Information */}
            <div className="overflow-hidden rounded-xl border bg-card">
                <div className="border-b px-5 py-4">
                    <h2 className="font-semibold">Account Information</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Informasi dasar akun yang sedang digunakan.
                    </p>
                </div>

                <div className="grid gap-5 p-5 sm:grid-cols-2">
                    <div className="space-y-1.5">
                        <p className="text-sm text-muted-foreground">
                            Full Name
                        </p>
                        <p className="text-sm font-medium">
                            {user?.displayName ?? "-"}
                        </p>
                    </div>

                    <div className="space-y-1.5">
                        <p className="text-sm text-muted-foreground">
                            Username
                        </p>
                        <p className="text-sm font-medium">
                            {user?.username ?? "-"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
