using RahilCore.Application.Features.Customers.DTOs;
using RahilCore.Application.Features.Customers.Queries;
using RahilCore.Application.Features.Customers.Requests;

namespace RahilCore.Application.Features.Customers
{
    public interface ICustomerService
    {
        Task<(IReadOnlyList<CustomerListDto> Items, int TotalItems)>GetPagedAsync(CustomersQuery query,CancellationToken ct = default);
        
        Task<(IReadOnlyList<CustomerLookupDto> Items, int TotalItems)> GetPagedLookupAsync(CustomerLookupQuery query, int pageSize, CancellationToken ct = default);

        Task<CustomerDetailDto?> GetByIdAsync(long id,CancellationToken ct = default);

        Task<long> CreateAsync(CreateCustomerRequest request,string createdBy, CancellationToken ct = default);

        Task UpdateAsync(long id,UpdateCustomerRequest request,string updatedBy,CancellationToken ct = default);

        Task<CustomerFilterOptions> GetFilterOptionsAsync(CancellationToken ct = default);
        Task<List<CustomerEmailDto>?> GetCustomerEmails(long id, CancellationToken ct = default);
        Task<List<CustomerPhoneDto>?> GetCustomerPhones(long id, CancellationToken ct = default);
    }
}