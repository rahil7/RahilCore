using RahilCore.Application.Common.DTOs;

namespace RahilCore.Application.Features.City
{
    public interface ICityRepository
    {
        Task<bool> ExistsAsync(long id, CancellationToken ct = default);
        Task<IReadOnlyList<FilterOptionDto>> GetForFilter(CancellationToken ct = default);
    }
}
