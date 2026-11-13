using RahilCore.Application.Common.DTOs;

namespace RahilCore.Application.Features.Inspections
{
    public interface IInspectionRepository
    {
        Task<IReadOnlyList<FilterOptionDto>> GetInspFormsForFilter(CancellationToken ct);
    }
}
