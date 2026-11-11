using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RahilCore.Domain.Entities.MasterData;
using RahilCore.Infrastructure.Persistence.Configurations.Common;

namespace RahilCore.Infrastructure.Persistence.Configurations.MasterData
{
    public sealed class CityConfiguration : BaseMasterEntityConfiguration<CityEn>
    {
        public override void Configure(EntityTypeBuilder<CityEn> builder)
        {
            base.Configure(builder);

            builder.ToTable("master_cities", "public");

            builder.Property(x => x.Code)
                .HasColumnName("code")
                .HasMaxLength(30);

            builder.Property(x => x.Name)
                .HasColumnName("name")
                .HasMaxLength(150)
                .IsRequired();

            builder.Property(x => x.Description)
                .HasColumnName("description");
        }
    }
}
