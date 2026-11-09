namespace RahilCore.Domain.Entities
{
    public sealed class InspectionOrderEn : BaseEntity
    {
        public long OrderNo { get; set; }

        public long CustomerId { get; set; }
        public CustomerEn? Customer { get; set; }

        public long VehicleId { get; set; }
        public VehicleEn? Vehicle { get; set; }

        public long InspectionFormId { get; set; }
        public MasterInspectionFormEn? InspectionForm { get; set; }

        public long StatusId { get; set; }
        public MasterParameterEn? Status { get; set; }

        public long PaymentStatusId { get; set; }
        public MasterParameterEn? PaymentStatus { get; set; }
    }
}
