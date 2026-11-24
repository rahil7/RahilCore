using RahilCore.Application.Common.Querying;

namespace RahilCore.Application.Features.Inspections.Queries
{
    public sealed class InspectionListQuery : ListQuery
    {
        public DateOnly? ScheduleFrom { get; set; }

        public DateOnly? ScheduleTo { get; set; }

        public List<long>? CustTypeIds { get; set; }

        public List<long>? StatusIds { get; set; }

        public List<string>? Inspectors { get; set; }
    }
}
