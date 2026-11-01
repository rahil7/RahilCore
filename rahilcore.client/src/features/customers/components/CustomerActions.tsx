import { MoreHorizontal, Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

interface CustomerActionsProps {
    customerId: number;
}

export default function CustomerActions({
    customerId,
}: CustomerActionsProps) {
    const navigate = useNavigate();
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
                <DropdownMenuItem
                    onClick={() => navigate(`/customers/${customerId}`)}
                >
                    <Eye className="mr-2 h-4 w-4" />
                    Detail
                </DropdownMenuItem>

                <DropdownMenuItem
                    variant="destructive"
                    onClick={() => console.log("Delete:", customerId)}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}