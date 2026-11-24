using RahilCore.Application.Features.Inspections.DTOs;
using RahilCore.Application.Features.Inspections.Queries;

namespace RahilCore.Application.Features.Inspections
{
    public interface IInspectionService
    {
        Task<InspectionFilterOptions?> GetFilterOptionsAsync(CancellationToken ct = default);
        Task<(IReadOnlyList<InspectionListDto> items, int totalItems)> GetPagedAsync(InspectionListQuery query, CancellationToken ct=default);
    }
}
