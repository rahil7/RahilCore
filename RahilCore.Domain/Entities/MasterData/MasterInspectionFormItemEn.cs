using RahilCore.Domain.Entities;
using RahilCore.Domain.Entities.Common;
using RahilCore.Domain.Entities.MasterData;

namespace RahilCore.Infrastructure.Persistence.Configurations.MasterData
{
    public class MasterInspectionFormItemEn : BaseMasterEntity
    {
        public long FormId { get; set; }
        public MasterInspectionFormEn? Form { get; set; }

        public long GroupId { get; set; }
        public MasterInspectionGroupEn? Group { get; set; }

        public long SectionId { get; set; }
        public MasterInspectionSectionEn? Section { get; set; }

        public long SubsectionId { get; set; }
        public MasterInspectionSubsectionEn? Subsection { get; set; }

        public long ItemId { get; set; }
        public MasterInspectionItemEn? Item { get; set; }

        public string InputType { get; set; } = null!;
        public string Options { get; set; } = null!;
        public bool IsRequired { get; set; }
        public bool HaveNote { get; set; }
        public bool IsDamaged { get; set; }
        public bool ShowInReport { get; set; }
    }
}
