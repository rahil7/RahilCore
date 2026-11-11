using RahilCore.Application.Features.Customers.DTOs;
using RahilCore.Application.Features.Customers.Queries;
using RahilCore.Domain.Entities.Customers;

namespace RahilCore.Application.Features.Customers
{
    public interface ICustomerRepository
    {
        Task<(IReadOnlyList<CustomerListDto> Items, int TotalItems)> GetPagedAsync(GetCustomersQuery query, CancellationToken ct = default);

        Task<CustomerDetailDto?> GetByIdAsync(long id, CancellationToken ct = default);

        Task<bool> ExistsByCodeAsync(string custCode,CancellationToken ct = default);

        Task<bool> ExistsByEmailAsync(string email, CancellationToken ct = default);

        Task<bool> ExistsByPhoneAsync(string phone, CancellationToken ct = default);

        Task<CustomerEn?> GetEntityByIdAsync(long id, CancellationToken ct = default);

        Task UpdateAsync(CustomerEn customer, CancellationToken ct = default);

        Task AddAsync(CustomerEn customer, CancellationToken ct = default);
        Task AddEmailAsync(CustomerEmailEn email, long id, CancellationToken ct = default);
        Task AddPhoneAsync(CustomerPhoneEn phone, long id, CancellationToken ct = default);
        Task<List<CustomerEmailDto>?> GetEmailsAsync(long id, CancellationToken ct);
        Task<List<CustomerPhoneDto>?> GetPhonesAsync(long id, CancellationToken ct);
    }
}
