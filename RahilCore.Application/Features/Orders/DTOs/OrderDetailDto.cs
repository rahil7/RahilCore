namespace RahilCore.Application.Features.Orders.DTOs
{
    public sealed class OrderDetailDto
    {
        public long Id { get; set; }
        public string OrderNo { get; set; } = string.Empty;

        public long StatusId { get; set; }
        public string Status { get; set; } = string.Empty;

        public long PaymentStatusId { get; set; }
        public string PaymentStatus { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;

        public bool IsAssigned { get; set; }

        public string? PicName { get; set; }
        public string? PicPhone { get; set; }

        public long InspectionFormId { get; set; }
        public string InspectionForm { get; set; } = string.Empty;
        public DateTime ScheduleAt { get; set; }
        public string? Note { get; set; }

        public OrderCustomerDto? Customer { get; set; }

        public List<OrderVehicleDto> Vehicles { get; set; } = [];

        public OrderPaymentDto? Payment { get; set; }

        public OrderAssignmentDto? Assignment { get; set; }

        public List<OrderActivityDto> Activities { get; set; } = [];
    }

    public sealed class OrderCustomerDto
    {
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
    }

    public sealed class OrderVehicleDto
    {
        public string PlateNo { get; set; } = string.Empty;
        
        public long BrandId { get; set; }
        public string Brand { get; set; } = string.Empty;
        
        public long ModelId { get; set; }
        public string Model { get; set; } = string.Empty;

        public long VariantId { get; set; }
        public string Variant { get; set; } = string.Empty;

        public int YearOfManufacture { get; set; }

        public long ExteriorColorId { get; set; }
        public string ExteriorColor { get; set; } = string.Empty;
    }

    public sealed class OrderPaymentDto
    {
        public long PaymentId { get; set; }
        public long PaymentMethodId { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public decimal SubtotalAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime PaymentDate { get; set; }
        public string? ReferenceNo { get; set; }
        public string PaymentNote { get; set; } = string.Empty;
    }

    public sealed class OrderAssignmentDto
    {
        public string InspectorCode { get; set; } = string.Empty;
        public string InspectorName { get; set; } = string.Empty;
        public DateTime ScheduleAt { get; set; }
        public DateTime AssignedAt { get; set; }
        public string AssignedBy { get; set; } = string.Empty;
        public string AssignedNote { get; set; } = string.Empty;
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
