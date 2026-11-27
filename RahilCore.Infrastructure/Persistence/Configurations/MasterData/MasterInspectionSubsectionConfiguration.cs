using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RahilCore.Infrastructure.Persistence.Configurations.Common;

namespace RahilCore.Infrastructure.Persistence.Configurations.MasterData
{
    public sealed class MasterInspectionSubsectionConfiguration : BaseMasterEntityConfiguration<MasterInspectionSubsectionEn>
    {
        public override void Configure(EntityTypeBuilder<MasterInspectionSubsectionEn> builder)
        {
            base.Configure(builder);

            builder.ToTable("master_inspection_subsections", "public");

            builder.Property(x => x.Name).HasColumnName("name");
            builder.Property(x => x.Description).HasColumnName("description");
            builder.Property(x => x.SortNo).HasColumnName("sort_no");
        }
    }
}
