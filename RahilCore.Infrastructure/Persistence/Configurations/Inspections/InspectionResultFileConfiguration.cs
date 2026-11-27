using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RahilCore.Domain.Entities.Inspections;
using RahilCore.Infrastructure.Persistence.Configurations.Common;

namespace RahilCore.Infrastructure.Persistence.Configurations.Inspections
{
    public sealed class InspectionResultFileConfiguration : BaseMasterEntityConfiguration<InspectionResultFileEn>
    {
        public override void Configure(EntityTypeBuilder<InspectionResultFileEn> builder)
        {
            base.Configure(builder);

            builder.ToTable("inspection_result_files", "public");

            builder.Property(x => x.ResultId).HasColumnName("result_id");
            builder.Property(x => x.FileName).HasColumnName("file_name");
            builder.Property(x => x.ObjectKey).HasColumnName("object_key");
            builder.Property(x => x.ContentType).HasColumnName("content_type");
            builder.Property(x => x.FileSize).HasColumnName("file_size");
            builder.Property(x => x.SortNo).HasColumnName("sort_no");
        }
    }
}
