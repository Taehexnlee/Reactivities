using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseApiController : ControllerBase
    {
        private IMediator? _mediater;

        protected IMediator Mediator =>
            _mediater ??= HttpContext.RequestServices.GetService<IMediator>()
                ?? throw new InvalidOperationException("IMediator service is unavailable");  
    }
}
