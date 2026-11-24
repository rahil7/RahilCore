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

        public OrderCustomerDto? Customer { get; set; }

        public IReadOnlyList<OrderVehicleDto> Vehicles { get; set; } = [];

        public OrderPaymentDto? Payment { get; set; }

        public OrderAssignmentDto? Assignment { get; set; }

        public IReadOnlyList<OrderActivityDto> Activities { get; set; } = [];
    }

    public sealed class OrderCustomerDto
    {
        public string CustomerCode { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public long customerTypeId { get; set; }
        public string CustomerType { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
    }

    public sealed class OrderVehicleDto
    {
        public long VehicleId { get; set; }
        public string? PlateNo { get; set; }
        public string? Brand { get; set; }
        public string? Model { get; set; }
        public string? Variant { get; set; }
        public int? YearOfManufacture { get; set; }
        public string? ExteriorColor { get; set; }
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

    public sealed class OrderAssignmentDto
    {
        public string InspectorUsername { get; set; } = string.Empty;
        public string InspectorName { get; set; } = string.Empty;
        public DateTime ScheduleAt { get; set; }
        public DateTime AssignedAt { get; set; }
        public string? AssignedBy { get; set; }
        public string? AssignedNote { get; set; }
    }

    public sealed class OrderActivityDto
    {
        public long Id { get; set; }
        public string Action { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
    }
}
