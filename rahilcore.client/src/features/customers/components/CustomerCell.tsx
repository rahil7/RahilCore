import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";

interface CustomerCellProps {
    customerId: number;
    name: string;
    code: string;
}

export default function CustomerCell({
    customerId,
    name,
    code,
}: CustomerCellProps) {
    const navigate = useNavigate();

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
                <button
                    type="button"
                    className="truncate text-left text-sm font-medium text-foreground hover:underline"
                    title={name}
                    onClick={() => navigate(`/customers/${customerId}`)}
                >
                    {name}
                </button>

                <p className="truncate text-xs text-muted-foreground">
                    {code}
                </p>
            </div>
        </div>
    );
}
