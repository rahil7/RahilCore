using RahilCore.Application.Common.Exceptions;
using RahilCore.Application.Features.Inspections.Queries;
using RahilCore.Application.Features.Orders.Queries;

namespace RahilCore.Application.Features.Inspections.DTOs
{
    public class InspectionService(IInspectionRepository inspectionRepo) : IInspectionService
    {
        // queries
        public async Task<(IReadOnlyList<InspectionListDto> items, int totalItems)> GetPagedAsync(InspectionListQuery query, CancellationToken ct = default)
        {
            ArgumentNullException.ThrowIfNull(query);

            query.Page = Math.Max(1, query.Page);
            query.PageSize = Math.Clamp(query.PageSize, 1, 100);

            query.SearchBy = string.IsNullOrWhiteSpace(query.SearchBy)
                ? null
                : query.SearchBy.Trim();

            query.SearchKey = string.IsNullOrWhiteSpace(query.SearchKey)
                ? null
                : query.SearchKey.Trim();

            query.SortBy = string.IsNullOrWhiteSpace(query.SortBy)
                ? InspectionQueryMetadata.DefaultSortBy
                : query.SortBy.Trim();

            query.SortDirection = string.IsNullOrWhiteSpace(query.SortDirection)
                ? InspectionQueryMetadata.DefaultSortDirection
                : string.Equals(query.SortDirection, "asc", StringComparison.OrdinalIgnoreCase)
                    ? "asc"
                    : "desc";

            if (query.SearchBy is not null &&
                !InspectionQueryMetadata.CanSearch(query.SearchBy))
            {
                throw new BusinessException(400, $"Field '{query.SearchBy}' is not allowed for searching.");
            }

            if (!InspectionQueryMetadata.CanSort(query.SortBy))
            {
                throw new BusinessException(400, $"Field '{query.SortBy}' is not allowed for sorting.");
            }

            var today = DateOnly.FromDateTime(TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("Asia/Jakarta")));

            query.ScheduleFrom ??= today;
            query.ScheduleTo ??= today;

            if (query.ScheduleFrom > query.ScheduleTo)
            {
                throw new BusinessException(400, "CreatedFrom cannot be later than CreatedTo.");
            }

            query.StatusIds = query.StatusIds?.Where(x => x > 0).Distinct().ToList();

            query.CustTypeIds = query.CustTypeIds?.Where(x => x > 0).Distinct().ToList();

            query.Inspectors = query.Inspectors?
                .Where(x => !string.IsNullOrWhiteSpace(x))
                .Select(x => x.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();

            return await inspectionRepo.GetPagedAsync(query, ct);
        }
    }
}
