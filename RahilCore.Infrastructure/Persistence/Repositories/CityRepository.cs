using Microsoft.EntityFrameworkCore;
using RahilCore.Application.Common.DTOs;
using RahilCore.Application.Features.City;
using RahilCore.Infrastructure.Persistence.DbContext;

namespace RahilCore.Infrastructure.Persistence.Repositories
{
    public sealed class CityRepository : ICityRepository
    {
        private readonly RahilCoreDbContext _context;

        public CityRepository(RahilCoreDbContext context)
        {
            _context = context;
        }

        public async Task<bool> ExistsAsync(long id, CancellationToken ct = default)
        {
            return await _context.Cities.AnyAsync(x => x.Id == id, ct);
        }

        public async Task<IReadOnlyList<FilterOptionDto>> GetFilterOptionsAsync(CancellationToken ct = default)
        {
            return await _context.Cities
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
    }
}
