namespace RahilCore.Application.Common.DTOs
{
    public class BaseAssignmentDto
    {
        public string InspectorUsername { get; set; } = string.Empty;
        public string InspectorName { get; set; } = string.Empty;
        public DateTime ScheduleAt { get; set; }
        public DateTime AssignedAt { get; set; }
        public string? AssignedBy { get; set; }
        public string? AssignedNote { get; set; }
    }
}
