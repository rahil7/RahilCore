using RahilCore.Application.Abstractions.Persistence;
using RahilCore.Application.Common.DTOs;
using RahilCore.Application.Common.Exceptions;
using RahilCore.Application.Common.Helpers;
using RahilCore.Application.Features.City;
using RahilCore.Application.Features.Customers.DTOs;
using RahilCore.Application.Features.Customers.Queries;
using RahilCore.Application.Features.Customers.Requests;
using RahilCore.Application.Features.MasterParameters;
using RahilCore.Domain.Entities;

namespace RahilCore.Application.Features.Customers
{
    public sealed class CustomerService(
        ICustomerRepository custRepo,
        IMasterParameterRepository masterParameterRepo,
        ICityRepository cityRepo,
        IUnitOfWork uow) : ICustomerService
    {
        public async Task<long> CreateAsync(CreateCustomerRequest request, string createdBy, CancellationToken ct = default)
        {
            ArgumentNullException.ThrowIfNull(request);

            var custCode = request.CustCode.Trim().ToUpperInvariant();
            var email = request.Email.Trim().ToLowerInvariant();
            var phone = PhoneNumberHelper.Normalize(request.Phone, "ID");
            var address = string.IsNullOrWhiteSpace(request.Address) ? null : request.Address.Trim();

            // Validation
            if (await custRepo.ExistsByCodeAsync(custCode, ct))
            {
                throw new BusinessException(409,$"Customer code '{custCode}' already exists.");
            }

            if (await custRepo.ExistsByCodeAsync(custCode, ct))
                throw new BusinessException(409, "Customer code already exists.");

            if (await custRepo.ExistsByEmailAsync(email, ct))
                throw new BusinessException(409, "Email already exists.");

            if (await custRepo.ExistsByPhoneAsync(phone, ct))
                throw new BusinessException(409, "Phone already exists.");

            if (!await masterParameterRepo.ExistsAsync(request.CustTypeId, ct))
            {
                throw new BusinessException(400, "Customer type tidak valid.");
            }

            if (request.CityId.HasValue &&
                !await cityRepo.ExistsAsync(request.CityId.Value, ct))
            {
                throw new BusinessException(400, "City tidak valid.");
            }

            var now = DateTime.UtcNow;
            var note = request.Note?.Trim();

            // Prepare entities
            var customer = new CustomerEn
            {
                CustTypeId = request.CustTypeId,
                CustCode = custCode,
                CustName = request.CustName.Trim(),
                Email = email,
                Phone = phone,
                CityId = request.CityId,
                Address = address,
                IsActive = true,
                CreatedAt = now,
                CreatedBy = createdBy,
                CreatedNote = note
            };

            var custEmail = new CustomerEmailEn
            {
                Email = customer.Email,
                IsPrimary = true,
                IsActive = true,
                CreatedNote = note,
                CreatedAt = now,
                CreatedBy = createdBy
            };

            var custPhone = new CustomerPhoneEn
            {
                Phone = customer.Phone,
                IsPrimary = true,
                IsActive = true,
                CreatedNote = note,
                CreatedAt = now,
                CreatedBy = createdBy
            };

            // Transaction
            await uow.BeginTransactionAsync(ct);

            try
            {
                await custRepo.AddAsync(customer, ct);

                // Generate Customer ID
                await uow.SaveChangesAsync(ct);

                // Insert contacts
                await custRepo.AddEmailAsync(custEmail, customer.Id, ct);
                await custRepo.AddPhoneAsync(custPhone, customer.Id, ct);

                // Commit all changes
                await uow.CommitAsync(ct);

                return customer.Id;
            }
            catch
            {
                await uow.RollbackAsync(CancellationToken.None);
                throw;
            }
        }

        public async Task<CustomerDetailDto?> GetByIdAsync(long id, CancellationToken ct = default)
        {
            if (id <= 0)
            {
                return null;
            }

            return await custRepo.GetByIdAsync(id, ct);
        }

        public async Task<List<CustomerEmailDto>?> GetCustomerEmails(long id, CancellationToken ct = default)
        {
            if (id <= 0)
            {
                return null;
            }

            return await custRepo.GetEmailsAsync(id, ct);
        }

        public async Task<List<CustomerPhoneDto>?> GetCustomerPhones(long id, CancellationToken ct = default)
        {
            if (id <= 0)
            {
                return null;
            }

            return await custRepo.GetPhonesAsync(id, ct);
        }

        public async Task<CustomerFilterOptions> GetFilterOptionsAsync(CancellationToken ct = default)
        {
            var cities = await cityRepo.GetFilterOptionsAsync(ct);

            var customerTypes =
                await masterParameterRepo.GetFilterOptionsAsync(MasterParameterTypes.CustomerType,ct);

            var searchFields = CustomerQueryMetadata.Fields
                .Where(x => x.CanSearch)
                .Select(x => new QueryFieldOptionDto
                {
                    Value = x.Field,
                    Label = x.Label
                })
                .ToList();

            var sortFields = CustomerQueryMetadata.Fields
                .Where(x => x.CanSort)
                .Select(x => new QueryFieldOptionDto
                {
                    Value = x.Field,
                    Label = x.Label
                })
                .ToList();

            var statuses = new List<StatusFilterOptionDto>
            {
                new() { Value = true, Label = "Active" },
                new() { Value = false, Label = "Inactive" }
            };

            return new CustomerFilterOptions
            {
                Cities = cities,
                CustomerTypes = customerTypes,
                Statuses = statuses,
                SearchFields = searchFields,
                SortFields = sortFields
            };
        }

        public async Task<(IReadOnlyList<CustomerListDto> Items, int TotalItems)> 
            GetPagedAsync(GetCustomersQuery query, CancellationToken ct = default)
        {
            ArgumentNullException.ThrowIfNull(query);

            query.Page = Math.Max(1, query.Page);
            query.PageSize = Math.Clamp(query.PageSize, 1, 100);

            query.SearchBy = string.IsNullOrWhiteSpace(query.SearchBy)
                ? null
                : query.SearchBy.Trim();

            query.SearchKey = string.IsNullOrWhiteSpace(query.SearchKey)
                ? null
                : query.SearchKey.Trim();

            query.SortBy = string.IsNullOrWhiteSpace(query.SortBy)
                ? CustomerQueryMetadata.DefaultSortBy
                : query.SortBy.Trim();

            query.SortDirection =
                string.Equals(
                    query.SortDirection,
                    "asc",
                    StringComparison.OrdinalIgnoreCase)
                ? "asc"
                : "desc";

            if (query.SearchBy is not null &&
                !CustomerQueryMetadata.CanSearch(query.SearchBy))
            {
                throw new ArgumentException(
                    $"Field '{query.SearchBy}' is not allowed for searching.");
            }

            if (!CustomerQueryMetadata.CanSort(query.SortBy))
            {
                throw new ArgumentException(
                    $"Field '{query.SortBy}' is not allowed for sorting.");
            }

            query.Status = query.Status?.Distinct().ToList();

            query.CustTypeIds = query.CustTypeIds?.Where(x => x > 0).Distinct().ToList();

            query.CityIds = query.CityIds?.Where(x => x > 0).Distinct().ToList();

            return await custRepo.GetPagedAsync(query, ct);
        }

        public async Task UpdateAsync(long id, UpdateCustomerRequest request, string updatedBy, CancellationToken ct = default)
        {
            ArgumentNullException.ThrowIfNull(request);

            if (id <= 0)
            {
                throw new BusinessException(400, "Customer ID tidak valid.");
            }

            if (string.IsNullOrWhiteSpace(request.Note))
            {
                throw new BusinessException(400, "Note wajib diisi.");
            }

            var customer = await custRepo.GetEntityByIdAsync(id, ct);

            if (customer is null)
            {
                throw new BusinessException(404,"Customer tidak ditemukan.");
            }

            // Validasi CityId jika dikirim
            if (request.CityId.HasValue)
            {
                if (!await cityRepo.ExistsAsync(request.CityId.Value, ct))
                {
                    throw new BusinessException(400,"City tidak valid.");
                }

                customer.CityId = request.CityId;
            }

            // Update field yang dikirim dan tidak null
            if (request.CustName is not null)
            {
                if (string.IsNullOrWhiteSpace(request.CustName))
                {
                    throw new BusinessException(400,"Customer name tidak boleh kosong.");
                }

                customer.CustName = request.CustName.Trim();
            }

            if (request.Email is not null)
            {
                customer.Email = string.IsNullOrWhiteSpace(request.Email)
                    ? null
                    : request.Email.Trim();
            }

            if (request.Phone is not null)
            {
                var phone = request.Phone.Trim();

                if (phone.Length > 0 && !System.Text.RegularExpressions.Regex.IsMatch(phone,@"^628[0-9]{7,12}$"))
                {
                    throw new BusinessException(400,"Phone harus diawali 628 dan terdiri dari 10–15 digit.");
                }

                customer.Phone = string.IsNullOrWhiteSpace(phone)
                    ? null
                    : phone;
            }

            if (request.Address is not null)
            {
                customer.Address = string.IsNullOrWhiteSpace(request.Address)
                    ? null
                    : request.Address.Trim();
            }

            // Audit
            customer.UpdatedAt = DateTime.UtcNow;
            customer.UpdatedBy = updatedBy;
            customer.UpdatedNote = request.Note.Trim();

            await custRepo.UpdateAsync(customer, ct);
        }
    }
}
