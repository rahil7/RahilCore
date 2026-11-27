using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RahilCore.Domain.Entities.Inspections;
using RahilCore.Infrastructure.Persistence.Configurations.Common;

namespace RahilCore.Infrastructure.Persistence.Configurations.Inspections
{
    public sealed class InspectionScoringConfiguration : BaseMasterEntityConfiguration<InspectionScoringEn>
    {
        public override void Configure(EntityTypeBuilder<InspectionScoringEn> builder)
        {
            base.Configure(builder);

            builder.ToTable("inspection_scoring", "public");

            builder.Property(x => x.InspectionId).HasColumnName("inspection_id");
            builder.Property(x => x.ScoringNo).HasColumnName("scoring_no");
            builder.Property(x => x.StatusId).HasColumnName("status_id");
            builder.Property(x => x.Score).HasColumnName("score");
            builder.Property(x => x.Grade).HasColumnName("grade");
            builder.Property(x => x.ScoredAt).HasColumnName("scored_at");
            builder.Property(x => x.ScoredBy).HasColumnName("scored_by");
            builder.Property(x => x.ScoredNote).HasColumnName("created_note");
        }
    }
}
