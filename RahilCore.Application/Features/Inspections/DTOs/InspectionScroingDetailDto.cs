using RahilCore.Application.Common.DTOs;

namespace RahilCore.Application.Features.Inspections.DTOs
{
    public sealed class InspectionScroingDetailDto
    {
        public long InspectionId { get; set; }
        public string InspectionNo { get; set; } = string.Empty;

        public long OrderId { get; set; }
        public string OrderNo { get; set; } = string.Empty;

        public long StatusId { get; set; }
        public string StatusName { get; set; } = string.Empty;

        public BaseVehicleDto? Vehicle { get; set; }

        public IReadOnlyList<InspectionScoringGroupDto>? InspectionGroup { set; get; }
    }

    public sealed class InspectionScoringGroupDto : BaseInspectionSectionDto
    {
        public IReadOnlyList<InspectionScoringSectionDto> Sections { get; set; } = [];
    }

    public sealed class InspectionScoringSectionDto : BaseInspectionSectionDto
    {
        public IReadOnlyList<InspectionScoringSubsectionDto> Subsections { get; set; } = [];
    }

    public sealed class InspectionScoringSubsectionDto : BaseInspectionSectionDto
    {
        public IReadOnlyList<InspectionItemDto> Items { get; set; } = [];
    }

    public sealed class InspectionItemDto : BaseInspectionSectionDto
    {
        public string InputType { get; set; } = null!;
        public string Options { get; set; } = null!;
        public bool IsRequired { get; set; }
        public bool HaveNote { get; set; }
        public bool IsDamaged { get; set; }
    }
}
