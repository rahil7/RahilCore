using System.Text.Json;
using Microsoft.AspNetCore.Diagnostics;
using RahilCore.Application.Common.Exceptions;
using RahilCore.Server.Contracts.Common;

namespace RahilCore.Server.Exceptions;

public sealed class GlobalExceptionHandler(
    ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        int statusCode;
        string message;

        if (exception is BusinessException businessException)
        {
            statusCode = businessException.StatusCode;
            message = businessException.Message;

            logger.LogWarning(
                "Business exception. StatusCode: {StatusCode}, Message: {Message}, TraceId: {TraceId}",
                statusCode,
                message,
                httpContext.TraceIdentifier);
        }
        else
        {
            statusCode = StatusCodes.Status500InternalServerError;
            message = "Terjadi kesalahan pada server.";

            logger.LogError(
                exception,
                "Unhandled exception occurred. TraceId: {TraceId}",
                httpContext.TraceIdentifier);
        }

        httpContext.Response.StatusCode = statusCode;
        httpContext.Response.ContentType = "application/json";

        var response = new ApiResponse<object>(
            Success: false,
            Message: message,
            Data: null);

        await httpContext.Response.WriteAsync(
            JsonSerializer.Serialize(response),
            cancellationToken);

        return true;
    }
}