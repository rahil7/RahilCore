using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RahilCore.Domain.Entities;
using RahilCore.Infrastructure.Persistence.Configurations.Common;

namespace RahilCore.Infrastructure.Persistence.Configurations.MasterData
{
    public sealed class MasterParameterConfiguration : BaseMasterEntityConfiguration<MasterParameterEn>
    {
        public override void Configure(EntityTypeBuilder<MasterParameterEn> builder)
        {
            base.Configure(builder);

            builder.ToTable("master_parameters", "public");

            builder.Property(x => x.ParamType)
                .HasColumnName("param_type");

            builder.Property(x => x.ParamCode)
                .HasColumnName("param_code");

            builder.Property(x => x.ParamValue)
                .HasColumnName("param_value");

            builder.Property(x => x.ParamName)
                .HasColumnName("param_name");

            builder.Property(x => x.Description)
                .HasColumnName("description");

            builder.Property(x => x.SortOrder)
                .HasColumnName("sort_order");
        }

    }
}
