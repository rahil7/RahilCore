using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RahilCore.Domain.Entities.Inspections;
using RahilCore.Infrastructure.Persistence.Configurations.Common;
namespace RahilCore.Infrastructure.Persistence.Configurations.Inspections
{
    public sealed class InspectionConfiguration : BaseAuditCreatedEntityConfiguration<InspectionEn>
    {
        public override void Configure(EntityTypeBuilder<InspectionEn> builder)
        {
            base.Configure(builder);
            builder.ToTable("Inspections");

            builder.Property(x => x.OrderItemId)
                .HasColumnName("order_item_id");

            builder.Property(x => x.InspectionNo)
                .HasColumnName("inspection_no");

            builder.Property(x => x.StartedAt)
                .HasColumnName("started_at");

            builder.Property(x => x.ReceivedAt)
                .HasColumnName("received_at");

            builder.Property(x => x.SubmittedAt)
                .HasColumnName("submitted_at");

            builder.Property(x => x.SubmittedBy)
                .HasColumnName("submitted_by");
        }
    }
}
