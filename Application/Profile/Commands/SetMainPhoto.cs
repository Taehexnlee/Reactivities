using System;
using System.Linq;
using Application.Core;
using Application.Interface;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profile.Commands;

public class SetMainPhoto
{
    public class Commands : IRequest<Result<Unit>>
    {
        public required string PhotoId { get; set; }
    }

    public class Handler(AppDbContext context, IUserAccessor userAccessor) : IRequestHandler<Commands, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Commands request, CancellationToken cancellationToken)
        {
            var user = await userAccessor.GetUserWithPhotoAsync();

            var photo = user.Photos.FirstOrDefault(x => x.Id == request.PhotoId);
            if (photo is null)
            {
                return Result<Unit>.Failure("Photo not found", 400);
            }

            user.ImageUrl = photo.Url;

            var success = await context.SaveChangesAsync(cancellationToken) > 0;
            return success
                ? Result<Unit>.Success(Unit.Value)
                : Result<Unit>.Failure("Problem setting main photo", 500);
        }
    }
}
