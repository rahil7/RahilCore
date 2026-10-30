
interface CustomerActivityCellProps {
    date: string;
    by?: string;
    showTime?: boolean;
}

export default function CustomerActivityCell({
    date,
    by,
    showTime = false,
}: CustomerActivityCellProps) {
    const parsedDate = new Date(date);

    const formattedDate = new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(parsedDate);

    const formattedTime = new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(parsedDate);

    return (
        <div className="space-y-1">
            <p className="text-sm font-medium">
                {formattedDate}
                {showTime && `, ${formattedTime}`}
            </p>

            {by && (
                <p className="text-xs text-muted-foreground">
                    {by}
                </p>
            )}
        </div>
    );
}
