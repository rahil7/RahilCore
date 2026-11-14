
interface ActivityCellProps {
    date: string;
    by?: string;
    showTime?: boolean;
}

export default function ActivityCell({
    date,
    by,
    showTime = false,
}: ActivityCellProps) {
    const parsedDate = new Date(date);

    const formattedDate = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(parsedDate);

    const formattedTime = new Intl.DateTimeFormat("en-GB", {
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
