using RahilCore.Application.Common.DTOs;
using RahilCore.Domain.Entities.Inspections;

namespace RahilCore.Application.Features.Inspections
{
    public interface IInspectionRepository
    {
        void AddRange(IEnumerable<InspectionEn> inspections);
        void Add(InspectionEn inspection);
        Task<IReadOnlyList<FilterOptionDto>> GetInspFormsForFilter(CancellationToken ct);
    }
}
