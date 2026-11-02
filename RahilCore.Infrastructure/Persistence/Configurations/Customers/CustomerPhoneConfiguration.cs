using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RahilCore.Domain.Entities;
using RahilCore.Infrastructure.Persistence.Configurations.Common;

namespace RahilCore.Infrastructure.Persistence.Configurations.Customers
{
    internal class CustomerPhoneConfiguration : BaseEntityConfiguration<CustomerPhoneEn>
    {
        public override void Configure(EntityTypeBuilder<CustomerPhoneEn> builder)
        {
            base.Configure(builder);

            builder.ToTable("customer_phones", "public");

            builder.Property(x => x.CustomerId)
                .HasColumnName("cust_id");

            builder.HasOne(x => x.Customer)
                .WithMany()
                .HasForeignKey(x => x.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.Phone)
                .HasColumnName("phone")
                .HasMaxLength(20)
                .IsRequired();

            builder.Property(x => x.IsPrimary)
                .HasColumnName("is_primary")
                .HasDefaultValue(false);
        }
    }
}
