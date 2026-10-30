namespace RahilCore.Application.Common.Exceptions
{
    public sealed class BusinessException : Exception
    {
        public int StatusCode { get; }

        public BusinessException(int statusCode, string message)
            : base(message)
        {
            StatusCode = statusCode;
        }
    }
}
