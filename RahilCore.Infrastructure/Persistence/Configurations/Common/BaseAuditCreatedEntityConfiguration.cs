using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RahilCore.Domain.Entities.Common;

namespace RahilCore.Infrastructure.Persistence.Configurations.Common
{
    public abstract class BaseAuditCreatedEntityConfiguration<T> : IEntityTypeConfiguration<T> where T : BaseAuditCreatedEntity
    {
        public virtual void Configure(EntityTypeBuilder<T> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();

            builder.Property(x => x.CreatedAt)
                .HasColumnName("created_at")
                .HasColumnType("timestamp with time zone");

            builder.Property(x => x.CreatedNote)
                .HasColumnName("created_note");

            builder.Property(x => x.CreatedBy)
                .HasColumnName("created_by");
        }
    }
}
