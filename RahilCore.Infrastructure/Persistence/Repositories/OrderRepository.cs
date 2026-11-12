using Microsoft.EntityFrameworkCore;
using RahilCore.Application.Common.Helpers;
using RahilCore.Application.Features.Orders;
using RahilCore.Application.Features.Orders.DTOs;
using RahilCore.Application.Features.Orders.Queries;
using RahilCore.Domain.Entities.Inspections;
using RahilCore.Infrastructure.Persistence.DbContext;

namespace RahilCore.Infrastructure.Persistence.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly RahilCoreDbContext _context;

        public OrderRepository(RahilCoreDbContext context)
        {
            _context = context;
        }

        public void Add(InspectionOrderEn order)
        {
            _context.InspectionOrders.Add(order);
        }

        public void Add(InspectionOrderItemEn orderItems)
        {
            _context.InspectionOrderItems.Add(orderItems);
        }

        public void AddItemRange(IEnumerable<InspectionOrderItemEn> items)
        {
            _context.InspectionOrderItems.AddRange(items);
        }

        public async Task<string> GenerateOrderNoAsync(CancellationToken ct = default)
        {
            const string sql = """SELECT 'ORD' || TO_CHAR(CURRENT_DATE, 'YYMMDD') || seq::text AS "Value" FROM (SELECT nextval('inspection_order_no_seq') AS seq) s""";

            return await _context.Database
                .SqlQueryRaw<string>(sql)
                .SingleAsync(ct);
        }

        public async Task<(IReadOnlyList<OrderListDto> Items, int TotalItems)> GetPagedAsync(GetOrderListQuery query, CancellationToken ct = default)
        {
            var orders = _context.InspectionOrders
                .AsNoTracking()
                .AsQueryable();

            // 1. Search: hanya satu field per request.
            if (!string.IsNullOrWhiteSpace(query.SearchBy) && !string.IsNullOrWhiteSpace(query.SearchKey))
            {
                var searchKey = $"%{query.SearchKey.Trim()}%";

                orders = query.SearchBy.Trim().ToLowerInvariant() switch
                {
                    "orderno" => orders.Where(x => EF.Functions.ILike(x.OrderNo, searchKey)),

                    "totalunit" => orders.Where(x => EF.Functions.ILike(x.TotalUnit.ToString(), searchKey)),

                    "custcode" => orders.Where(x =>
                        x.Customer != null &&
                        EF.Functions.ILike(x.Customer.CustCode, searchKey)),

                    "custname" => orders.Where(x =>
                        x.Customer != null &&
                        EF.Functions.ILike(x.Customer.CustName, searchKey)),

                    _ => orders
                };
            }

            // 2. Filtering.
            if (query.CreatedFrom.HasValue)
            {
                var createdFrom = DateTimeHelper.JakartaToUtc(query.CreatedFrom.Value);

                orders = orders.Where(x => x.CreatedAt >= createdFrom);
            }

            if (query.CreatedTo.HasValue)
            {
                var createdTo = DateTimeHelper.JakartaToUtc(query.CreatedTo.Value.AddDays(1));

                orders = orders.Where(x => x.CreatedAt < createdTo);
            }

            if (query.CustTypeIds is { Count: > 0 })
            {
                orders = orders.Where(x =>
                    x.Customer != null &&
                    x.Customer.CustType != null &&
                    query.CustTypeIds.Contains(x.Customer.CustType.Id));
            }

            if (query.StatusIds is { Count: > 0 })
            {
                orders = orders.Where(x => query.StatusIds.Contains(x.StatusId));
            }

            if (query.PaymentStatusIds is { Count: > 0 })
            {
                orders = orders.Where(x => query.PaymentStatusIds.Contains(x.PaymentStatusId));
            }

            // 3. Hitung total data setelah filter, sebelum pagination.
            var totalItems = await orders.CountAsync(ct);

            // 4. Sorting.
            var sortBy = string.IsNullOrWhiteSpace(query.SortBy)
                ? OrderQueryMetadata.DefaultSortBy
                : query.SortBy.Trim().ToLowerInvariant();

            var descending = !string.Equals(
                query.SortDirection,
                "asc",
                StringComparison.OrdinalIgnoreCase);

            IOrderedQueryable<InspectionOrderEn> orderedResult = sortBy switch
            {
                "orderno" => descending
                    ? orders.OrderByDescending(x => x.OrderNo)
                    : orders.OrderBy(x => x.OrderNo),

                "totalunit" => descending
                    ? orders.OrderByDescending(x => x.TotalUnit)
                    : orders.OrderBy(x => x.TotalUnit),

                "statusid" => descending
                    ? orders.OrderByDescending(x => x.StatusId)
                    : orders.OrderBy(x => x.StatusId),

                "paymentstatusid" => descending
                    ? orders.OrderByDescending(x => x.PaymentStatusId)
                    : orders.OrderBy(x => x.PaymentStatusId),

                "custcode" => descending
                    ? orders.OrderByDescending(x => x.Customer!.CustCode)
                    : orders.OrderBy(x => x.Customer!.CustCode),

                "custname" => descending
                    ? orders.OrderByDescending(x => x.Customer!.CustName)
                    : orders.OrderBy(x => x.Customer!.CustName),

                "custtypename" => descending
                    ? orders.OrderByDescending(x => x.Customer!.CustType!.ParamName)
                    : orders.OrderBy(x => x.Customer!.CustType!.ParamName),

                "createdat" => descending
                    ? orders.OrderByDescending(x => x.CreatedAt)
                    : orders.OrderBy(x => x.CreatedAt),

                "lastactivityat" => descending
                    ? orders.OrderByDescending(x => x.UpdatedAt ?? x.CreatedAt)
                    : orders.OrderBy(x => x.UpdatedAt ?? x.CreatedAt),

                _ => descending
                    ? orders.OrderByDescending(x => x.UpdatedAt ?? x.CreatedAt)
                    : orders.OrderBy(x => x.UpdatedAt ?? x.CreatedAt)
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
                .Select(x => new OrderListDto
                {
                    Id = x.Id,
                    CreatedAt = x.CreatedAt,
                    LastActivityAt = x.UpdatedAt ?? x.CreatedAt,
                    LastActivityBy = x.UpdatedBy ?? x.CreatedBy ?? string.Empty,
                    LastActivityNote = x.UpdatedNote ?? x.CreatedNote,

                    OrderNo = x.OrderNo,
                    TotalUnit = x.TotalUnit,
                    StatusId = x.StatusId,
                    StatusName = x.Status != null ? x.Status.ParamName : null,
                    PaymentStatusId = x.PaymentStatusId,
                    PaymentStatusName = x.PaymentStatus != null ? x.PaymentStatus.ParamName : null,

                    CustomerCode = x.Customer != null ? x.Customer.CustCode : null,
                    CustomerName = x.Customer != null ? x.Customer.CustName : null,
                    CustomerType = x.Customer != null && x.Customer.CustType != null
                    ? x.Customer.CustType.ParamName
                    : null,
                })
                .ToListAsync(ct);

            return (items, totalItems);
        }
    }
}
