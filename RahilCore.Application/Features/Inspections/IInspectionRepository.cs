using RahilCore.Application.Common.DTOs;
using RahilCore.Domain.Entities.Inspections;

namespace RahilCore.Application.Features.Inspections
{
    public interface IInspectionRepository
    {
        void AddRange(IEnumerable<InspectionEn> inspections);
        void Add(InspectionEn inspection);
        Task<IReadOnlyList<FilterOptionDto>> GetInspFormsForFilter(CancellationToken ct = default);
        Task<InspectionEn?> GetByOrderItemId(long orderItemId, CancellationToken ct = default);
        void Delete(InspectionEn inspection);
        Task DeleteByOrderItemId(long orderItemId, CancellationToken ct = default);
    }
}
