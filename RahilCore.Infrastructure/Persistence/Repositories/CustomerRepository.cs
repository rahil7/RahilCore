using Microsoft.EntityFrameworkCore;
using RahilCore.Application.Features.Customers;
using RahilCore.Application.Features.Customers.DTOs;
using RahilCore.Application.Features.Customers.Queries;
using RahilCore.Domain.Entities.Customers;
using RahilCore.Infrastructure.Persistence.DbContext;

namespace RahilCore.Infrastructure.Persistence.Repositories
{
    public sealed class CustomerRepository : ICustomerRepository
    {
        private readonly RahilCoreDbContext _context;

        public CustomerRepository(RahilCoreDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(CustomerEn customer, CancellationToken ct = default)
        {
            await _context.Customers.AddAsync(customer, ct);
        }

        public async Task AddEmailAsync(CustomerEmailEn email, long id, CancellationToken ct = default)
        {
            email.CustomerId = id;

            await _context.CustomerEmails.AddAsync(email, ct);
        }

        public async Task AddPhoneAsync(CustomerPhoneEn phone, long id, CancellationToken ct = default)
        {
            phone.CustomerId = id;

            await _context.CustomerPhones.AddAsync(phone, ct);
        }

        public async Task<bool> ExistsByCodeAsync(string custCode, CancellationToken ct = default)
        {
            return await _context.Customers.AnyAsync(x => x.CustCode == custCode, ct);
        }

        public async Task<bool> ExistsByEmailAsync(string email, CancellationToken ct = default)
        {
            return await _context.Customers.AnyAsync(x => x.Email == email, ct);
        }

        public async Task<bool> ExistsByIdAsync(long id, CancellationToken ct = default)
        {
            return await _context.Customers.AnyAsync(x => x.Id == id, ct);
        }

        public async Task<bool> ExistsByPhoneAsync(string phone, CancellationToken ct = default)
        {
            return await _context.Customers.AnyAsync(x => x.Phone == phone, ct);
        }

        public async Task<CustomerDetailDto?> GetByIdAsync(long id, CancellationToken ct = default)
        {
            return await _context.Customers
                .AsNoTracking()
                .Where(x => x.Id == id)
                .Select(x => new CustomerDetailDto
                {
                    Id = x.Id,
                    CustCode = x.CustCode,
                    CustName = x.CustName,

                    CustType = x.CustTypeId,
                    CustTypeName = x.CustType != null ? x.CustType.ParamName : null,

                    Email = x.Email,
                    Phone = x.Phone,

                    CityId = x.CityId,
                    CityName = x.City != null ? x.City.Name : null,

                    Address = x.Address,
                    IsActive = x.IsActive,

                    CreatedAt = x.CreatedAt,
                    CreatedBy = x.CreatedBy,
                    CreatedNote = x.CreatedNote,

                    UpdatedAt = x.UpdatedAt,
                    UpdatedBy = x.UpdatedBy,
                    UpdatedNote = x.UpdatedNote
                })
                .FirstOrDefaultAsync(ct);
        }

        public async Task<List<CustomerEmailDto>?> GetEmailsAsync(long id, CancellationToken ct)
        {
            return await _context
                .CustomerEmails
                .Where(x => x.CustomerId == id)
                .Select(x => new CustomerEmailDto
                {
                    Id = x.Id,
                    Email = x.Email,
                    CustomerId = x.CustomerId,
                    IsActive = x.IsActive,
                    CreatedAt = x.CreatedAt,
                    LastActivityAt = x.UpdatedAt ?? x.CreatedAt,
                    LastActivityBy = x.UpdatedBy ?? x.CreatedBy ?? string.Empty,
                    LastActivityNote = x.UpdatedNote ?? x.CreatedNote
                })
                .ToListAsync(ct);
        }

        public async Task<CustomerEn?> GetEntityByIdAsync(long id, CancellationToken ct = default)
        {
            return await _context.Customers.FirstOrDefaultAsync(x => x.Id == id, ct);
        }

        public async Task<(IReadOnlyList<CustomerListDto> Items, int TotalItems)>
            GetPagedAsync(GetCustomersQuery query,CancellationToken ct = default)
        {
            var customers = _context.Customers
                .AsNoTracking()
                .AsQueryable();

            // 1. Search: hanya satu field per request.
            if (!string.IsNullOrWhiteSpace(query.SearchBy) &&
                !string.IsNullOrWhiteSpace(query.SearchKey))
            {
                var searchKey = $"%{query.SearchKey.Trim()}%";

                customers = query.SearchBy.Trim().ToLowerInvariant() switch
                {
                    "custcode" => customers.Where(x =>
                        EF.Functions.ILike(x.CustCode, searchKey)),

                    "custname" => customers.Where(x =>
                        EF.Functions.ILike(x.CustName, searchKey)),

                    "custtypename" => customers.Where(x =>
                        x.CustType != null &&
                        EF.Functions.ILike(
                            x.CustType.ParamName,
                            searchKey)),

                    "cityname" => customers.Where(x =>
                        x.City != null &&
                        EF.Functions.ILike(
                            x.City.Name,
                            searchKey)),

                    _ => customers
                };
            }

            // 2. Filtering.
            if (query.Status is { Count: > 0 })
            {
                customers = customers.Where(
                    x => query.Status.Contains(x.IsActive));
            }

            if (query.CustTypeIds is { Count: > 0 })
            {
                customers = customers.Where(
                    x => query.CustTypeIds.Contains(x.CustTypeId));
            }

            if (query.CityIds is { Count: > 0 })
            {
                customers = customers.Where(
                    x => x.CityId.HasValue &&
                         query.CityIds.Contains(x.CityId.Value));
            }

            // 3. Hitung total data setelah filter,
            // sebelum pagination.
            var totalItems = await customers.CountAsync(ct);

            // 4. Projection ke DTO.
            var result = customers.Select(x => new CustomerListDto
            {
                Id = x.Id,
                CustCode = x.CustCode,
                CustName = x.CustName,

                CustType = x.CustTypeId,
                CustTypeName = x.CustType != null
                    ? x.CustType.ParamName
                    : null,

                Email = x.Email,
                Phone = x.Phone,

                CityId = x.CityId,
                CityName = x.City != null
                    ? x.City.Name
                    : null,

                IsActive = x.IsActive,
                CreatedAt = x.CreatedAt,
                LastActivityAt = x.UpdatedAt ?? x.CreatedAt,
                LastActivityBy = x.UpdatedBy ?? x.CreatedBy ?? string.Empty,
                LastActivityNote = x.UpdatedNote ?? x.CreatedNote
            });

            // 5. Sorting.
            var sortBy = string.IsNullOrWhiteSpace(query.SortBy)
                ? CustomerQueryMetadata.DefaultSortBy
                : query.SortBy.Trim().ToLowerInvariant();

            var descending = !string.Equals(
                query.SortDirection,
                "asc",
                StringComparison.OrdinalIgnoreCase);

            IOrderedQueryable<CustomerListDto> orderedResult = sortBy switch
            {
                "custcode" => descending
                    ? result.OrderByDescending(x => x.CustCode)
                    : result.OrderBy(x => x.CustCode),

                "custname" => descending
                    ? result.OrderByDescending(x => x.CustName)
                    : result.OrderBy(x => x.CustName),

                "custtypename" => descending
                    ? result.OrderByDescending(x => x.CustTypeName)
                    : result.OrderBy(x => x.CustTypeName),

                "cityname" => descending
                    ? result.OrderByDescending(x => x.CityName)
                    : result.OrderBy(x => x.CityName),

                "createdat" => descending
                    ? result.OrderByDescending(x => x.CreatedAt)
                    : result.OrderBy(x => x.CreatedAt),

                "lastactivityat" => descending
                    ? result.OrderByDescending(x => x.LastActivityAt)
                    : result.OrderBy(x => x.LastActivityAt),

                _ => descending
                    ? result.OrderByDescending(x => x.LastActivityAt)
                    : result.OrderBy(x => x.LastActivityAt)
            };

            // Urutan sekunder untuk pagination yang stabil.
            orderedResult = orderedResult.ThenBy(x => x.Id);

            // 6. Pagination.
            var page = Math.Max(1, query.Page);
            var pageSize = Math.Clamp(query.PageSize, 1, 100);

            var items = await orderedResult
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(ct);

            return (items, totalItems);
        }

        public async Task<List<CustomerPhoneDto>?> GetPhonesAsync(long id, CancellationToken ct)
        {
            return await _context
                .CustomerPhones
                .Where(x => x.CustomerId == id)
                .Select(x => new CustomerPhoneDto
                {
                    Id = x.Id,
                    Phone = x.Phone,
                    CustomerId = x.CustomerId,
                    IsActive = x.IsActive,
                    CreatedAt = x.CreatedAt,
                    LastActivityAt = x.UpdatedAt ?? x.CreatedAt,
                    LastActivityBy = x.UpdatedBy ?? x.CreatedBy ?? string.Empty,
                    LastActivityNote = x.UpdatedNote ?? x.CreatedNote
                })
                .ToListAsync(ct);
        }

        public async Task UpdateAsync(CustomerEn customer, CancellationToken ct = default)
        {
            await _context.SaveChangesAsync(ct);
        }
    }
}
