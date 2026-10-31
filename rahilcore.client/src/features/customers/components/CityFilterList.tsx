import { memo, useMemo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Checkbox } from "../../../components/ui/checkbox";
import type { FilterOption } from "../../../types/common";

interface CityFilterListProps {
    cities: FilterOption[];
    selectedIds: number[];
    onChange: (id: number, checked: boolean) => void;
}

function CityFilterList({
    cities,
    selectedIds,
    onChange,
}: CityFilterListProps) {

    const parentRef = useRef<HTMLDivElement>(null);

    const selectedSet = useMemo(
        () => new Set(selectedIds),
        [selectedIds]
    );

    const virtualizer = useVirtualizer({
        count: cities.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 32,
        overscan: 5,
    });

    return (
        <div className="space-y-3">
            <div
                ref={parentRef}
                className="h-[220px] overflow-y-auto overflow-x-hidden rounded-md border bg-muted/30"
            >
                <div
                    style={{
                        height: `${virtualizer.getTotalSize()}px`,
                        width: "100%",
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    {virtualizer.getVirtualItems().map((virtualItem) => {
                        const item = cities[virtualItem.index];

                        return (
                            <label
                                key={item.id}
                                className="absolute left-0 top-0 flex h-8 w-full cursor-pointer items-center gap-3 px-1 text-sm"
                                style={{
                                    transform: `translateY(${virtualItem.start}px)`,
                                }}
                            >
                                <Checkbox
                                    checked={selectedSet.has(item.id)}
                                    onCheckedChange={(checked) =>
                                        onChange(item.id, checked === true)
                                    }
                                />

                                <span>{item.name}</span>
                            </label>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default memo(CityFilterList);