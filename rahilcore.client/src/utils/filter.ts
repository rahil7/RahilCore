export function formatFilterLabel(
    label: string,
    items: string[],
    maxVisible: number = 2
): string {
    if (items.length === 0) return "";

    const visibleItems = items.slice(0, maxVisible);
    const hiddenCount = items.length - visibleItems.length;

    return `${label}: ${visibleItems.join(", ")}${hiddenCount > 0 ? ` +${hiddenCount}` : ""}`;
}