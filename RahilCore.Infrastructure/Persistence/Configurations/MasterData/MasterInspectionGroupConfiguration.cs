using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RahilCore.Domain.Entities.MasterData;
using RahilCore.Infrastructure.Persistence.Configurations.Common;

namespace RahilCore.Infrastructure.Persistence.Configurations.MasterData
{
    public sealed class MasterInspectionGroupConfiguration : BaseMasterEntityConfiguration<MasterInspectionGroupEn>
    {
        public override void Configure(EntityTypeBuilder<MasterInspectionGroupEn> builder)
        {
            base.Configure(builder);

            builder.ToTable("master_inspection_groups", "public");

            builder.Property(x => x.Name).HasColumnName("name");
            builder.Property(x => x.Description).HasColumnName("description");
            builder.Property(x => x.SortNo).HasColumnName("sort_no");
        }
    }
}
