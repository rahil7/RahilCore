import { MoreHorizontal, Eye } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

interface OrderActionsProps {
    id: number;
}

export default function OrderActions({
    id,
}: OrderActionsProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Customer actions"
                        className="h-8 w-8 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                }
            />

            <DropdownMenuContent
                align="end"
                sideOffset={4}
                className="min-w-40"
            >
                <DropdownMenuItem onClick={() => { } }>
                    <Eye className="mr-2 h-4 w-4" />
                    Detail
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}