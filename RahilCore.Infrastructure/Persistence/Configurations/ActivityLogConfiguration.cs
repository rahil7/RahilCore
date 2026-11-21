using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RahilCore.Domain.Entities;

namespace RahilCore.Infrastructure.Persistence.Configurations
{
    public sealed class ActivityLogConfiguration : IEntityTypeConfiguration<ActivityLogEn>
    {
        public void Configure(EntityTypeBuilder<ActivityLogEn> builder)
        {
            builder.ToTable("activity_logs", "public");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();

            builder.Property(x => x.OrderId).HasColumnName("order_id");
            builder.Property(x => x.OrderItemId).HasColumnName("order_item_id");
            
            builder.Property(x => x.EntityTypeId).HasColumnName("entity_type_id");
            builder.HasOne(x => x.EntityType)
                .WithMany()
                .HasForeignKey(x => x.EntityTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.EntityId).HasColumnName("entity_id");
            
            builder.Property(x => x.ActionCodeId).HasColumnName("action_code_id");
            builder.HasOne(x => x.ActionCode)
                .WithMany()
                .HasForeignKey(x => x.ActionCodeId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.Description).HasColumnName("description");
            builder.Property(x => x.ActorUsername).HasColumnName("actor_username");
            builder.Property(x => x.Metadata).HasColumnName("metadata").HasColumnType("jsonb");
            builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        }
    }
}
