using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RahilCore.Domain.Entities.Orders;
using RahilCore.Infrastructure.Persistence.Configurations.Common;

namespace RahilCore.Infrastructure.Persistence.Configurations.Orders
{
    public class InspectionOrderPaymentConfiguration : BaseTransactionEntityConfiguration<InspectionOrderPaymentEn>
    {
        public override void Configure(EntityTypeBuilder<InspectionOrderPaymentEn> builder)
        {
            base.Configure(builder);

            builder.ToTable("inspection_order_payments", "public");

            builder.Property(x => x.OrderId).HasColumnName("order_id");
            builder.Property(x => x.PaymentMethodId).HasColumnName("payment_method_id");
            builder.Property(x => x.Amount).HasColumnName("amount");
            builder.Property(x => x.PaymentStatusId).HasColumnName("payment_status_id");
            builder.Property(x => x.PaymentDate).HasColumnName("payment_date");
            builder.Property(x => x.ReferenceNo).HasColumnName("reference_no");
            builder.Property(x => x.FileName).HasColumnName("file_name");
            builder.Property(x => x.StorageKey).HasColumnName("storage_key");
            builder.Property(x => x.FileType).HasColumnName("file_type");
            builder.Property(x => x.FileSize).HasColumnName("file_size");
        }
    }
}
