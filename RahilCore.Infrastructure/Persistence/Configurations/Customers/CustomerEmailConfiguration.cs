using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RahilCore.Domain.Entities;
using RahilCore.Infrastructure.Persistence.Configurations.Common;

namespace RahilCore.Infrastructure.Persistence.Configurations.Customers
{
    public sealed class CustomerEmailConfiguration : BaseEntityConfiguration<CustomerEmailEn>
    {
        public override void Configure(EntityTypeBuilder<CustomerEmailEn> builder)
        {
            base.Configure(builder);
            
            builder.ToTable("customer_emails", "public");

            builder.Property(x => x.CustomerId)
                .HasColumnName("cust_id");

            builder.HasOne(x => x.Customer)
                .WithMany()
                .HasForeignKey(x => x.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.Email)
                .HasColumnName("email")
                .HasMaxLength(254)
                .IsRequired();

            builder.Property(x => x.IsPrimary)
                .HasColumnName("is_primary")
                .HasDefaultValue(false);
        }
    }
}
