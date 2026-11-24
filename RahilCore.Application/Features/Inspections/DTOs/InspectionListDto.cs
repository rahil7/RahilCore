namespace RahilCore.Application.Features.Inspections.DTOs
{
    public sealed class InspectionListDto
    {
        public long Id { get; set; }

        public string? OrderNo { get; set; }
        public string? InspectionNo { get; set; }

        public long StatusId { get; set; }
        public string? StatusName { get; set; }

        public string? InspectorUsername { get; set; }
        public string? InspectorName { get; set; }

        public DateTime? ScheduleAt { get; set; }

        public string? CustomerCode { get; set; }
        public string? CustomerName { get; set; }
        public string? CustomerType { get; set; }

        public string? PlateNo { get; set; }
        public string? Brand { get; set; }
        public string? Model { get; set; }
        public string? Variant { get; set; }

        public DateTime LastActivityAt { get; set; }
        public string? LastActivityBy { get; set; }
        public string? LastActivityNote { get; set; }
    }
}
