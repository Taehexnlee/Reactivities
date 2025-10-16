using System;
using Application.Core;
using Application.Interface;
using Application.Profile.Dtos;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profile.Queries;

public class GetProfiles
{
    public class Query : IRequest<Result<UserProfile>>
    {
        public required string UserId { get; set; }

    }

    public class Handler(AppDbContext context, IMapper mapper, IUserAccessor userAccessor) : IRequestHandler<Query, Result<UserProfile>>
    {
        public async Task<Result<UserProfile>> Handle(Query request, CancellationToken cancellationToken)
        {
            var profile = await context.Users
                .ProjectTo<UserProfile>(mapper.ConfigurationProvider, new {currentUserId = userAccessor.GetUserId()})
                .SingleOrDefaultAsync(x => x.Id == request.UserId, cancellationToken);

            return profile == null
                ? Result<UserProfile>.Failure("Profile not found", 404)
                : Result<UserProfile>.Success(profile);
        }
    }
}
