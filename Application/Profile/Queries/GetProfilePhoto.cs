using System;
using Application.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profile.Queries;

public class GetProfilePhoto
{
    public class Query : IRequest<Result<List<Photo>>>
    {
        public required string UserId { get; set; }
    }

    public class Handler(AppDbContext context) : IRequestHandler<Query, Result<List<Photo>>>
    {
        public async Task<Result<List<Photo>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var photos = await context.Photos
                .Where(x => x.UserId == request.UserId)
                .AsNoTracking()
                .ToListAsync(cancellationToken);
            return Result<List<Photo>>.Success(photos);
        }
    }
}
