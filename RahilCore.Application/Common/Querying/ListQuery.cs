using RahilCore.Application.Common.Pagination;

namespace RahilCore.Application.Common.Querying
{
    public abstract class ListQuery : PagedQuery
    {
        public string? SearchBy { get; set; }

        public string? SearchKey { get; set; }

        public string? SortBy { get; set; }

        public string? SortDirection { get; set; }
    }
}
