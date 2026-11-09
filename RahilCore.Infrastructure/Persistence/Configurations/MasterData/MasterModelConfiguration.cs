using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RahilCore.Domain.Entities;
using RahilCore.Infrastructure.Persistence.Configurations.Common;

namespace RahilCore.Infrastructure.Persistence.Configurations.MasterData
{
    public sealed class MasterModelConfiguration : BaseEntityConfiguration<MasterModelEn>
    {
        public override void Configure(EntityTypeBuilder<MasterModelEn> builder)
        {
            base.Configure(builder);

            builder.ToTable("master_models", "public");

            builder.Property(x => x.Name)
                .HasColumnName("name")
                .HasMaxLength(250)
                .IsRequired();

            builder.Property(x => x.BrandId)
                .HasColumnName("brand_id")
                .IsRequired();

            builder.HasOne(x => x.Brand)
                .WithMany()
                .HasForeignKey(x => x.BrandId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
