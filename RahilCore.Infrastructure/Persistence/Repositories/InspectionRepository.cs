using Microsoft.EntityFrameworkCore;
using RahilCore.Application.Common.DTOs;
using RahilCore.Application.Features.Inspections;
using RahilCore.Infrastructure.Persistence.DbContext;

namespace RahilCore.Infrastructure.Persistence.Repositories
{
    public sealed class InspectionRepository : IInspectionRepository
    {
        private readonly RahilCoreDbContext _context;
        public InspectionRepository(RahilCoreDbContext context)
        {
            _context = context;
        }

        public async Task<IReadOnlyList<FilterOptionDto>> GetInspFormsForFilter(CancellationToken ct)
        {
            return await _context.MasterInspectionForms
                .AsNoTracking()
                .Select(x => new FilterOptionDto
                {
                    Id = x.Id,
                    Name = x.Name
                })
                .ToListAsync(ct);
        }
    }
}
