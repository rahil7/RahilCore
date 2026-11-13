using RahilCore.Application.Common.DTOs;

namespace RahilCore.Application.Features.Vehicles
{
    public interface IVehicleService
    {
        Task<IReadOnlyList<FilterOptionDto>?> GetModelLookup(long brandId, CancellationToken ct);
        Task<IReadOnlyList<FilterOptionDto>?> GetVariantLookup(long modelId, CancellationToken ct);
    }
}
