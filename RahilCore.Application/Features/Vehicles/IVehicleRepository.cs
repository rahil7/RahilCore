using RahilCore.Domain.Entities;

namespace RahilCore.Application.Features.Vehicles
{
    public interface IVehicleRepository
    {
        void AddRange(IEnumerable<VehicleEn> vehicles);
    }
}
