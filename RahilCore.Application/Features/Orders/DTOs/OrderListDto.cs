using RahilCore.Application.Common.DTOs;

namespace RahilCore.Application.Features.Orders.DTOs
{
    public sealed class OrderListDto : BaseAuditDto
    {
        public string OrderNo { get; set; } = null!;
        public long TotalUnit { get; set; }

        public long StatusId { get; set; }
        public string? StatusName { get; set; } = null!;

        public long PaymentStatusId { get; set; }
        public string? PaymentStatusName { get; set; }

        public string? CustomerCode { get; set; }
        public string? CustomerName { get; set; }
        public string? CustomerType { get; set; }
    }
}
