using Microsoft.EntityFrameworkCore;
using RahilCore.Application.Common.DTOs;
using RahilCore.Application.Common.Helpers;
using RahilCore.Application.Features.Inspections;
using RahilCore.Application.Features.Inspections.DTOs;
using RahilCore.Application.Features.Inspections.Queries;
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

        public async Task<InspectionEn?> GetDetail(long id, CancellationToken ct = default)
        {
            return await context.Inspections
                .Include(x => x.OrderItem!)
                    .ThenInclude(x => x.Vehicle)
                .Include(x => x.OrderItem!)
                    .ThenInclude(x => x.InspectionForm)
                .Include(x => x.OrderItem!)
                    .ThenInclude(x => x.Order!)
                    .ThenInclude(x => x.Customer)
                .Include(x => x.OrderItem!)
                    .ThenInclude(x => x.Order!)
                    .ThenInclude(x => x.Customer!)
                    .ThenInclude(x => x.CustType)
                .Include(x => x.OrderItem!)
                    .ThenInclude(x => x.Order!)
                    .ThenInclude(x => x.Status)
                .FirstOrDefaultAsync(x => x.Id == id, ct);
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

        public async Task<(IReadOnlyList<InspectionListDto> items, int totalItems)> GetPagedAsync(InspectionListQuery query, CancellationToken ct = default)
        {
            var inspections = context.Inspections
                .AsNoTracking()
                .AsQueryable();

            // 1. Search: hanya satu field per request.
            if (!string.IsNullOrWhiteSpace(query.SearchBy) && !string.IsNullOrWhiteSpace(query.SearchKey))
            {
                var searchKey = $"%{query.SearchKey.Trim()}%";

                inspections = query.SearchBy.Trim().ToLowerInvariant() switch
                {
                    "orderno" => inspections.Where(x =>
                        EF.Functions.ILike(x.OrderItem!.Order!.OrderNo, searchKey)),

                    "inspectionno" => inspections.Where(x =>
                        EF.Functions.ILike(x.InspectionNo, searchKey)),

                    "plateno" => inspections.Where(x =>
                        x.OrderItem!.Vehicle!.PlateNo != null &&
                        EF.Functions.ILike(x.OrderItem.Vehicle.PlateNo, searchKey)),

                    "brand" => inspections.Where(x =>
                        x.OrderItem!.Vehicle!.Brand != null &&
                        EF.Functions.ILike(x.OrderItem.Vehicle.Brand.Name, searchKey)),

                    "model" => inspections.Where(x =>
                        x.OrderItem!.Vehicle!.Model != null &&
                        EF.Functions.ILike(x.OrderItem.Vehicle.Model.Name, searchKey)),

                    "variant" => inspections.Where(x =>
                        x.OrderItem!.Vehicle!.Variant != null &&
                        EF.Functions.ILike(x.OrderItem.Vehicle.Variant.Name, searchKey)),

                    "custcode" => inspections.Where(x =>
                        EF.Functions.ILike(x.OrderItem!.Order!.Customer!.CustCode, searchKey)),

                    "custname" => inspections.Where(x =>
                        EF.Functions.ILike(x.OrderItem!.Order!.Customer!.CustName, searchKey)),

                    _ => inspections
                };
            }

            // 2. Filtering.
            var scheduleFrom = DateTimeHelper.JakartaToUtc(query.ScheduleFrom!.Value);
            inspections = inspections.Where(x => x.OrderItem!.Order!.ScheduleAt >= scheduleFrom);

            var scheduleTo = DateTimeHelper.JakartaToUtc(query.ScheduleTo!.Value.AddDays(1));
            inspections = inspections.Where(x => x.OrderItem!.Order!.ScheduleAt < scheduleTo);

            if (query.CustTypeIds is { Count: > 0 })
            {
                inspections = inspections.Where(x =>
                    x.OrderItem!.Order!.Customer != null &&
                    x.OrderItem!.Order!.Customer!.CustType != null &&
                    query.CustTypeIds.Contains(x.OrderItem!.Order!.Customer!.CustType.Id));
            }

            if (query.StatusIds is { Count: > 0 })
            {
                inspections = inspections.Where(x => query.StatusIds.Contains(x.OrderItem!.Order!.StatusId));
            }

            if (query.Inspectors is { Count: > 0 })
            {
                inspections = inspections.Where(x =>
                    context.InspectionOrderAssignments.Any(a =>
                        a.OrderId == x.OrderItem!.OrderId &&
                        a.EndedAt == null &&
                        query.Inspectors.Contains(a.InspectorUsername)
                    )
                );
            }

            // 3. Hitung total data setelah filter, sebelum pagination.
            var totalItems = await inspections.CountAsync(ct);

            // 4. Sorting.
            var sortBy = string.IsNullOrWhiteSpace(query.SortBy)
                ? InspectionQueryMetadata.DefaultSortBy
                : query.SortBy.Trim().ToLowerInvariant();

            var descending = !string.Equals(query.SortDirection,"asc",StringComparison.OrdinalIgnoreCase);

            IOrderedQueryable<InspectionEn> orderedResult = sortBy switch
            {
                "orderno" => descending
                    ? inspections.OrderByDescending(x => x.OrderItem!.Order!.OrderNo)
                    : inspections.OrderBy(x => x.OrderItem!.Order!.OrderNo),

                "inspectionno" => descending
                    ? inspections.OrderByDescending(x => x.InspectionNo)
                    : inspections.OrderBy(x => x.InspectionNo),

                "statusid" => descending
                    ? inspections.OrderByDescending(x => x.OrderItem!.Order!.Status!.ParamName)
                    : inspections.OrderBy(x => x.OrderItem!.Order!.Status!.ParamName),

                "scheduleat" => descending
                    ? inspections.OrderByDescending(x => x.OrderItem!.Order!.ScheduleAt)
                    : inspections.OrderBy(x => x.OrderItem!.Order!.ScheduleAt),

                "custcode" => descending
                    ? inspections.OrderByDescending(x => x.OrderItem!.Order!.Customer!.CustCode)
                    : inspections.OrderBy(x => x.OrderItem!.Order!.Customer!.CustCode),

                "custname" => descending
                    ? inspections.OrderByDescending(x => x.OrderItem!.Order!.Customer!.CustName)
                    : inspections.OrderBy(x => x.OrderItem!.Order!.Customer!.CustName),

                "custtypename" => descending
                    ? inspections.OrderByDescending(x => x.OrderItem!.Order!.Customer!.CustType!.ParamName)
                    : inspections.OrderBy(x => x.OrderItem!.Order!.Customer!.CustType!.ParamName),

                "plateno" => descending
                    ? inspections.OrderByDescending(x => x.OrderItem!.Vehicle!.PlateNo)
                    : inspections.OrderBy(x => x.OrderItem!.Vehicle!.PlateNo),

                "brand" => descending
                    ? inspections.OrderByDescending(x => x.OrderItem!.Vehicle!.Brand!.Name)
                    : inspections.OrderBy(x => x.OrderItem!.Vehicle!.Brand!.Name),

                "model" => descending
                    ? inspections.OrderByDescending(x => x.OrderItem!.Vehicle!.Model!.Name)
                    : inspections.OrderBy(x => x.OrderItem!.Vehicle!.Model!.Name),

                "variant" => descending
                    ? inspections.OrderByDescending(x => x.OrderItem!.Vehicle!.Variant!.Name)
                    : inspections.OrderBy(x => x.OrderItem!.Vehicle!.Variant!.Name),

                "inspectorname" => descending
                    ? inspections.OrderByDescending(x => context.InspectionOrderAssignments
                        .Where(a => a.OrderId == x.OrderItem!.OrderId && a.EndedAt == null)
                        .Select(a => a.Inspector!.DisplayName)
                        .FirstOrDefault())
                    : inspections.OrderBy(x => context.InspectionOrderAssignments
                        .Where(a => a.OrderId == x.OrderItem!.OrderId && a.EndedAt == null)
                        .Select(a => a.Inspector!.DisplayName)
                        .FirstOrDefault()),

                "lastactivityat" => descending
                    ? inspections.OrderByDescending(x => x.OrderItem!.Order!.UpdatedAt ?? x.OrderItem!.Order!.CreatedAt)
                    : inspections.OrderBy(x => x.OrderItem!.Order!.UpdatedAt ?? x.OrderItem!.Order!.CreatedAt),

                _ => descending
                    ? inspections.OrderByDescending(x => x.OrderItem!.Order!.UpdatedAt ?? x.OrderItem!.Order!.CreatedAt)
                    : inspections.OrderBy(x => x.OrderItem!.Order!.UpdatedAt ?? x.OrderItem!.Order!.CreatedAt)
            };

            orderedResult = descending
                ? orderedResult.ThenByDescending(x => x.Id)
                : orderedResult.ThenBy(x => x.Id);

            // 5. Projection ke DTO.
            var page = Math.Max(1, query.Page);
            var pageSize = Math.Clamp(query.PageSize, 1, 100);

            var items = await orderedResult
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new InspectionListDto
                {
                    Id = x.Id,
                    OrderNo = x.OrderItem!.Order!.OrderNo,
                    InspectionNo = x.InspectionNo,
                    StatusId = x.OrderItem!.Order!.StatusId,
                    StatusName = x.OrderItem!.Order!.Status!.ParamName,
                    ScheduleAt = x.OrderItem!.Order!.ScheduleAt,
                    CustomerCode = x.OrderItem!.Order!.Customer!.CustCode,
                    CustomerName = x.OrderItem!.Order!.Customer!.CustName,
                    CustomerType = x.OrderItem!.Order!.Customer!.CustType!.ParamCode,
                    PlateNo = x.OrderItem!.Vehicle!.PlateNo,
                    Brand = x.OrderItem!.Vehicle!.Brand!.Name,
                    Model = x.OrderItem!.Vehicle!.Model!.Name,
                    Variant = x.OrderItem!.Vehicle!.Variant!.Name,
                    LastActivityAt = x.OrderItem!.Order!.UpdatedAt ?? x.OrderItem!.Order!.CreatedAt,
                    LastActivityBy = x.OrderItem!.Order!.UpdatedBy ?? x.OrderItem!.Order!.CreatedBy,
                    LastActivityNote = x.OrderItem!.Order!.UpdatedNote ?? x.OrderItem!.Order!.CreatedNote,
                    InspectorName = context.InspectionOrderAssignments
                        .Where(a => a.OrderId == x.OrderItem!.OrderId && a.EndedAt == null)
                        .Select(a => a.Inspector!.DisplayName)
                        .FirstOrDefault() ?? "",

                    InspectorUsername = context.InspectionOrderAssignments
                        .Where(a => a.OrderId == x.OrderItem!.OrderId && a.EndedAt == null)
                        .Select(a => a.InspectorUsername)
                        .FirstOrDefault() ?? "",

                })
                .ToListAsync(ct);

            return (items, totalItems);
        }

        public async Task<InspectionEn?> GetScoring(long id, CancellationToken ct)
        {
            //return await context.Inspections
        }
    }
}
