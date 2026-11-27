using RahilCore.Domain.Entities.Common;

namespace RahilCore.Infrastructure.Persistence.Configurations.Inspections
{
    public sealed class InspectionStatusHistoryEn : BaseAuditCreatedEntity
    {
        public long InspectionId { get; set; }
        public long FromStatusId { get; set; }
        public long ToStatusId { get; set; }

    }
}
