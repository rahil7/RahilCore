using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RahilCore.Domain.Entities;
using RahilCore.Infrastructure.Persistence.Configurations.Common;

namespace RahilCore.Infrastructure.Persistence.Configurations.Customers
{
    public sealed class CustomerConfiguration : BaseEntityConfiguration<CustomerEn>
    {
        public override void Configure(EntityTypeBuilder<CustomerEn> builder)
        {
            base.Configure(builder);

            builder.ToTable("customers", "public");

            builder.Property(x => x.CustTypeId)
                .HasColumnName("cust_type_id");

            builder.HasOne(x => x.CustType)
                .WithMany()
                .HasForeignKey(x => x.CustTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.CustCode)
                .HasColumnName("cust_code")
                .HasMaxLength(30)
                .IsRequired();

            builder.Property(x => x.CustName)
                .HasColumnName("cust_name")
                .HasMaxLength(150)
                .IsRequired();

            builder.Property(x => x.Email)
                .HasColumnName("email")
                .HasMaxLength(254);

            builder.Property(x => x.Phone)
                .HasColumnName("phone")
                .HasMaxLength(30);

            builder.Property(x => x.CityId)
                .HasColumnName("city_id");

            builder.HasOne(x => x.City)
                .WithMany()
                .HasForeignKey(x => x.CityId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.Address)
                .HasColumnName("address");
        }
    }
}
