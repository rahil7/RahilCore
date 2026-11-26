using RahilCore.Application.Common.DTOs;

namespace RahilCore.Application.Features.Orders.DTOs
{
    public sealed class OrderDetailDto
    {
        public long Id { get; set; }
        public string OrderNo { get; set; } = string.Empty;

        public long StatusId { get; set; }
        public string StatusName { get; set; } = string.Empty;

        public long PaymentStatusId { get; set; }
        public string PaymentStatusName { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public string CreatedNote { get; set; } = string.Empty;

        public bool CanCancel { get; set; }
        public bool CanEdit { get; set; }
        public bool CanEditSchedule { get; set; }
        public bool CanAssign { get; set; }
        public bool CanReassign { get; set; }

        public string? PicName { get; set; }
        public string? PicPhone { get; set; }

        public long InspectionFormId { get; set; }
        public string InspectionFormName { get; set; } = string.Empty;
        public DateTime ScheduleAt { get; set; }
        public string? Note { get; set; }

        public BaseCustomerDto? Customer { get; set; }

        public IReadOnlyList<OrderVehicleDto> Vehicles { get; set; } = [];

        public OrderPaymentDto? Payment { get; set; }

        public BaseAssignmentDto? Assignment { get; set; }

        public IReadOnlyList<BaseActivityDto> Activities { get; set; } = [];
    }

    public sealed class OrderVehicleDto : BaseVehicleDto
    {
        public bool CanDelete { get; set; }
    }

    public sealed class OrderPaymentDto
    {
        public long PaymentId { get; set; }
        public long PaymentMethodId { get; set; }
        public string? PaymentMethodName { get; set; }
        public decimal? SubtotalAmount { get; set; }
        public decimal? DiscountAmount { get; set; }
        public decimal? TotalAmount { get; set; }
        public DateTime? PaymentDate { get; set; }
        public string? ReferenceNo { get; set; }
        public bool HasPaymentProof { get; set; }

        public DateTime LastActivityAt { get; set; }
        public string? LastActivityBy { get; set; }
        public string? LastActivityNote { get; set; }
    }
}
