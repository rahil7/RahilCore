using RahilCore.Application.Features.Vehicles;
using RahilCore.Domain.Entities;
using RahilCore.Infrastructure.Persistence.DbContext;

namespace RahilCore.Infrastructure.Persistence.Repositories
{
    public sealed class VehicleRepository : IVehicleRepository
    {
        private readonly RahilCoreDbContext _context;

        public VehicleRepository(RahilCoreDbContext context)
        {
            _context = context;
        }

        public void AddRange(IEnumerable<VehicleEn> vehicles)
        {
            _context.Vehicles.AddRange(vehicles);
        }
    }
}
