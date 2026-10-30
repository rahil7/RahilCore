namespace RahilCore.Domain.Entities
{
    public class UserEn
    {
        public Guid Id { get; set; }

        public string Username { get; set; } = string.Empty;

        public string UsernameNormalized { get; set; } = string.Empty;

        public string PasswordHash { get; set; } = string.Empty;

        public string DisplayName { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAtUtc { get; set; }
    }
}
