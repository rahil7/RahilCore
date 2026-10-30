namespace RahilCore.Application.Common.Pagination
{
    public abstract class PagedQuery
    {
        public int Page { get; set; } = 1;

        public int PageSize { get; set; } = 10;
    }
}
