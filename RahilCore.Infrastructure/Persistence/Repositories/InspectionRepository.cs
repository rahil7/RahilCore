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

        public void Delete(InspectionEn inspection)
        {
            context.Inspections.Remove(inspection);
        }

        public async Task DeleteByOrderItemId(long orderItemId, CancellationToken ct = default)
        {
            await context.Inspections
                .Where(x => x.OrderItemId == orderItemId)
                .ExecuteDeleteAsync(ct);
        }

        public async Task<InspectionEn?> GetByOrderItemId(long orderItemId, CancellationToken ct = default)
        {
            return await context.Inspections.FirstOrDefaultAsync(x=> x.OrderItemId == orderItemId, ct);
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
