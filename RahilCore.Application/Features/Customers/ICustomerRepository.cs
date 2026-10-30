using RahilCore.Application.Features.Customers.DTOs;
using RahilCore.Application.Features.Customers.Queries;
using RahilCore.Domain.Entities;

namespace RahilCore.Application.Features.Customers
{
    public interface ICustomerRepository
    {
        Task<(IReadOnlyList<CustomerListDto> Items, int TotalItems)> GetPagedAsync(GetCustomersQuery query, CancellationToken ct = default);

        Task<CustomerDetailDto?> GetByIdAsync(long id, CancellationToken ct = default);

        Task<bool> ExistsByCodeAsync(string custCode,CancellationToken ct = default);

        Task<CustomerEn?> GetEntityByIdAsync(long id, CancellationToken ct = default);

        Task UpdateAsync(CustomerEn customer, CancellationToken ct = default);

        Task AddAsync(CustomerEn customer, CancellationToken ct = default);
    }
}
