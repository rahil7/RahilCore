namespace RahilCore.Application.Common.Helpers
{
    public static class DateTimeHelper
    {
        private static readonly TimeZoneInfo JakartaTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Jakarta");

        public static DateTime JakartaToUtc(DateOnly date)
        {
            var jakartaDate = DateTime.SpecifyKind(
                date.ToDateTime(TimeOnly.MinValue),
                DateTimeKind.Unspecified);

            return TimeZoneInfo.ConvertTimeToUtc(
                jakartaDate,
                JakartaTimeZone);
        }
    }
}
