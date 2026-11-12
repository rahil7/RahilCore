using RahilCore.Application.Common.DTOs;

namespace RahilCore.Application.Features.Orders.DTOs
{
    public sealed class OrderListDto : BaseAuditDto
    {
        public string OrderNo { get; set; } = null!;

        public long StatusId { get; set; }
        public string StatusName { get; set; } = null!;

        public long PaymentStatusId { get; set; }
        public string? PaymentStatusName { get; set; }

        public string CustomerCode { get; set; } = null!;
        public string CustomerName { get; set; } = null!;
        public string CustomerType { get; set; } = null!;

        public long TotalUnit { get; set; }
    }
}
