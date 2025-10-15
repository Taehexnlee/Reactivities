using System;
using Application.Profile.Dtos;
using Microsoft.AspNetCore.Http;

namespace Application.Interface;

public interface IPhotoService
{
    Task<PhotoUploadResult?> UploadPhoto(IFormFile file);
    Task<string> DeletePhoto(string publicId);
}
