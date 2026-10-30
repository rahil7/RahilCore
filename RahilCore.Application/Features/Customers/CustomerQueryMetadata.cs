using RahilCore.Application.Common.Querying;

namespace RahilCore.Application.Features.Customers
{
    public static class CustomerQueryMetadata
    {
        public const string DefaultSortBy = "lastActivityAt";
        public const string DefaultSortDirection = "desc";

        public static readonly IReadOnlyList<QueryFieldMetadata> Fields =
        [
            new("custCode", "Customer Code", CanSearch: true, CanSort: true),
            new("custName", "Customer Name", CanSearch: true, CanSort: true),
            new("custTypeName", "Customer Type", CanSearch: true, CanSort: true),
            new("cityName", "City", CanSearch: true, CanSort: true),
            new("createdAt", "Date Created", CanSearch: false, CanSort: true),
            new("lastActivityAt", "Last Activity", CanSearch: false, CanSort: true)
        ];

        public static bool CanSearch(string field)
        {
            return Fields.Any(x => string.Equals(x.Field,field,StringComparison.OrdinalIgnoreCase) && x.CanSearch);
        }

        public static bool CanSort(string field)
        {
            return Fields.Any(x =>
                string.Equals(
                    x.Field,
                    field,
                    StringComparison.OrdinalIgnoreCase)
                && x.CanSort);
        }
    }
}
