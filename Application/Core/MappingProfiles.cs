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
            .ForMember(d => d.Bio, opt => opt.MapFrom(s => s.User.Bio));

        CreateMap<User, UserProfile>();

    }
}
