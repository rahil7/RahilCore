using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RahilCore.Domain.Entities.MasterData;
using RahilCore.Infrastructure.Persistence.Configurations.Common;

namespace RahilCore.Infrastructure.Persistence.Configurations.MasterData
{
    public class MasterColorConfiguration : BaseMasterEntityConfiguration<MasterColorEn>
    {
        public override void Configure(EntityTypeBuilder<MasterColorEn> builder)
        {
            base.Configure(builder);

            builder.ToTable("master_colors", "public");

            builder.Property(x => x.Code)
                .HasColumnName("code")
                .HasMaxLength(50)
                .IsRequired();

            builder.Property(x => x.Name)
                .HasColumnName("name")
                .HasMaxLength(250)
                .IsRequired();
        }
    }
}
