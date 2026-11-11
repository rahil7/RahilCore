using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RahilCore.Domain.Entities.MasterData;
using RahilCore.Infrastructure.Persistence.Configurations.Common;

namespace RahilCore.Infrastructure.Persistence.Configurations.MasterData
{
    public sealed class MasterBrandConfiguration : BaseMasterEntityConfiguration<MasterBrandEn>
    {
        public override void Configure(EntityTypeBuilder<MasterBrandEn> builder)
        {
            base.Configure(builder);

            builder.ToTable("master_brands", "public");

            builder.Property(x => x.Name)
                .HasColumnName("name")
                .HasMaxLength(250)
                .IsRequired();

            builder.Property(x => x.CountryOfOriginId)
                .HasColumnName("country_of_origin_id")
                .IsRequired();

            builder.HasOne(x => x.CountryOfOrigin)
                .WithMany()
                .HasForeignKey(x => x.CountryOfOriginId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
