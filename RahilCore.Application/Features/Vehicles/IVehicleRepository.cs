using RahilCore.Domain.Entities;

namespace RahilCore.Application.Features.Vehicles
{
    public interface IVehicleRepository
    {
        void Add(VehicleEn vehicle);
        void AddRange(IEnumerable<VehicleEn> vehicles);

        Task<bool> IsValidBrandModelVariantAsync(
            long brandId,
            long modelId,
            long variantId,
            CancellationToken ct = default);

        Task<bool> ExistsColorAsync(long colorId, CancellationToken ct = default);
    }
}
