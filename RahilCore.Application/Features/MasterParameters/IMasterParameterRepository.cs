using RahilCore.Application.Common.DTOs;
using RahilCore.Domain.Entities;

namespace RahilCore.Application.Features.MasterParameters
{
    public interface IMasterParameterRepository
    {
        Task<bool> ExistsAsync(long id, string paramType, CancellationToken ct = default);
        Task<MasterParameterEn?> GetByIdAsync(long id,string paramType,CancellationToken ct = default);
        Task<IReadOnlyList<FilterOptionDto>> GetFilterOptionsAsync(string paramType,CancellationToken ct = default);
    }
}
