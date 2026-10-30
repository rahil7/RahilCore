using RahilCore.Application.Common.DTOs;

namespace RahilCore.Application.Features.MasterParameters
{
    public interface IMasterParameterRepository
    {
        Task<bool> ExistsAsync(long id,CancellationToken ct = default);
        Task<IReadOnlyList<FilterOptionDto>> GetFilterOptionsAsync(string paramType,CancellationToken ct = default);
    }
}
