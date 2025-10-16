using System;
using Application.Activities.DTOs;
using Application.Profile.Dtos;
using AutoMapper;
using Domain;

namespace Application.Core;

public class MappingProfiles : AutoMapper.Profile
{
    public MappingProfiles()
    {
        string? currentUserId = null;
        CreateMap<Activity, Activity>();
        CreateMap<CreateActivityDto, Activity>();
        CreateMap<EditActivityDto, Activity>();
        CreateMap<Activity, ActivityDto>()
                .ForMember(d => d.HostId,
                    opt => opt.MapFrom(s =>
                        s.Attendees
                         .FirstOrDefault(a => a.IsHost)!.User.Id))
                .ForMember(d => d.HostDisplayName,
                    opt => opt.MapFrom(s =>
                        s.Attendees
                        .FirstOrDefault(a => a.IsHost)!.User.DisplayName))

                .ForMember(d => d.Attendees,
                    opt => opt.MapFrom(s => s.Attendees));

        // 참가자 요약: ActivityAttendees -> UserProfile
        CreateMap<ActivityAttendees, UserProfile>()
            .ForMember(d => d.Id, opt => opt.MapFrom(s => s.User.Id))
            .ForMember(d => d.DisplayName, opt => opt.MapFrom(s => s.User.DisplayName))
            .ForMember(d => d.ImageUrl, opt => opt.MapFrom(s => s.User.ImageUrl))
            .ForMember(d => d.Bio, opt => opt.MapFrom(s => s.User.Bio))
            .ForMember(d => d.FollowersCount, o => o.MapFrom(s => s.User.Followers.Count))
            .ForMember(d => d.FollowingCount, o => o.MapFrom(s => s.User.Followings.Count))
            .ForMember(d => d.Following, o => o.MapFrom(s => s.User.Followers.Any(x => x.Observer.Id == currentUserId)));


        CreateMap<User, UserProfile>()
            .ForMember(d => d.FollowersCount, o => o.MapFrom(s => s.Followers.Count))
            .ForMember(d => d.FollowingCount, o => o.MapFrom(s => s.Followings.Count))
            .ForMember(d => d.Following, o => o.MapFrom(s => s.Followers.Any(x => x.Observer.Id == currentUserId)));
        CreateMap<Comment, CommentDto>()
            .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.User.DisplayName))
            .ForMember(d => d.UserId, o => o.MapFrom(s => s.User.Id))
            .ForMember(d => d.ImageUrl, o => o.MapFrom(s => s.User.ImageUrl));

    }
}
