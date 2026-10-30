using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RahilCore.Domain.Entities;
using RahilCore.Infrastructure.Persistence.Configurations.Common;

namespace RahilCore.Infrastructure.Persistence.Configurations.MasterData
{
    public sealed class MasterParameterConfiguration : BaseEntityConfiguration<MasterParameterEn>
    {
        public override void Configure(EntityTypeBuilder<MasterParameterEn> builder)
        {
            base.Configure(builder);

            builder.ToTable("master_parameters", "public");

            builder.Property(x => x.ParamType)
                .HasColumnName("param_type")
                .HasMaxLength(50)
                .IsRequired();

            builder.Property(x => x.ParamCode)
                .HasColumnName("param_code")
                .HasMaxLength(50)
                .IsRequired();

            builder.Property(x => x.ParamName)
                .HasColumnName("param_name")
                .HasMaxLength(100)
                .IsRequired();

            builder.Property(x => x.Description)
                .HasColumnName("description");

            builder.Property(x => x.SortOrder)
                .HasColumnName("sort_order")
                .IsRequired();

            builder.HasIndex(x => new { x.ParamType, x.ParamCode })
                .IsUnique()
                .HasDatabaseName("uq_master_parameters_type_code");
        }

    }
}
