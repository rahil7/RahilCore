using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RahilCore.Domain.Entities;

namespace RahilCore.Infrastructure.Persistence.Configurations.Users
{
    public sealed class UserConfiguration : IEntityTypeConfiguration<UserEn>
    {
        public void Configure(EntityTypeBuilder<UserEn> builder)
        {
            builder.ToTable("users","public");

            builder.HasKey(user => user.Id);

            builder.Property(user => user.Id)
                .HasColumnName("id")
                .HasDefaultValueSql("gen_random_uuid()");

            builder.Property(user => user.Username)
                .HasColumnName("username")
                .HasMaxLength(50)
                .IsRequired();

            builder.Property(user => user.UsernameNormalized)
                .HasColumnName("username_normalized")
                .HasMaxLength(50)
                .IsRequired();

            builder.Property(user => user.PasswordHash)
                .HasColumnName("password_hash")
                .IsRequired();

            builder.Property(user => user.DisplayName)
                .HasColumnName("display_name")
                .HasMaxLength(150)
                .IsRequired();

            builder.Property(user => user.IsActive)
                .HasColumnName("is_active")
                .HasDefaultValue(true)
                .IsRequired();

            builder.Property(user => user.CreatedAtUtc)
                .HasColumnName("created_at_utc")
                .HasDefaultValueSql("NOW()")
                .IsRequired();

            builder.HasIndex(user => user.UsernameNormalized)
                .IsUnique()
                .HasDatabaseName("uq_users_username_normalized");
        }
    }
}
