import { useContext } from "react";
import { OrderContext } from "./OrderContext";

export function useOrderContext() {
    const context = useContext(OrderContext);

    if (!context) {
        throw new Error(
            "useOrderContext must be used within OrderProvider"
        );
    }

    return context;
}