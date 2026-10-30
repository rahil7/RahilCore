import { MoreHorizontal } from "lucide-react";

import { Button } from "../../../components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Separator } from "../../../components/ui/separator";

interface CustomerActionsProps {
    customerId: number;
}

export default function CustomerActions({
    customerId,
}: CustomerActionsProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md text-muted-foreground hover:text-foreground"
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
                    onClick={() => console.log("Detail:", customerId)}
                >
                    Detail
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => console.log("Edit:", customerId)}
                >
                    Edit
                </DropdownMenuItem>

                <Separator className="my-1"/>

                <DropdownMenuItem
                    variant="destructive"
                    onClick={() => console.log("Delete:", customerId)}
                >
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}