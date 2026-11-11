using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RahilCore.Domain.Entities.Inspections;
using RahilCore.Infrastructure.Persistence.Configurations.Common;

namespace RahilCore.Infrastructure.Persistence.Configurations.Inspections
{
    public sealed class InspectionOrderConfiguration : BaseTransactionEntityConfiguration<InspectionOrderEn>
    {
        public override void Configure(EntityTypeBuilder<InspectionOrderEn> builder)
        {
            base.Configure(builder);

            builder.ToTable("inspection_orders", "public");

            builder.Property(x => x.OrderNo)
                .HasColumnName("order_no");

            builder.Property(x => x.CustomerId)
                .HasColumnName("cust_id");

            builder.HasOne(x => x.Customer)
                .WithMany()
                .HasForeignKey(x => x.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.StatusId)
                .HasColumnName("status_id");
            builder.HasOne(x => x.Status)
                .WithMany()
                .HasForeignKey(x => x.StatusId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.PaymentStatusId)
                .HasColumnName("payment_status_id");
            builder.HasOne(x => x.PaymentStatus)
                .WithMany()
                .HasForeignKey(x => x.PaymentStatusId)
                .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
