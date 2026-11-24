using RahilCore.Application.Common.Querying;

namespace RahilCore.Application.Features.Inspections.Queries
{
    public static class InspectionQueryMetadata
    {
        public const string DefaultSortBy = "lastActivityAt";
        public const string DefaultSortDirection = "desc";

        public static readonly IReadOnlyList<QueryFieldMetadata> Fields =
        [
            new("orderNo", "No Order", CanSearch: true, CanSort: true),
            new("inspectionNo", "No Inspeksi", CanSearch: true, CanSort: true),
            new("statusId", "Status", CanSearch: false, CanSort: true),

            new("inspectorName", "Inspektor", CanSearch: false, CanSort: true),
            new("scheduleAt", "Tanggal Inspeksi", CanSearch: false, CanSort: true),

            new("custCode", "Kode Customer", CanSearch: true, CanSort: true),
            new("custName", "Nama Customer", CanSearch: true, CanSort: true),
            new("custTypeName", "Tipe Customer", CanSearch: false, CanSort: true),

            new("plateNo", "No Polisi", CanSearch: true, CanSort: true),
            new("brand", "Brand", CanSearch: true, CanSort: true),
            new("model", "Model", CanSearch: true, CanSort: true),
            new("variant", "Variant", CanSearch: true, CanSort: true),

            new("lastActivityAt", "Last Activity", CanSearch: false, CanSort: true)
        ];

        public static bool CanSearch(string field)
        {
            return Fields.Any(x => string.Equals(x.Field, field, StringComparison.OrdinalIgnoreCase) && x.CanSearch);
        }

        public static bool CanSort(string field)
        {
            return Fields.Any(x => string.Equals(x.Field, field, StringComparison.OrdinalIgnoreCase) && x.CanSort);
        }
    }
}
