using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RahilCore.Domain.Entities.Orders;
using RahilCore.Infrastructure.Persistence.Configurations.Common;

namespace RahilCore.Infrastructure.Persistence.Configurations.Orders
{
    public sealed class InspectionOrderConfiguration : BaseTransactionEntityConfiguration<InspectionOrderEn>
    {
        public override void Configure(EntityTypeBuilder<InspectionOrderEn> builder)
        {
            base.Configure(builder);

            builder.ToTable("inspection_orders", "public");

            builder.Property(x => x.OrderNo).HasColumnName("order_no");

            builder.Property(x => x.ScheduleAt).HasColumnName("scheduled_at");

            builder.Property(x => x.CustomerId).HasColumnName("cust_id");
            builder.HasOne(x => x.Customer)
                .WithMany()
                .HasForeignKey(x => x.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.StatusId).HasColumnName("status_id");
            builder.HasOne(x => x.Status)
                .WithMany()
                .HasForeignKey(x => x.StatusId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.PaymentStatusId).HasColumnName("payment_status_id");
            builder.HasOne(x => x.PaymentStatus)
                .WithMany()
                .HasForeignKey(x => x.PaymentStatusId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.TotalUnit).HasColumnName("total_unit");
            builder.Property(x => x.CustPresent).HasColumnName("cust_present");
            builder.Property(x => x.PicName).HasColumnName("pic_name");
            builder.Property(x => x.PicPhone).HasColumnName("pic_phone");
            builder.Property(x => x.InvoiceNo).HasColumnName("invoice_no");
            builder.Property(x => x.InvoiceDate).HasColumnName("invoice_date");
            builder.Property(x => x.SubtotalAmount).HasColumnName("subtotal_amount");
            builder.Property(x => x.DiscountAmount).HasColumnName("discount_amount");
            builder.Property(x => x.TotalAmount).HasColumnName("total_amount");
        }
    }
}
