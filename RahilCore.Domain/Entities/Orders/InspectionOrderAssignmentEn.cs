using RahilCore.Domain.Entities.Common;

namespace RahilCore.Domain.Entities.Orders
{
    public sealed class InspectionOrderAssignmentEn : BaseTransactionEntity
    {
        public long OrderId { set; get; }

        public string InspectorUsername { set; get; } = null!;
        public UserEn? Inspector { set; get; }

        public long StatusId { set; get; }
        public MasterParameterEn? Status { set; get; }

        public DateTime AssignedAt { set; get; }
        public DateTime? EndedAt { set; get; }
    }
}
