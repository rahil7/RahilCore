using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RahilCore.Domain.Entities;
using RahilCore.Infrastructure.Persistence.Configurations.Common;

namespace RahilCore.Infrastructure.Persistence.Configurations
{
    public sealed class VehicleConfiguration : BaseTransactionEntityConfiguration<VehicleEn>
    {
        public override void Configure(EntityTypeBuilder<VehicleEn> builder)
        {
            base.Configure(builder);
            
            builder.ToTable("vehicles", "public");
            
            builder.Property(x => x.PlateNo)
                .HasColumnName("plate_no")
                .HasMaxLength(50);

            builder.Property(x => x.BrandId)
                .HasColumnName("brand_id");
            builder.HasOne(x => x.Brand)
                .WithMany()
                .HasForeignKey(x => x.BrandId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.ModelId)
                .HasColumnName("model_id");
            builder.HasOne(x => x.Model)
                .WithMany()
                .HasForeignKey(x => x.ModelId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.VariantId)
                .HasColumnName("variant_id");
            builder.HasOne(x => x.Variant)
                .WithMany()
                .HasForeignKey(x => x.VariantId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.BodyTypeId)
                .HasColumnName("body_type_id");
            builder.HasOne(x => x.BodyType)
                .WithMany()
                .HasForeignKey(x => x.BodyTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.ExteriorColorId)
                .HasColumnName("exterior_color_id");
            builder.HasOne(x => x.ExteriorColor)
                .WithMany()
                .HasForeignKey(x => x.ExteriorColorId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.InteriorColorId)
                .HasColumnName("interior_color_id");
            builder.HasOne(x => x.InteriorColor)
                .WithMany()
                .HasForeignKey(x => x.InteriorColorId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.InteriorMaterialId)
                .HasColumnName("interior_material_id");
            builder.HasOne(x => x.InteriorMaterial)
                .WithMany()
                .HasForeignKey(x => x.InteriorMaterialId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.YearOfManufacture)
                .HasColumnName("year_of_manufacture");

            builder.Property(x => x.Vin)
                .HasColumnName("vin")
                .HasMaxLength(250);

            builder.Property(x => x.EngineNo)
                .HasColumnName("engine_no")
                .HasMaxLength(250);

            builder.Property(x => x.TaxExpiryDate)
                .HasColumnName("tax_expiry_date");

            builder.Property(x => x.Odometer)
                .HasColumnName("odometer");

            builder.Property(x => x.FuelTypeId)
                .HasColumnName("fuel_type_id");
            builder.HasOne(x => x.FuelType)
                .WithMany()
                .HasForeignKey(x => x.FuelTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.TransmissionId)
                .HasColumnName("transmission_id");
            builder.HasOne(x => x.Transmission)
                .WithMany()
                .HasForeignKey(x => x.TransmissionId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.EngineCapacity)
                .HasColumnName("engine_capacity");

            builder.Property(x => x.OwnershipTypeId)
                .HasColumnName("ownership_type_id");
            builder.HasOne(x => x.OwnershipType)
                .WithMany()
                .HasForeignKey(x => x.OwnershipTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.FirstOwnership)
                .HasColumnName("first_ownership");
        }
    }
}
