using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RahilCore.Domain.Entities.Inspections;
using RahilCore.Infrastructure.Persistence.Configurations.Common;

namespace RahilCore.Infrastructure.Persistence.Configurations.Inspections
{
    public sealed class InspectionResultConfiguration : BaseMasterEntityConfiguration<InspectionResultEn>
    {
        public override void Configure(EntityTypeBuilder<InspectionResultEn> builder)
        {
            base.Configure(builder);

            builder.ToTable("inspection_results", "public");

            builder.Property(x => x.InspectionId).HasColumnName("inspection_id");
            builder.Property(x => x.FormItemId).HasColumnName("form_item_id");
            builder.Property(x => x.Value).HasColumnName("value");
            builder.Property(x => x.Note).HasColumnName("note");
        }
    }
}
