namespace RahilCore.Domain.Entities
{
    public class VehicleEn : BaseTransactionEntity
    {
        public long CustomerId { get; set; }
        public CustomerEn? Customer { get; set; }

        public string? PlateNo { get; set; }

        public long? BrandId { get; set; }
        public MasterBrandEn? Brand { get; set; }

        public long? ModelId { get; set; }
        public MasterModelEn? Model { get; set; }

        public long? VariantId { get; set; }
        public MasterVariantEn? Variant { get; set; }

        public long? BodyTypeId { get; set; }
        public MasterParameterEn? BodyType { get; set; }

        public long? ExteriorColorId { get; set; }
        public MasterColorEn? ExteriorColor { get; set; }

        public long? InteriorColorId { get; set; }
        public MasterColorEn? InteriorColor { get; set; }

        public long? InteriorMaterialId { get; set; }
        public MasterParameterEn? InteriorMaterial { get; set; }

        public int? YearOfManufacture { get; set; }
        public string? Vin { get; set; }
        public string? EngineNo { get; set; }
        public DateOnly? TaxExpiryDate { get; set; }
        public decimal? Odometer { get; set; }

        public long? FuelTypeId { get; set; }
        public MasterParameterEn? FuelType { get; set; }

        public long? TransmissionId { get; set; }
        public MasterParameterEn? Transmission { get; set; }

        public decimal? EngineCapacity { get; set; }

        public long? OwnershipTypeId { get; set; }
        public MasterParameterEn? OwnershipType { get; set; }

        public bool FirstOwnership { get; set; }
    }
}
