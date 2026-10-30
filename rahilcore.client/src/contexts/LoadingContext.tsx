
import {
    createContext,
    useCallback,
    useContext,
    useRef,
    useState,
    type ReactNode,
} from "react";

import LoadingOverlay from "../components/feedback/LoadingOverlay";

interface LoadingContextValue {
    withLoading: <T>(
        action: () => Promise<T>,
        message?: string,
    ) => Promise<T>;
}

const LoadingContext = createContext<LoadingContextValue | null>(null);

export function LoadingProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("Memproses permintaan...");
    const activeCount = useRef(0);

    const withLoading = useCallback(
        async <T,>(
            action: () => Promise<T>,
            loadingMessage = "Memproses permintaan...",
        ): Promise<T> => {
            activeCount.current += 1;
            setMessage(loadingMessage);
            setIsLoading(true);

            try {
                return await action();
            } finally {
                activeCount.current -= 1;

                if (activeCount.current === 0) {
                    setIsLoading(false);
                }
            }
        },
        [],
    );

    return (
        <LoadingContext.Provider value={{ withLoading }}>
            {children}

            {isLoading && <LoadingOverlay message={message} />}
        </LoadingContext.Provider>
    );
}

export function useLoading() {
    const context = useContext(LoadingContext);

    if (!context) {
        throw new Error("useLoading must be used inside LoadingProvider");
    }

    return context;
}
