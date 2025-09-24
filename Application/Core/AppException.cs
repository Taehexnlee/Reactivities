using System;

namespace Application.Core;

public class AppException(int satusCode, string message, string? details)
{
    public int StatusCode { get; set; } = satusCode;
    public string Message { get; set; } = message;
    public string? Details { get; set; } = details;
}
