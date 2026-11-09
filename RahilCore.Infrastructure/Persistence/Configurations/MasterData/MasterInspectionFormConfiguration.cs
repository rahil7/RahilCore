using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RahilCore.Domain.Entities;
using RahilCore.Infrastructure.Persistence.Configurations.Common;

namespace RahilCore.Infrastructure.Persistence.Configurations.MasterData
{
    public class MasterInspectionFormConfiguration : BaseEntityConfiguration<MasterInspectionFormEn>
    {
        public override void Configure(EntityTypeBuilder<MasterInspectionFormEn> builder)
        {
            base.Configure(builder);

            builder.ToTable("master_inspection_form", "public");
        }
    }
}
