using Microsoft.EntityFrameworkCore;
using RahilCore.Application.Common.Constants;
using RahilCore.Application.Common.Exceptions;
using RahilCore.Application.Common.Helpers;
using RahilCore.Application.Features.Orders;
using RahilCore.Application.Features.Orders.DTOs;
using RahilCore.Application.Features.Orders.Queries;
using RahilCore.Domain.Entities.Orders;
using RahilCore.Infrastructure.Persistence.DbContext;

namespace RahilCore.Infrastructure.Persistence.Repositories
{
    public class OrderRepository(RahilCoreDbContext context) : IOrderRepository
    {
        public void Add(InspectionOrderEn order)
        {
            context.InspectionOrders.Add(order);
        }

        public void Add(InspectionOrderItemEn orderItems)
        {
            context.InspectionOrderItems.Add(orderItems);
        }

        public void AddAssignment(InspectionOrderAssignmentEn assignment)
        {
            context.InspectionOrderAssignments.Add(assignment);
        }

        public void AddItemRange(IEnumerable<InspectionOrderItemEn> items)
        {
            context.InspectionOrderItems.AddRange(items);
        }

        public void AddPayment(InspectionOrderPaymentEn payment)
        {
            context.InspectionOrderPayments.Add(payment);
        }

        public async Task<bool> ExistsAssignment(long id, string inspectorUsername, CancellationToken ct)
        {
            return await context.InspectionOrderAssignments.AnyAsync(x => 
                x.OrderId == id && 
                x.InspectorUsername == inspectorUsername, 
                ct);
        }

        public async Task<bool> ExistsPaymentAsync(long orderId, CancellationToken ct = default)
        {
            return await context.InspectionOrderPayments.AnyAsync(x => x.OrderId == orderId, ct);
        }

        public async Task<string> GenerateOrderNoAsync(long custType, CancellationToken ct = default)
        {
            var prefix = custType switch
            {
                CustomerType.DEALER => "ORDS",
                CustomerType.CUSTOMER => "ORDC",
                _ => throw new BusinessException(400, "Invalid customer type.")
            };

            const string sql = """
        SELECT @prefix || TO_CHAR(CURRENT_DATE, 'YYMMDD') || seq::text AS "Value"
        FROM (
            SELECT nextval('inspection_order_no_seq') AS seq
        ) s
        """;

            return await context.Database
                .SqlQueryRaw<string>(sql,
                    new Npgsql.NpgsqlParameter("prefix", prefix))
                .SingleAsync(ct);
        }

        public async Task<string> GenerateInspectionNo(long custType,CancellationToken ct = default)
        {
            var prefix = custType switch
            {
                CustomerType.DEALER => "IPS",
                CustomerType.CUSTOMER => "IPC",
                _ => throw new BusinessException(400, "Invalid customer type.")
            };

            const string sql = """
        SELECT
            @prefix
            || TO_CHAR(CURRENT_DATE, 'YYMMDD')
            || LPAD(seq::text, 5, '0') AS "Value"
        FROM (
            SELECT nextval('inspection_no_seq') AS seq
        ) s
        """;

            return await context.Database
                .SqlQueryRaw<string>(
                    sql,
                    new Npgsql.NpgsqlParameter("prefix", prefix))
                .SingleAsync(ct);
        }

        public async Task<InspectionOrderAssignmentEn?> GetActiveAssignment(long orderId, CancellationToken ct = default)
        {
            return await context.InspectionOrderAssignments
                .Include(x => x.Inspector)
                .Include(x => x.Status)
                .FirstOrDefaultAsync(x => 
                    x.OrderId == orderId &&
                    x.StatusId == AssignmentStatus.ASSIGNED,
                    ct);
        }

        public async Task<InspectionOrderAssignmentEn?> GetAssignment(long orderId, string inspectorUsername, CancellationToken ct = default)
        {
            return await context.InspectionOrderAssignments
                .FirstOrDefaultAsync(x => 
                    x.OrderId == orderId && 
                    x.InspectorUsername == inspectorUsername,
                    ct);
        }

        public async Task<InspectionOrderEn?> GetByIdAsync(long id, CancellationToken ct = default)
        {
            return await context.InspectionOrders
                .Include(x => x.Customer)
                .Include(x => x.Status)
                .Include(x => x.PaymentStatus)
                .FirstOrDefaultAsync(x => x.Id == id, ct);
        }

        public async Task<InspectionOrderItemEn?> GetOrderItemByOrderId(long orderId, CancellationToken ct = default)
        {
            return await context.InspectionOrderItems.FirstOrDefaultAsync(x => x.OrderId == orderId, ct);
        }

        public async Task<(IReadOnlyList<OrderListDto> Items, int TotalItems)> GetPagedAsync(GetOrderListQuery query, CancellationToken ct = default)
        {
            var orders = context.InspectionOrders
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
            var createdFrom = DateTimeHelper.JakartaToUtc(query.CreatedFrom!.Value);
            orders = orders.Where(x => x.CreatedAt >= createdFrom);

            var createdTo = DateTimeHelper.JakartaToUtc(query.CreatedTo!.Value.AddDays(1));
            orders = orders.Where(x => x.CreatedAt < createdTo);

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
                    CreatedBy = x.CreatedBy ?? string.Empty,
                    CreatedNote = x.CreatedNote,
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

        public async Task<InspectionOrderPaymentEn?> GetPaymentByIdAsync(long paymentId, CancellationToken ct)
        {
            return await context.InspectionOrderPayments.FirstOrDefaultAsync(x => x.Id == paymentId, ct);
        }

        public async Task<bool> HasSubmittedInspectionAsync(long orderId, CancellationToken ct = default)
        {
            return await context.Inspections
                .AnyAsync(x => 
                    x.OrderItem!.OrderId == orderId && 
                    x.SubmittedAt != null,
                    ct);
        }
    }
}
