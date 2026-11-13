using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RahilCore.Domain.Entities;
using RahilCore.Infrastructure.Persistence.Configurations.Common;

namespace RahilCore.Infrastructure.Persistence.Configurations.Inspections
{
    public class MasterInspectionFormConfiguration : BaseMasterEntityConfiguration<MasterInspectionFormEn>
    {
        public override void Configure(EntityTypeBuilder<MasterInspectionFormEn> builder)
        {
            base.Configure(builder);

            builder.ToTable("master_inspection_form", "public");
            
            builder.Property(e => e.Code)
                .HasColumnName("code");

            builder.Property(e => e.Name)
                .HasColumnName("name");

            builder.Property(e => e.Description)
                .HasColumnName("description");
        }
    }
}
