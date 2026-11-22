using Microsoft.EntityFrameworkCore;
using RahilCore.Application.Common.DTOs;
using RahilCore.Application.Features.Vehicles;
using RahilCore.Domain.Entities;
using RahilCore.Infrastructure.Persistence.DbContext;
using System.Net.Http.Headers;

namespace RahilCore.Infrastructure.Persistence.Repositories
{
    public sealed class VehicleRepository(RahilCoreDbContext context) : IVehicleRepository
    {
        public void Add(VehicleEn vehicle)
        {
            context.Vehicles.Add(vehicle);
        }

        public void AddRange(IEnumerable<VehicleEn> vehicles)
        {
            context.Vehicles.AddRange(vehicles);
        }

        public void DeleteVehicle(VehicleEn vehicle)
        {
            context.Vehicles.Remove(vehicle);
        }

        public async Task<bool> ExistsColorAsync(long colorId, CancellationToken ct = default)
        {
            return await context.MasterColors.AnyAsync(x => x.Id == colorId,ct);
        }

        public async Task<IReadOnlyList<FilterOptionDto>> GetBarndLookup(CancellationToken ct = default)
        {
            return await context.MasterBrands
                .AsNoTracking()
                .Where(x => x.IsActive)
                .OrderBy(x => x.Name)
                .Select(x => new FilterOptionDto
                {
                    Id = x.Id,
                    Name = x.Name
                })
                .ToListAsync(ct);
        }

        public async Task<VehicleEn?> GetByIdAsync(long vehicleId, CancellationToken ct = default)
        {
            return await context.Vehicles
                .Include(x => x.Brand)
                .Include(x => x.Model)
                .Include(x => x.Variant)
                .FirstOrDefaultAsync(x => x.Id == vehicleId,ct);
        }

        public async Task<IReadOnlyList<FilterOptionDto>> GetColorLookup(CancellationToken ct = default)
        {
            return await context.MasterColors
                .AsNoTracking()
                .Where(x => x.IsActive)
                .OrderBy(x => x.Name)
                .Select(x => new FilterOptionDto
                {
                    Id = x.Id,
                    Name = x.Name
                })
                .ToListAsync(ct);
        }

        public async Task<IReadOnlyList<FilterOptionDto>?> GetModelLookup(long brandId, CancellationToken ct = default)
        {
            return await context.MasterModels
                .AsNoTracking()
                .Where(x => x.IsActive && x.BrandId == brandId)
                .OrderBy(x => x.Name)
                .Select(x => new FilterOptionDto
                {
                    Id = x.Id,
                    Name = x.Name
                })
                .ToListAsync(ct);
        }

        public async Task<IReadOnlyList<FilterOptionDto>?> GetVariantLookup(long modelId, CancellationToken ct = default)
        {
            return await context.MasterVariants
                .AsNoTracking()
                .Where(x => x.IsActive && x.ModelId == modelId)
                .OrderBy(x => x.Name)
                .Select(x => new FilterOptionDto
                {
                    Id = x.Id,
                    Name = x.Name
                })
                .ToListAsync(ct);
        }

        public async Task<bool> IsValidBrandModelVariantAsync(long brandId, long modelId, long variantId, CancellationToken ct = default)
        {
            return await context.MasterVariants
                .AnyAsync(x =>
                    x.BrandId == brandId &&
                    x.ModelId == modelId &&
                    x.Id == variantId,
                    ct);
        }
    }
}
