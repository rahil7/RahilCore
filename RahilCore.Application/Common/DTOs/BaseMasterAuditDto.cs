namespace RahilCore.Application.Common.DTOs
{
    public abstract class BaseMasterAuditDto : BaseAuditDto
    {
        public bool IsActive { get; set; }
    }
}
