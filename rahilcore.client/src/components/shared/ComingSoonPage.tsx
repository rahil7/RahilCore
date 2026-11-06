
import { Construction } from "lucide-react";
import { PageHeader } from "../layout/PageHeader";

interface ComingSoonPageProps {
    title: string;
    description: string;
}

export default function ComingSoonPage({
    title,
    description,
}: ComingSoonPageProps) {
    return (
        <div className="w-full min-w-0 space-y-3">
            <PageHeader
                title={title}
                description={description}
            />

            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border bg-card px-5 py-10 text-center">
                <div className="flex size-14 items-center justify-center rounded-xl bg-muted">
                    <Construction className="size-7 text-muted-foreground" />
                </div>

                <h2 className="mt-4 text-base font-semibold">
                    Coming Soon
                </h2>

                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    This feature is currently under development.
                </p>
            </div>
        </div>
    );
}
