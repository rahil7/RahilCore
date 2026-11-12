using Microsoft.EntityFrameworkCore;
using RahilCore.Application.Features.Vehicles;
using RahilCore.Domain.Entities;
using RahilCore.Infrastructure.Persistence.DbContext;
using System.Net.Http.Headers;

namespace RahilCore.Infrastructure.Persistence.Repositories
{
    public sealed class VehicleRepository : IVehicleRepository
    {
        private readonly RahilCoreDbContext _context;

        public VehicleRepository(RahilCoreDbContext context)
        {
            _context = context;
        }

        public void Add(VehicleEn vehicle)
        {
            _context.Vehicles.Add(vehicle);
        }

        public void AddRange(IEnumerable<VehicleEn> vehicles)
        {
            _context.Vehicles.AddRange(vehicles);
        }

        public async Task<bool> ExistsColorAsync(long colorId, CancellationToken ct = default)
        {
            return await _context.MasterColors.AnyAsync(x => x.Id == colorId,ct);
        }

        public async Task<bool> IsValidBrandModelVariantAsync(long brandId, long modelId, long variantId, CancellationToken ct = default)
        {
            return await _context.MasterVariants
                .AnyAsync(x =>
                    x.BrandId == brandId &&
                    x.ModelId == modelId &&
                    x.Id == variantId,
                    ct);
        }
    }
}
