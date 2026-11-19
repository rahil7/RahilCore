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
            builder.Property(x => x.EntitiyType).HasColumnName("entity_type");
            builder.Property(x => x.EntitiyId).HasColumnName("entity_id");
            builder.Property(x => x.ActionCode).HasColumnName("action_code");
            builder.Property(x => x.Description).HasColumnName("description");
            builder.Property(x => x.ActorUsername).HasColumnName("actor_username");
            builder.Property(x => x.Metadata).HasColumnName("metadata");
            builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        }
    }
}
