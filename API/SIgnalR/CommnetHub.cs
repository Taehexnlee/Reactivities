using Application.Activities.Commands;
using Application.Activities.Queries;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

public class CommentHub(IMediator mediator) : Hub
{
    public async Task SendComment(AddComment.Commands commands)
    {
        var comment = await mediator.Send(commands);
        await Clients.Group(commands.ActivityId).SendAsync("ReceiveComment", comment.Value);
    }

    public override async Task OnConnectedAsync()
    {
        var http = Context.GetHttpContext();
        var activityId = http?.Request.Query["activityId"].ToString();
        if (string.IsNullOrWhiteSpace(activityId))
            throw new HubException("No activity with this id");

        await Groups.AddToGroupAsync(Context.ConnectionId, activityId);

        var result = await mediator.Send(new GetComment.Query { ActivityId = activityId });
        await Clients.Caller.SendAsync("LoadComments", result.Value);
    }
}