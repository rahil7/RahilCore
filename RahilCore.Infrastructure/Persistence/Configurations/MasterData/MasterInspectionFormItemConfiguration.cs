using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RahilCore.Infrastructure.Persistence.Configurations.Common;

namespace RahilCore.Infrastructure.Persistence.Configurations.MasterData
{
    public class MasterInspectionFormItemConfiguration : BaseMasterEntityConfiguration<MasterInspectionFormItemEn>
    {
        public override void Configure(EntityTypeBuilder<MasterInspectionFormItemEn> builder)
        {
            base.Configure(builder);

            builder.ToTable("master_inspection_form_items", "public");

            builder.Property(x => x.FormId).HasColumnName("form_id");
            builder.HasOne(x => x.Form)
                .WithMany()
                .HasForeignKey(x => x.FormId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.GroupId).HasColumnName("group_id");
            builder.HasOne(x => x.Group)
                .WithMany()
                .HasForeignKey(x => x.GroupId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.SectionId).HasColumnName("section_id");
            builder.HasOne(x => x.Section)
                .WithMany()
                .HasForeignKey(x => x.SectionId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.SubsectionId).HasColumnName("subsection_id");
            builder.HasOne(x => x.Subsection)
                .WithMany()
                .HasForeignKey(x => x.SubsectionId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.ItemId).HasColumnName("item_id");
            builder.HasOne(x => x.Item)
                .WithMany()
                .HasForeignKey(x => x.ItemId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.InputType).HasColumnName("input_type");
            builder.Property(x => x.Options).HasColumnName("options").HasColumnType("jsonb");
            builder.Property(x => x.IsRequired).HasColumnName("is_required");
            builder.Property(x => x.HaveNote).HasColumnName("have_note");
            builder.Property(x => x.IsDamaged).HasColumnName("is_damaged");
            builder.Property(x => x.ShowInReport).HasColumnName("show_in_report");
        }
    }
}
