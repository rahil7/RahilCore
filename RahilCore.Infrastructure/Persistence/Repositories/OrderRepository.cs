using Microsoft.EntityFrameworkCore;
using RahilCore.Application.Features.Orders;
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
    }
}
