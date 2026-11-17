using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RahilCore.Domain.Entities.Orders;
using RahilCore.Infrastructure.Persistence.Configurations.Common;

namespace RahilCore.Infrastructure.Persistence.Configurations.Orders
{
    public sealed class InspectionOrderAssignmentConfiguration : BaseTransactionEntityConfiguration<InspectionOrderAssignmentEn>
    {
        public override void Configure(EntityTypeBuilder<InspectionOrderAssignmentEn> builder)
        {
            base.Configure(builder);

            builder.ToTable("inspection_assignments", "public");

            builder.Property(x => x.OrderId).HasColumnName("order_id");
            
            builder.Property(x => x.InspectorUsername).HasColumnName("inspector_id");
            builder.HasOne(x => x.Inspector)
                .WithMany()
                .HasForeignKey(x => x.InspectorUsername)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.StatusId).HasColumnName("status_id");
            builder.HasOne(x => x.Status)
                .WithMany()
                .HasForeignKey(x => x.StatusId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.AssignedAt).HasColumnName("assigned_at");
            builder.Property(x => x.EndedAt).HasColumnName("ended_at");
        }
    }
}
