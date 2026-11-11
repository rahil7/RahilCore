using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RahilCore.Domain.Entities.Inspections;
using RahilCore.Infrastructure.Persistence.Configurations.Common;

namespace RahilCore.Infrastructure.Persistence.Configurations.Inspections
{
    public sealed class InspectionOrderItemConfiguration : BaseAuditCreatedEntityConfiguration<InspectionOrderItemEn>
    {
        public override void Configure(EntityTypeBuilder<InspectionOrderItemEn> builder)
        {
            base.Configure(builder);
            builder.ToTable("inspection_order_items", "public");

            builder.Property(x => x.OrderId)
                .HasColumnName("order_id");
            builder.HasOne(x => x.Order)
                .WithMany()
                .HasForeignKey(x => x.OrderId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.VehicleId)
                .HasColumnName("vehicle_id");
            builder.HasOne(x => x.Vehicle)
                .WithMany()
                .HasForeignKey(x => x.VehicleId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.InspectionFormId)
                .HasColumnName("inspection_form_id");
            builder.HasOne(x => x.InspectionForm)
                .WithMany()
                .HasForeignKey(x => x.InspectionFormId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
