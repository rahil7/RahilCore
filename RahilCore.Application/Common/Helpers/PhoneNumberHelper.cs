using PhoneNumbers;

namespace RahilCore.Application.Common.Helpers
{
    public static class PhoneNumberHelper
    {
        private static readonly PhoneNumberUtil PhoneUtil =
            PhoneNumberUtil.GetInstance();

        public static string Normalize(string phone, string defaultRegion = "ID")
        {
            if (string.IsNullOrWhiteSpace(phone))
                throw new ArgumentException("Phone number wajib diisi.");

            try
            {
                var number = PhoneUtil.Parse(phone.Trim(), defaultRegion);

                if (!PhoneUtil.IsValidNumber(number))
                    throw new ArgumentException("Phone number tidak valid.");

                return PhoneUtil.Format(number, PhoneNumberFormat.E164)
                    .TrimStart('+');
            }
            catch (NumberParseException)
            {
                throw new ArgumentException("Phone number tidak valid.");
            }
        }
    }
}
