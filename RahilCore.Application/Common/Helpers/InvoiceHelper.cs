using RahilCore.Application.Common.Constants;
using RahilCore.Application.Common.Exceptions;

namespace RahilCore.Application.Common.Helpers
{
    public static class InvoiceHelper
    {
        public static string GenerateInvoiceNo(long custType,long orderId,DateTime invoiceDate)
        {
            var prefix = custType switch
            {
                CustomerType.DEALER => "INIPS",
                CustomerType.CUSTOMER => "INIPC",
                _ => throw new BusinessException(400, "Invalid customer type.")
            };

            var jakartaDate = TimeZoneInfo.ConvertTimeFromUtc(
                DateTime.SpecifyKind(invoiceDate, DateTimeKind.Utc),
                TimeZoneInfo.FindSystemTimeZoneById("Asia/Jakarta"));

            return $"{prefix}{jakartaDate:yyMMdd}-{orderId}";
        }
    }
}
