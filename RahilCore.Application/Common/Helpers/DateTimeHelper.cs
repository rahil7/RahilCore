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

        public static DateTime JakartaToUtc(DateTime dateTime)
        {
            var jakartaTime = DateTime.SpecifyKind(
                dateTime,
                DateTimeKind.Unspecified);

            var jakartaZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Jakarta");

            return TimeZoneInfo.ConvertTimeToUtc(jakartaTime, jakartaZone);
        }
    }
}
