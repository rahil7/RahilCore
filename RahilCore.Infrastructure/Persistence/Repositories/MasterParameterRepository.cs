using Microsoft.EntityFrameworkCore;
using RahilCore.Application.Common.DTOs;
using RahilCore.Application.Features.MasterParameters;
using RahilCore.Infrastructure.Persistence.DbContext;

namespace RahilCore.Infrastructure.Persistence.Repositories
{
    public sealed class MasterParameterRepository : IMasterParameterRepository
    {
        private readonly RahilCoreDbContext _context;

        public MasterParameterRepository(RahilCoreDbContext context)
        {
            _context = context;
        }

        public async Task<bool> ExistsAsync(long id, CancellationToken ct = default)
        {
            return await _context.MasterParameters.AnyAsync(x => x.Id == id, ct);
        }

        public async Task<IReadOnlyList<FilterOptionDto>> GetFilterOptionsAsync(string paramType, CancellationToken ct = default)
        {
            return await _context.MasterParameters
                .AsNoTracking()
                .Where(x => x.IsActive && x.ParamType == paramType)
                .OrderBy(x => x.SortOrder)
                .Select(x => new FilterOptionDto
                {
                    Id = x.Id,
                    Name = x.ParamName
                })
                .ToListAsync(ct);
        }
    }
}
