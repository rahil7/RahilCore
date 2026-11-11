using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RahilCore.Domain.Entities.MasterData;
using RahilCore.Infrastructure.Persistence.Configurations.Common;

namespace RahilCore.Infrastructure.Persistence.Configurations.MasterData
{
    public sealed class MasterModelConfiguration : BaseMasterEntityConfiguration<MasterModelEn>
    {
        public override void Configure(EntityTypeBuilder<MasterModelEn> builder)
        {
            base.Configure(builder);

            builder.ToTable("master_models", "public");

            builder.Property(x => x.Name)
                .HasColumnName("name");

            builder.Property(x => x.BrandId)
                .HasColumnName("brand_id");
            builder.HasOne(x => x.Brand)
                .WithMany()
                .HasForeignKey(x => x.BrandId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
