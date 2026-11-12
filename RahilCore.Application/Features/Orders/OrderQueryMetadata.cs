using RahilCore.Application.Common.Querying;

namespace RahilCore.Application.Features.Orders
{
    public static class OrderQueryMetadata
    {
        public const string DefaultSortBy = "lastActivityAt";
        public const string DefaultSortDirection = "desc";

        public static readonly IReadOnlyList<QueryFieldMetadata> Fields =
        [
            new("orderNo", "No Order", CanSearch: true, CanSort: true),
            new("StatusId", "Status", CanSearch: false, CanSort: true),
            new("PaymentStatusId", "Status Pembayaran", CanSearch: false, CanSort: true),
            new("TotalUnit", "Total Unit", CanSearch: true, CanSort: true),

            new("custCode", "Customer Code", CanSearch: true, CanSort: true),
            new("custName", "Customer Name", CanSearch: true, CanSort: true),
            new("custTypeName", "Customer Type", CanSearch: true, CanSort: true),

            new("createdAt", "Date Created", CanSearch: false, CanSort: true),
            new("lastActivityAt", "Last Activity", CanSearch: false, CanSort: true)
        ];

        public static bool CanSearch(string field)
        {
            return Fields.Any(x => string.Equals(x.Field, field, StringComparison.OrdinalIgnoreCase) && x.CanSearch);
        }

        public static bool CanSort(string field)
        {
            return Fields.Any(x => string.Equals(x.Field,field,StringComparison.OrdinalIgnoreCase) && x.CanSort);
        }
    }
}
