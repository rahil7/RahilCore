import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

interface PageDetailHeaderProps {
    title: string;
    backTo: string;
}

export function PageDetailHeader({
    title,
    backTo,
}: PageDetailHeaderProps) {
    const navigate = useNavigate();

    return (
        <div className="sticky top-16 z-20 -mx-5 flex items-center gap-3 bg-background px-5 py-3">
            <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 shrink-0"
                onClick={() => navigate(backTo)}
            >
                <ArrowLeft className="h-4 w-4" />
            </Button>

            <h1 className="text-xl font-semibold tracking-tight">
                {title}
            </h1>
        </div>
    );
}