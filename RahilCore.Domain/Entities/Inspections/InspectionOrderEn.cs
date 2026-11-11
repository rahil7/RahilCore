using RahilCore.Domain.Entities.Common;
using RahilCore.Domain.Entities.Customers;
using System.Globalization;

namespace RahilCore.Domain.Entities.Inspections
{
    public sealed class InspectionOrderEn : BaseTransactionEntity
    {
        public string OrderNo { get; set; } = null!;

        public long CustomerId { get; set; }
        public CustomerEn? Customer { get; set; }

        public long StatusId { get; set; }
        public MasterParameterEn? Status { get; set; }

        public long PaymentStatusId { get; set; }
        public MasterParameterEn? PaymentStatus { get; set; }

        public long TotalUnit { get; set; }

        public bool CustPresent { get; set; }

        public string? PicName { get; set; }
        public string? PicPhone { get; set; }
    }
}
