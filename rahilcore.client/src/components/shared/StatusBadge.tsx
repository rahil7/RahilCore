import { Badge } from "../ui/badge";

interface StatusBadgeProps {
    statusId: number;
    label: string;
    config: Record<number, string>;
}

export default function StatusBadge({
    statusId,
    label,
    config,
}: StatusBadgeProps) {
    return (
        <Badge
            variant="outline"
            className={config[statusId] ?? ""}
        >
            {label}
        </Badge>
    );
}