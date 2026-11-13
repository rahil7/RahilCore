using RahilCore.Application.Common.DTOs;

namespace RahilCore.Application.Features.Vehicles
{
    public sealed class VehicleService(
            IVehicleRepository vehicleRepo
        ) : IVehicleService
    {
        public async Task<IReadOnlyList<FilterOptionDto>?> GetModelLookup(long brandId, CancellationToken ct)
        {
            return await vehicleRepo.GetModelLookup(brandId, ct);
        }

        public async Task<IReadOnlyList<FilterOptionDto>?> GetVariantLookup(long modelId, CancellationToken ct)
        {
            return await vehicleRepo.GetVariantLookup(modelId, ct);
        }
    }
}
