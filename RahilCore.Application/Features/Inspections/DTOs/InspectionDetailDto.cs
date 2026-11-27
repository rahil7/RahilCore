using RahilCore.Application.Common.DTOs;

namespace RahilCore.Application.Features.Inspections.DTOs
{
    public class InspectionDetailDto
    {
        public long InspectionId { get; set; }
        public string InspectionNo { get; set; } = string.Empty;

        public long OrderId { get; set; }
        public string OrderNo { get; set; } = string.Empty;

        public long StatusId { get; set; }
        public string StatusName { get; set; } = string.Empty;

        public string? PicName { get; set; }
        public string? PicPhone { get; set; }

        public long InspectionFormId { get; set; }
        public string InspectionFormName { get; set; } = string.Empty;
        public DateTime ScheduleAt { get; set; }

        public DateTime CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public string? CreatedNote { get; set; }

        public DateTime LastActivityAt { get; set; }
        public string? LastActivityBy { get; set; }
        public string? LastActivityNote { get; set; }

        public BaseCustomerDto? Customer { get; set; }

        public BaseAssignmentDto? Assignment { get; set; }

        public InspectionVehicleDto? Vehicle { get; set; }

        public IReadOnlyList<BaseActivityDto> Activities { get; set; } = [];
    }

    public sealed class InspectionVehicleDto : BaseVehicleDto
    {
        public long? BrandId { get; set; }
        public long? ModelId { get; set; }
        public long? VariantId { get; set; }
        public long? ExteriorColorId { get; set; }
        public long? BodyTypeId { get; set; }
        public long? InteriorColorId { get; set; }
        public long? InteriorMaterialId { get; set; }
        public long? FuelTypeId { get; set; }
        public long? TransmissionId { get; set; }
        public long? OwnershipTypeId { get; set; }

    }
}
