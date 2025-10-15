using System;
using System.Linq;
using Application.Core;
using Application.Interface;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profile.Commands;

public class DeletePhoto
{
    public class Commands : IRequest<Result<Unit>>
    {
        public required string PhotoId { get; set; }
    }
    public class Handler(AppDbContext context, IUserAccessor userAccessor, IPhotoService photoService) : IRequestHandler<Commands, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Commands request, CancellationToken cancellationToken)
        {
            var userId = userAccessor.GetUserId();
            var user = await context.Users
                .Include(x => x.Photos)
                .FirstOrDefaultAsync(x => x.Id == userId, cancellationToken)
                ?? throw new UnauthorizedAccessException("No user is logged in");

            var photo = user.Photos.FirstOrDefault(x => x.Id == request.PhotoId);

            if (photo is null) 
            {
                return Result<Unit>.Failure("Photo not found", 404);
            }
            if (user.ImageUrl == photo.Url)
            {
               return Result<Unit>.Failure("Can not delete main Photo", 404);
            }
            await photoService.DeletePhoto(photo.PublicId);

            user.Photos.Remove(photo);
            context.Photos.Remove(photo);
            var result = await context.SaveChangesAsync(cancellationToken) > 0;
            return result
                ? Result<Unit>.Success(Unit.Value)
                : Result<Unit>.Failure("Problem deleting photo", 500);
        }
    }
}
