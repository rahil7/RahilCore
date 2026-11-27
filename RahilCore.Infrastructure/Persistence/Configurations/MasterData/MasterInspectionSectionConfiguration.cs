using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RahilCore.Infrastructure.Persistence.Configurations.Common;

namespace RahilCore.Infrastructure.Persistence.Configurations.MasterData
{
    public sealed class MasterInspectionSectionConfiguration : BaseMasterEntityConfiguration<MasterInspectionSectionEn>
    {
        public override void Configure(EntityTypeBuilder<MasterInspectionSectionEn> builder)
        {
            base.Configure(builder);

            builder.ToTable("master_inspection_sections", "public");

            builder.Property(x => x.Name).HasColumnName("name");
            builder.Property(x => x.Description).HasColumnName("description");
            builder.Property(x => x.SortNo).HasColumnName("sort_no");
        }
    }
}
