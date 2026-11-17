using Microsoft.EntityFrameworkCore;
using RahilCore.Application.Common.DTOs;
using RahilCore.Application.Features.Inspections;
using RahilCore.Domain.Entities.Inspections;
using RahilCore.Infrastructure.Persistence.DbContext;

namespace RahilCore.Infrastructure.Persistence.Repositories
{
    public sealed class InspectionRepository(RahilCoreDbContext context) : IInspectionRepository
    {
        public void Add(InspectionEn inspection)
        {
            context.Inspections.Add(inspection);
        }

        public void AddRange(IEnumerable<InspectionEn> inspections)
        {
            context.Inspections.AddRange(inspections);
        }

        public async Task<IReadOnlyList<FilterOptionDto>> GetInspFormsForFilter(CancellationToken ct)
        {
            return await context.MasterInspectionForms
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
