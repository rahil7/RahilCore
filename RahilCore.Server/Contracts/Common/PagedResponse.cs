namespace RahilCore.Server.Contracts.Common
{
    public sealed record PagedResponse<T>(
        bool Success,
        string Message,
        IReadOnlyList<T> Data,
        PaginationMetadata Pagination);
}
