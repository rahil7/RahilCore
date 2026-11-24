using RahilCore.Application.Features.Inspections.DTOs;
using RahilCore.Application.Features.Inspections.Queries;

namespace RahilCore.Application.Features.Inspections
{
    public interface IInspectionService
    {
        Task<(IReadOnlyList<InspectionListDto> items, int totalItems)> GetPagedAsync(InspectionListQuery query, CancellationToken ct=default);
    }
}
