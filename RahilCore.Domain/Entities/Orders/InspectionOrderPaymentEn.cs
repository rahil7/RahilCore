using RahilCore.Domain.Entities.Common;

namespace RahilCore.Domain.Entities.Orders
{
    public sealed class InspectionOrderPaymentEn : BaseTransactionEntity
    {
        public long OrderId { set; get; }
        public long PaymentMethodId { set; get; }
        public decimal Amount { set; get; }
        public decimal? AmountDiscount { set; get; }
        public long PaymentStatusId { set; get; }
        public DateTime PaymentDate { set; get; }
        public string? ReferenceNo { set; get; }
        public string? FileName { set; get; }
        public string? StorageKey { set; get; }
        public string? FileType { set; get; }
        public long? FileSize { set; get; }
    }
}
