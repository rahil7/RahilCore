using RahilCore.Domain.Entities;

namespace RahilCore.Application.Features
{
    public interface IActivityRepository
    {
        void Add(ActivityLogEn activity);
    }
}
