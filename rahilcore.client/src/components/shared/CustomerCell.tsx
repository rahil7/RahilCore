interface CustomerCellProps {
    name: string;
    code: string;
    type: string;
}

export default function CustomerCell({
    name,
    code,
    type,
}: CustomerCellProps) {
    return (
        <div className="flex flex-col gap-1">
            <span className="font-medium text-foreground">
                {name}
            </span>

            <span className="text-xs text-muted-foreground">
                {code} <span className="mx-1">·</span> {type}
            </span>
        </div>
    );
}