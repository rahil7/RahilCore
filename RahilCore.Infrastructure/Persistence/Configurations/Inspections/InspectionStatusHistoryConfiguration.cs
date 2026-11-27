using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RahilCore.Infrastructure.Persistence.Configurations.Common;

namespace RahilCore.Infrastructure.Persistence.Configurations.Inspections
{
    public sealed class InspectionStatusHistoryConfiguration : BaseAuditCreatedEntityConfiguration<InspectionStatusHistoryEn>
    {
        public override void Configure(EntityTypeBuilder<InspectionStatusHistoryEn> builder)
        {
            base.Configure(builder);

            builder.ToTable("inspection_status_histories", "public");

            builder.Property(x => x.InspectionId).HasColumnName("inspection_id");
            builder.Property(x => x.FromStatusId).HasColumnName("from_status_id");
            builder.Property(x => x.ToStatusId).HasColumnName("to_status_id");
        }
    }
}
