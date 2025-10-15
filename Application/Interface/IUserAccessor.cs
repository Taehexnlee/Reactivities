using System;
using Domain;

namespace Application.Interface;

public interface IUserAccessor
{
    string GetUserId();
    Task<User> GetUserAsync();
    Task<User> GetUserWithPhotoAsync();

}
