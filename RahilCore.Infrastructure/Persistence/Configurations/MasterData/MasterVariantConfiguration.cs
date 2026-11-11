using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RahilCore.Domain.Entities.MasterData;
using RahilCore.Infrastructure.Persistence.Configurations.Common;

namespace RahilCore.Infrastructure.Persistence.Configurations.MasterData
{
    public class MasterVariantConfiguration : BaseMasterEntityConfiguration<MasterVariantEn>
    {
        public override void Configure(EntityTypeBuilder<MasterVariantEn> builder)
        {
            base.Configure(builder);

            builder.ToTable("master_variants", "public");

            builder.Property(x => x.Name)
                .HasColumnName("name");

            builder.Property(x => x.BrandId)
                .HasColumnName("brand_id");
            builder.HasOne(x => x.Brand)
                .WithMany()
                .HasForeignKey(x => x.BrandId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.ModelId)
                .HasColumnName("model_id");
            builder.HasOne(x => x.Model)
                .WithMany()
                .HasForeignKey(x => x.ModelId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
