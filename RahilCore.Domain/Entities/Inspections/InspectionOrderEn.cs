using RahilCore.Domain.Entities.Common;
using RahilCore.Domain.Entities.Customers;

namespace RahilCore.Domain.Entities.Inspections
{
    public sealed class InspectionOrderEn : BaseTransactionEntity
    {
        public long OrderNo { get; set; }

        public long CustomerId { get; set; }
        public CustomerEn? Customer { get; set; }

        public long StatusId { get; set; }
        public MasterParameterEn? Status { get; set; }

        public long PaymentStatusId { get; set; }
        public MasterParameterEn? PaymentStatus { get; set; }
    }
}
