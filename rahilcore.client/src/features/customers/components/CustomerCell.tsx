
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";

interface CustomerCellProps {
    name: string;
    code: string;
}

export default function CustomerCell({
    name,
    code,
}: CustomerCellProps) {
    const initials = name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();

    return (
        <div className="flex min-w-0 items-center gap-3">
            <Avatar className="h-10 w-10 shrink-0 rounded-full">
                <AvatarFallback className="bg-muted text-xs font-medium">
                    {initials}
                </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1 space-y-1">
                <p
                    className="truncate text-sm font-medium text-foreground"
                    title={name}
                >
                    {name}
                </p>

                <p className="truncate text-xs text-muted-foreground">
                    {code}
                </p>
            </div>
        </div>
    );
}
