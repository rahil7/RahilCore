import { useContext } from "react";
import { InspectionContext } from "./InspectionContext";

export function useInspectionContext() {
    const context = useContext(InspectionContext);

    if (!context) {
        throw new Error(
            "useInspectionContext must be used within OrderProvider"
        );
    }

    return context;
}