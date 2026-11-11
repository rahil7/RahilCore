using RahilCore.Domain.Entities.Common;

namespace RahilCore.Domain.Entities.MasterData
{
    public sealed class CityEn : BaseMasterEntity
    {
        public string? Code { get; set; }

        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }
    }
}
