using RahilCore.Application.Abstractions.Persistence;
using RahilCore.Application.Abstractions.Storage;
using RahilCore.Application.Common.Constants;
using RahilCore.Application.Common.DTOs;
using RahilCore.Application.Common.Exceptions;
using RahilCore.Application.Common.Helpers;
using RahilCore.Application.Features.City;
using RahilCore.Application.Features.Customers;
using RahilCore.Application.Features.Inspections;
using RahilCore.Application.Features.MasterParameters;
using RahilCore.Application.Features.Orders.DTOs;
using RahilCore.Application.Features.Orders.Queries;
using RahilCore.Application.Features.Orders.Request;
using RahilCore.Application.Features.Users;
using RahilCore.Application.Features.Vehicles;
using RahilCore.Domain.Entities;
using RahilCore.Domain.Entities.Customers;
using RahilCore.Domain.Entities.Inspections;
using RahilCore.Domain.Entities.Orders;
using System.Text.Json;

namespace RahilCore.Application.Features.Orders
{
    public class OrderService(
            IUnitOfWork uow,
            IOrderRepository orderRepo,
            ICustomerRepository customerRepo,
            IVehicleRepository vehicleRepo,
            ICityRepository cityRepo,
            IMasterParameterRepository masterParameterRepo,
            IInspectionRepository inspectionRepo,
            IObjectStorageService objectStorageService,
            IUserRepository userRepo,
            IActivityRepository activityRepo
        ) : IOrderService
    {
        // options
        public async Task<OrderCreateOptions> GetCreateOptionsAsync(CancellationToken ct = default)
        {
            var cities = await cityRepo.GetForFilter(ct);
            var inspForms = await inspectionRepo.GetInspFormsForFilter(ct);
            var vehicleColors = await vehicleRepo.GetColorLookup(ct);
            var vehicleBrands = await vehicleRepo.GetBarndLookup(ct);

            return new OrderCreateOptions
            {
                Cities = cities,
                InspectionForms = inspForms,
                Brands = vehicleBrands,
                ExteriorColors = vehicleColors
            };
        }

        public async Task<OrderFilterOptions> GetFilterOptionsAsync(CancellationToken ct = default)
        {
            var customerTypes = await masterParameterRepo
                .GetFilterOptionsAsync(MasterParameterTypes.CUST_TYPE, ct);

            var inspectionStatus = await masterParameterRepo
                .GetFilterOptionsAsync(MasterParameterTypes.INSP_STATUS, ct);

            var paymentStatus = await masterParameterRepo
                .GetFilterOptionsAsync(MasterParameterTypes.PAYMENT_STATUS, ct);

            var searchFields = OrderQueryMetadata.Fields
                .Where(x => x.CanSearch)
                .Select(x => new QueryFieldOptionDto
                {
                    Value = x.Field,
                    Label = x.Label
                })
                .ToList();

            var sortFields = OrderQueryMetadata.Fields
                .Where(x => x.CanSort)
                .Select(x => new QueryFieldOptionDto
                {
                    Value = x.Field,
                    Label = x.Label
                })
                .ToList();

            return new OrderFilterOptions
            {
                CustomerTypes = customerTypes,
                InspectionStatus = inspectionStatus,
                PaymentStatus = paymentStatus,
                SearchFields = searchFields,
                SortFields = sortFields
            };
        }

        public async Task<OrderPaymentCreateOption?> GetPaymentOptionsAsync(CancellationToken ct = default)
        {
            var paymentMethods = await masterParameterRepo
                .GetFilterOptionsAsync(MasterParameterTypes.PAYMENT_METHOD, ct);

            return new OrderPaymentCreateOption
            {
                PaymentMethods = paymentMethods
            };
        }

        public async Task<OrderAssignOption?> GetAssignOptionsAsync(CancellationToken ct = default)
        {
            var inspectorLookup = await userRepo.GetInspectorLookup(ct);
            
            return new OrderAssignOption
            {
                Inspectors = inspectorLookup
            };
        }


        // queries
        public async Task<(IReadOnlyList<OrderListDto> Items, int TotalItems)> GetPagedAsync(GetOrderListQuery query, CancellationToken ct = default)
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
                ? OrderQueryMetadata.DefaultSortBy
                : query.SortBy.Trim();

            query.SortDirection = string.IsNullOrWhiteSpace(query.SortDirection)
                ? OrderQueryMetadata.DefaultSortDirection
                : string.Equals(query.SortDirection, "asc", StringComparison.OrdinalIgnoreCase)
                    ? "asc"
                    : "desc";

            if (query.SearchBy is not null &&
                !OrderQueryMetadata.CanSearch(query.SearchBy))
            {
                throw new BusinessException(400, $"Field '{query.SearchBy}' is not allowed for searching.");
            }

            if (!OrderQueryMetadata.CanSort(query.SortBy))
            {
                throw new BusinessException(400, $"Field '{query.SortBy}' is not allowed for sorting.");
            }

            var today = DateOnly.FromDateTime(TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("Asia/Jakarta")));

            query.CreatedFrom ??= today;
            query.CreatedTo ??= today;

            if (query.CreatedFrom > query.CreatedTo)
            {
                throw new BusinessException(400, "CreatedFrom cannot be later than CreatedTo.");
            }

            query.StatusIds = query.StatusIds?.Where(x => x > 0).Distinct().ToList();

            query.PaymentStatusIds = query.PaymentStatusIds?.Where(x => x > 0).Distinct().ToList();

            query.CustTypeIds = query.CustTypeIds?.Where(x => x > 0).Distinct().ToList();

            return await orderRepo.GetPagedAsync(query, ct);
        }

        public async Task<FileAccessDto> GetPaymentProofAsync(long paymentId, CancellationToken ct)
        {
            var payment = await orderRepo.GetPaymentByIdAsync(paymentId, ct);

            if (payment is null)
                throw new BusinessException(404, "Payment not found.");

            if (string.IsNullOrWhiteSpace(payment.StorageKey))
                throw new BusinessException(404, "Payment proof not found.");

            var url = await objectStorageService.GetPresignedUrlAsync(payment.StorageKey, 15);

            return new FileAccessDto(
                Url: url,
                FileName: payment.FileName!,
                FileType: payment.FileType!,
                FileSize: payment.FileSize!.Value
            );
        }

        public async Task<OrderDetailDto?> GetByIdAsync(long id, CancellationToken ct = default)
        {
            if (id <= 0)
            {
                return null;
            }

            InspectionOrderEn? order = await orderRepo.GetOrderDetail(id, ct);
            
            if (order is null || order.Customer is null)
            {
                return null;
            }

            IReadOnlyList<InspectionOrderItemEn> orderItems = await orderRepo.GetOrderDetailItems(id, ct);

            if (orderItems.Count == 0)
            {
                return null;
            }

            OrderPaymentDto? payment = await orderRepo.GetOrderPayment(id, ct);
            BaseAssignmentDto? assignment = await orderRepo.GetOrderAssignment(id, ct);
            IReadOnlyList<BaseActivityDto> activities = await activityRepo.GetByOrderIdAsync(id, ct);

            var canReassign = assignment != null && !await orderRepo.HasSubmittedInspectionAsync(id, ct);

            var inspectionForm = orderItems
                .Select(x => x.InspectionForm)
                .FirstOrDefault(x => x != null);

            var submittedOrderItemIds = (await orderRepo.GetSubmittedOrderItemIds(id, ct)).ToHashSet();
            bool isPaid = order.PaymentStatusId == PaymentStatus.PAID;

            IReadOnlyList<OrderVehicleDto> vehicles = orderItems
                .Select(x => new OrderVehicleDto
                {
                    VehicleId = x.VehicleId,
                    PlateNo = x.Vehicle?.PlateNo,
                    Brand = x.Vehicle?.Brand?.Name,
                    Model = x.Vehicle?.Model?.Name,
                    Variant = x.Vehicle?.Variant?.Name,
                    YearOfManufacture = x.Vehicle?.YearOfManufacture,
                    ExteriorColor = x.Vehicle?.ExteriorColor?.Name,
                    CanDelete = !isPaid && !submittedOrderItemIds.Contains(x.Id)
                })
                .OrderBy(x => x.VehicleId)
                .ToList();

            var canAssign = order.Customer.CustTypeId == 1 || (order.Customer.CustTypeId == 2 && order.PaymentStatusId == 15);

            bool canEdit = InspectionStatus.ALLOWED_ORDER_EDIT.Contains(order.StatusId);
            bool canEditSchedule = InspectionStatus.ALLOWED_ORDER_EDIT_SCHEDULE.Contains(order.StatusId);
            bool canCancel = InspectionStatus.CANCELLED != order.StatusId;

            return new OrderDetailDto
            {
                Id = order.Id,
                OrderNo = order.OrderNo,
                StatusId = order.StatusId,
                StatusName = order.Status?.ParamName!,
                PaymentStatusId = order.PaymentStatusId,
                PaymentStatusName = order.PaymentStatus?.ParamName!,
                CreatedAt = order.CreatedAt,
                CreatedBy = order.CreatedBy ?? string.Empty,
                CreatedNote = order.CreatedNote ?? string.Empty,
                PicName = order.PicName,
                PicPhone = order.PicPhone,
                ScheduleAt = order.ScheduleAt,
                Note = order.CreatedNote,
                InspectionFormId = inspectionForm!.Id,
                InspectionFormName = inspectionForm!.Name,
                CanAssign = canAssign,
                CanReassign = canReassign,

                Customer = new BaseCustomerDto
                {
                    CustomerCode = order.Customer.CustCode,
                    CustomerName = order.Customer.CustName,
                    CustomerTypeId = order.Customer.CustTypeId,
                    CustomerType = order.Customer.CustType?.ParamName ?? string.Empty,
                    Email = order.Customer.Email,
                    Phone = order.Customer.Phone,
                    Address = order.Customer.Address
                },
                Vehicles = vehicles,
                Payment = payment,
                Assignment = assignment,
                CanEdit = canEdit,
                CanCancel = canCancel,
                CanEditSchedule = canEditSchedule,
                Activities = activities
            };
        }


        // crud
        public async Task<long> CreateOrderForCustomer(CreateOrderCustomerRequest request, string username, CancellationToken ct = default)
        {
            ArgumentNullException.ThrowIfNull(request);

            var isValidVariant = await vehicleRepo
                .IsValidBrandModelVariantAsync(
                    request.Vehicle.BrandId,
                    request.Vehicle.ModelId,
                    request.Vehicle.VariantId,
                    ct);

            if (!isValidVariant)
            {
                throw new BusinessException(400, "Kombinasi Brand, Model, dan Variant tidak valid.");
            }

            if (!await vehicleRepo.ExistsColorAsync(request.Vehicle.ExteriorColorId, ct))
            {
                throw new BusinessException(400, "Exterior color tidak valid.");
            }

            if (request.InspectionFormId != InspectionForm.DEALER_INSPECTION &&
                request.InspectionFormId != InspectionForm.CUSTOMER_INSPECTION)
            {
                throw new BusinessException(400, "Form Inspeksi tidak valid.");
            }

            var jakartaTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Jakarta");

            var jakartaNow = TimeZoneInfo.ConvertTimeFromUtc(
                DateTime.UtcNow,
                jakartaTimeZone
            );

            if (request.ScheduleAt.Date < jakartaNow.Date)
            {
                throw new BusinessException(400, "Schedule tidak boleh kurang dari hari ini.");
            }

            await uow.BeginTransactionAsync(ct);

            try
            {
                long customerId;
                var now = DateTime.UtcNow;
                var note = request.Note.Trim();

                if (request.CustomerId.HasValue && request.CustomerId.Value > 0)
                {
                    // Existing customer
                    var customer = await customerRepo.GetByIdAsync(request.CustomerId.Value, ct);

                    if (customer is null)
                    {
                        throw new BusinessException(404, "Customer tidak ditemukan.");
                    }

                    customerId = customer.Id;
                }
                else
                {
                    // New customer
                    if (string.IsNullOrWhiteSpace(request.CustName))
                    {
                        throw new BusinessException(400, "Customer name wajib diisi.");
                    }

                    if (string.IsNullOrWhiteSpace(request.Email))
                    {
                        throw new BusinessException(400, "Email wajib diisi.");
                    }

                    var email = request.Email.Trim().ToLowerInvariant();

                    if (await customerRepo.ExistsByEmailAsync(email, ct))
                    {
                        throw new BusinessException(409, "Email already exists.");
                    }

                    if (string.IsNullOrWhiteSpace(request.Phone))
                    {
                        throw new BusinessException(400, "Phone wajib diisi.");
                    }

                    var phone = PhoneNumberHelper.Normalize(request.Phone, "ID");

                    if (await customerRepo.ExistsByPhoneAsync(phone, ct))
                    {
                        throw new BusinessException(409, "Phone already exists.");
                    }

                    if (request.CityId.HasValue && !await cityRepo.ExistsAsync(request.CityId.Value, ct))
                    {
                        throw new BusinessException(400, "City tidak valid.");
                    }

                    string custCode = await customerRepo.GenerateCustomerCodeAsync(ct);

                    var customer = new CustomerEn
                    {
                        CustTypeId = CustomerType.CUSTOMER,
                        CustCode = custCode,
                        CustName = request.CustName.Trim(),
                        Email = email,
                        Phone = phone,
                        CityId = request.CityId,
                        Address = request.Address?.Trim(),
                        IsActive = true,
                        CreatedAt = now,
                        CreatedBy = username,
                        CreatedNote = note
                    };

                    customerRepo.Add(customer);

                    await uow.SaveChangesAsync(ct);

                    customerId = customer.Id;
                }

                string orderCode = await orderRepo.GenerateOrderNoAsync(CustomerType.CUSTOMER,ct);

                var order = new InspectionOrderEn
                {
                    OrderNo = orderCode,
                    CustomerId = customerId,
                    ScheduleAt = DateTimeHelper.JakartaToUtc(request.ScheduleAt),
                    StatusId = InspectionStatus.ORDER_CREATED,
                    PaymentStatusId = PaymentStatus.UNPAID,
                    TotalUnit = 1,
                    PicName = request.PicName,
                    PicPhone = request.PicPhone,
                    CreatedBy = username,
                    CreatedAt = now,
                    CreatedNote = note,
                };

                // 1. Insert Order
                orderRepo.Add(order);
                await uow.SaveChangesAsync(ct);

                // 2. Insert Vehicles
                var vehicle = new VehicleEn
                {
                    CustomerId = customerId,
                    CreatedAt = now,
                    CreatedBy = username,
                    CreatedNote = note,
                    PlateNo = request.Vehicle.PlateNo,
                    BrandId = request.Vehicle.BrandId,
                    ModelId = request.Vehicle.ModelId,
                    VariantId = request.Vehicle.VariantId,
                    ExteriorColorId = request.Vehicle.ExteriorColorId,
                    YearOfManufacture = request.Vehicle.YearOfManufacture
                };

                vehicleRepo.Add(vehicle);
                await uow.SaveChangesAsync(ct);

                // 3. Insert Order Items
                var orderItems = new InspectionOrderItemEn
                {
                    OrderId = order.Id,
                    VehicleId = vehicle.Id,
                    InspectionFormId = request.InspectionFormId,
                    CreatedAt = now,
                    CreatedBy = username,
                    CreatedNote = note
                };
                orderRepo.Add(orderItems);

                // 4. Insert Activity Log
                var activity = new ActivityLogEn
                {
                    OrderId = order.Id,
                    EntityId = order.Id,
                    EntityTypeId = ActivityEntityType.ORDER,
                    ActionCodeId = ActivityActionCode.ORDER_CREATED,
                    Description = "Order customer berhasil dibuat",
                    ActorUsername = username,
                    CreatedAt = now,
                    Metadata = null
                };

                activityRepo.Add(activity);

                await uow.CommitAsync(ct);

                return order.Id;
            }
            catch
            {
                await uow.RollbackAsync(CancellationToken.None);
                throw;
            }
        }

        public async Task<long> CreateOrderForDealer(CreateOrderDealerRequest request, string username, CancellationToken ct)
        {
            ArgumentNullException.ThrowIfNull(request);

            if (!await customerRepo.ExistsByIdAsync(request.CustomerId, ct))
            {
                throw new BusinessException(404, "Customer tidak ditemukan.");
            }

            if (request.InspectionFormId != InspectionForm.DEALER_INSPECTION &&
                request.InspectionFormId != InspectionForm.CUSTOMER_INSPECTION)
            {
                throw new BusinessException(400, "Form Inspeksi tidak valid.");
            }

            var jakartaTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Jakarta");

            var jakartaNow = TimeZoneInfo.ConvertTimeFromUtc(
                DateTime.UtcNow,
                jakartaTimeZone
            );

            if (request.ScheduleAt.Date < jakartaNow.Date)
            {
                throw new BusinessException(400, "Schedule tidak boleh kurang dari hari ini.");
            }

            var now = DateTime.UtcNow;
            var note = request.Note.Trim();

            string orderCode = await orderRepo.GenerateOrderNoAsync(CustomerType.DEALER, ct);

            await uow.BeginTransactionAsync(ct);

            try
            {
                // 1. Insert Order
                var order = new InspectionOrderEn
                {
                    OrderNo = orderCode,
                    CustomerId = request.CustomerId,
                    ScheduleAt = DateTimeHelper.JakartaToUtc(request.ScheduleAt),
                    StatusId = InspectionStatus.ORDER_CREATED,
                    PaymentStatusId = PaymentStatus.UNPAID,
                    TotalUnit = request.TotalUnit,
                    PicName = request.PicName,
                    PicPhone = request.PicPhone,
                    CreatedBy = username,
                    CreatedAt = now,
                    CreatedNote = note,
                };

                orderRepo.Add(order);
                await uow.SaveChangesAsync(ct);

                // 2. Prepare Vehicles
                var vehicles = Enumerable.Range(0, request.TotalUnit)
                    .Select(_ => new VehicleEn
                    {
                        CustomerId = request.CustomerId,
                        CreatedAt = now,
                        CreatedBy = username,
                        CreatedNote = note
                    })
                    .ToList();

                // 3. Insert Vehicles
                vehicleRepo.AddRange(vehicles);
                await uow.SaveChangesAsync(ct);

                // 4. Prepare Order Items
                var orderItems = vehicles.Select(vehicle => new InspectionOrderItemEn
                {
                    OrderId = order.Id,
                    VehicleId = vehicle.Id,
                    InspectionFormId = request.InspectionFormId,
                    CreatedAt = now,
                    CreatedBy = username,
                    CreatedNote = note
                }).ToList();

                // 5. Insert Order Items
                orderRepo.AddItemRange(orderItems);

                // 6. Insert Activity Log
                var activity = new ActivityLogEn
                {
                    OrderId = order.Id,
                    EntityId = order.Id,
                    EntityTypeId = ActivityEntityType.ORDER,
                    ActionCodeId = ActivityActionCode.ORDER_CREATED,
                    Description = "Order showroom berhasil dibuat",
                    ActorUsername = username,
                    CreatedAt = now,
                    Metadata = null
                };

                activityRepo.Add(activity);

                await uow.CommitAsync(ct);

                return order.Id;
            }
            catch
            {
                await uow.RollbackAsync(CancellationToken.None);
                throw;
            }
        }

        public async Task<long> CreatePayment(long id, CreatePaymentRequest request, string username, CancellationToken ct = default)
        {
            ArgumentNullException.ThrowIfNull(request);

            if (!await masterParameterRepo.ExistsAsync(request.PaymentMethodId, MasterParameterTypes.PAYMENT_METHOD, ct))
            {
                throw new BusinessException(400, "Payment Method tidak valid.");
            }

            if (request.SubtotalAmount <= 0)
            {
                throw new BusinessException(400, "Subtotal amount must be greater than zero.");
            }

            if (request.DiscountAmount is < 0)
            {
                throw new BusinessException(400, "Discount amount cannot be negative.");
            }

            decimal discountAmount = request.DiscountAmount ?? 0m;

            if (discountAmount > request.SubtotalAmount)
            {
                throw new BusinessException(400, "Discount amount cannot exceed subtotal amount.");
            }

            decimal totalAmount = request.SubtotalAmount - discountAmount;

            if (request.PaymentProof is not null)
            {
                var file = request.PaymentProof;

                if (file.Length <= 0)
                {
                    throw new BusinessException(400, "Payment proof tidak boleh kosong.");
                }

                if (file.Length > 3 * 1024 * 1024)
                {
                    throw new BusinessException(400, "Payment proof maksimal 5 MB.");
                }

                var allowedTypes = new Dictionary<string, string[]>
                {
                    [".jpg"] = ["image/jpeg"],
                    [".jpeg"] = ["image/jpeg"],
                    [".png"] = ["image/png"],
                    [".pdf"] = ["application/pdf"]
                };

                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

                if (!allowedTypes.TryGetValue(extension, out var mimeTypes))
                {
                    throw new BusinessException(400, "Format payment proof harus JPG, JPEG, PNG, atau PDF.");
                }

                if (!mimeTypes.Contains(file.ContentType, StringComparer.OrdinalIgnoreCase))
                {
                    throw new BusinessException(400, "Tipe file payment proof tidak valid.");
                }
            }

            InspectionOrderEn? order = await orderRepo.GetOrderWithCustomer(id, ct);

            if (order is null)
            {
                throw new BusinessException(404, "Order tidak ditemukan.");
            }

            if(await orderRepo.ExistsPaymentByOrderIdAsync(id, ct))
            {
                throw new BusinessException(409, "Payment already exists.");
            }

            if (order.Customer is null)
            {
                throw new BusinessException(404, "Customer pada order tidak ditemukan.");
            }

            string? uploadedObjectKey = null;

            var now = DateTime.UtcNow;
            var note = request.Note.Trim();
            var invoiceNo = InvoiceHelper.GenerateInvoiceNo(order.Customer.CustTypeId, order.Id, now);

            await uow.BeginTransactionAsync(ct);

            try
            {
                order.StatusId = InspectionStatus.AWAITING_ASSIGNMENT;
                order.PaymentStatusId = PaymentStatus.PAID;
                order.DiscountAmount = request.DiscountAmount;
                order.SubtotalAmount = request.SubtotalAmount;
                order.TotalAmount = totalAmount;
                order.InvoiceDate = now;
                order.InvoiceNo = invoiceNo;
                order.UpdatedAt = now;
                order.UpdatedBy = username;
                order.UpdatedNote = note;

                var payment = new InspectionOrderPaymentEn
                {
                    OrderId = order.Id,
                    PaymentMethodId = request.PaymentMethodId,
                    Amount = totalAmount,
                    PaymentStatusId = PaymentTransactionStatus.SUCCESS,
                    PaymentDate = DateTimeHelper.JakartaToUtc(request.PaymentDate),
                    ReferenceNo = request.ReferenceNo,
                    CreatedAt = now,
                    CreatedBy = username,
                    CreatedNote = note
                };

                // Upload payment proof jika ada
                if (request.PaymentProof is not null)
                {
                    var file = request.PaymentProof;
                    var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

                    uploadedObjectKey = $"payments/{now:yyyy/MM}/{Guid.NewGuid()}{extension}";

                    await using var stream = file.OpenReadStream();

                    await objectStorageService.UploadAsync(stream,uploadedObjectKey,file.ContentType,ct);

                    payment.StorageKey = uploadedObjectKey;
                    payment.FileName = Path.GetFileName(file.FileName);
                    payment.FileSize = file.Length;
                    payment.FileType = file.ContentType;
                }

                orderRepo.AddPayment(payment);

                // 6. Insert Activity Log
                var activity = new ActivityLogEn
                {
                    OrderId = order.Id,
                    EntityId = payment.Id,
                    EntityTypeId = ActivityEntityType.PAYMENT,
                    ActionCodeId = ActivityActionCode.PAYMENT_CREATED,
                    Description = "Pembayaran berhasil di buat",
                    ActorUsername = username,
                    CreatedAt = now,
                    Metadata = null
                };

                activityRepo.Add(activity);

                await uow.SaveChangesAsync(ct);
                await uow.CommitAsync(ct);

                return payment.Id;
            }
            catch
            {
                await uow.RollbackAsync(CancellationToken.None);

                // Cleanup file jika upload sudah berhasil
                if (uploadedObjectKey is not null)
                {
                    try
                    {
                        await objectStorageService.DeleteAsync(uploadedObjectKey,CancellationToken.None);
                    }
                    catch
                    {
                        // Jangan menutupi exception utama.
                        // Catat kegagalan cleanup melalui logger.
                    }
                }

                throw;
            }
        }

        public async Task<long> UpdatePayment(long id, long paymentId, UpdatePaymentRequest request, string username,CancellationToken ct = default)
        {
            ArgumentNullException.ThrowIfNull(request);

            // Validate Payment Method
            if (request.PaymentMethodId.HasValue)
            {
                if (!await masterParameterRepo.ExistsAsync(
                    request.PaymentMethodId.Value,
                    MasterParameterTypes.PAYMENT_METHOD,
                    ct))
                {
                    throw new BusinessException(400, "Payment Method tidak valid.");
                }
            }

            // Validate Payment Proof
            if (request.PaymentProof is not null)
            {
                var file = request.PaymentProof;

                if (file.Length <= 0)
                {
                    throw new BusinessException(400, "Payment proof tidak boleh kosong.");
                }

                if (file.Length > 3 * 1024 * 1024)
                {
                    throw new BusinessException(400, "Payment proof maksimal 3 MB.");
                }

                var allowedTypes = new Dictionary<string, string[]>
                {
                    [".jpg"] = ["image/jpeg"],
                    [".jpeg"] = ["image/jpeg"],
                    [".png"] = ["image/png"],
                    [".pdf"] = ["application/pdf"]
                };

                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

                if (!allowedTypes.TryGetValue(extension, out var mimeTypes))
                {
                    throw new BusinessException(400, "Format payment proof harus JPG, JPEG, PNG, atau PDF.");
                }

                if (!mimeTypes.Contains(file.ContentType, StringComparer.OrdinalIgnoreCase))
                {
                    throw new BusinessException(400, "Tipe file payment proof tidak valid.");
                }
            }

            InspectionOrderEn? order = await orderRepo.GetOrderAsync(id, ct);

            if (order is null)
            {
                throw new BusinessException(404, $"Order dengan ID '{id}' tidak ditemukan.");
            }

            InspectionOrderPaymentEn? payment = await orderRepo.GetPayment(order.Id, paymentId, ct);

            if (payment is null)
            {
                throw new BusinessException(404, "Payment not found.");
            }

            // Get final values (existing value + requested changes)
            decimal subtotalAmount = request.SubtotalAmount ?? order.SubtotalAmount ?? 0m;

            decimal discountAmount = request.DiscountAmount ?? order.DiscountAmount ?? 0m;

            // Validate final amount
            if (subtotalAmount <= 0)
            {
                throw new BusinessException(400, "Subtotal amount must be greater than zero.");
            }

            if (discountAmount < 0)
            {
                throw new BusinessException(400, "Discount amount cannot be negative.");
            }

            if (discountAmount > subtotalAmount)
            {
                throw new BusinessException(400, "Discount amount cannot exceed subtotal amount.");
            }

            decimal totalAmount = subtotalAmount - discountAmount;

            var now = DateTime.UtcNow;
            string note = request.Note.Trim();

            string? uploadedObjectKey = null;
            bool isNewObjectKey = false;

            await uow.BeginTransactionAsync(ct);

            try
            {
                order.SubtotalAmount = subtotalAmount;
                order.DiscountAmount = discountAmount;
                order.TotalAmount = totalAmount;
                order.UpdatedAt = now;
                order.UpdatedBy = username;
                order.UpdatedNote = note;

                payment.UpdatedAt = now;
                payment.UpdatedBy = username;
                payment.UpdatedNote = note;

                // Update payment only for fields sent in request
                if (request.PaymentMethodId.HasValue)
                {
                    payment.PaymentMethodId = request.PaymentMethodId.Value;
                }

                payment.Amount = totalAmount;

                if (request.PaymentDate.HasValue)
                {
                    payment.PaymentDate = DateTimeHelper.JakartaToUtc(request.PaymentDate.Value);
                }

                if (request.ReferenceNo is not null)
                {
                    payment.ReferenceNo = request.ReferenceNo.Trim();
                }

                // Upload payment proof if provided
                if (request.PaymentProof is not null)
                {
                    var file = request.PaymentProof;
                    var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

                    if (!string.IsNullOrWhiteSpace(payment.StorageKey))
                    {
                        // Replace existing file using the same object key
                        uploadedObjectKey = payment.StorageKey;
                    }
                    else
                    {
                        // Generate a new object key if no existing file
                        uploadedObjectKey = $"payments/{now:yyyy/MM}/{Guid.NewGuid()}{extension}";
                        isNewObjectKey = true;
                    }

                    await using var stream = file.OpenReadStream();

                    await objectStorageService.UploadAsync(
                        stream,
                        uploadedObjectKey,
                        file.ContentType,
                        ct);

                    payment.StorageKey = uploadedObjectKey;
                    payment.FileName = Path.GetFileName(file.FileName);
                    payment.FileSize = file.Length;
                    payment.FileType = file.ContentType;
                }

                // Activity Log
                var activity = new ActivityLogEn
                {
                    OrderId = order.Id,
                    EntityId = payment.Id,
                    EntityTypeId = ActivityEntityType.PAYMENT,
                    ActionCodeId = ActivityActionCode.PAYMENT_UPDATED,
                    Description = "Pembayaran berhasil diperbarui",
                    ActorUsername = username,
                    CreatedAt = now,
                    Metadata = null
                };

                activityRepo.Add(activity);

                await uow.SaveChangesAsync(ct);
                await uow.CommitAsync(ct);

                return payment.Id;
            }
            catch
            {
                await uow.RollbackAsync(CancellationToken.None);

                // Cleanup only newly created file
                // Existing file must not be deleted because it may have been overwritten.
                if (isNewObjectKey && uploadedObjectKey is not null)
                {
                    try
                    {
                        await objectStorageService.DeleteAsync(
                            uploadedObjectKey,
                            CancellationToken.None);
                    }
                    catch
                    {
                        // Jangan menutupi exception utama.
                        // Catat kegagalan cleanup melalui logger.
                    }
                }

                throw;
            }
        }

        public async Task<long> Assign(long id, OrderAssignRequest request,string username, CancellationToken ct)
        {
            ArgumentNullException.ThrowIfNull(request);

            if (string.IsNullOrWhiteSpace(request.InspectorUsername))
            {
                throw new BusinessException(400, "Inspektor wajib di pilih");
            }

            var inspectorUsername = request.InspectorUsername.Trim();

            var inspector = await userRepo.GetInspectorAsync(inspectorUsername, ct);

            if (inspector is null)
            {
                throw new BusinessException(404, "Inspector tidak ditemukan.");
            }

            //customer
            InspectionOrderEn? order = await orderRepo.GetOrderWithCustomer(id, ct);

            if (order is null)
            {
                throw new BusinessException(404, $"Order tidak ditemukan.");
            }

            if (order.TotalUnit <= 0)
            {
                throw new BusinessException(400, "Total unit pada order tidak valid.");
            }

            if (!InspectionStatus.ALLOWED_ORDER_ASSIGNED.Contains(order.StatusId))
            {
                throw new BusinessException(409, "Order tidak dapat di-assign karena status order tidak valid.");
            }

            if (order.Customer is null)
            {
                throw new BusinessException(404, "Customer pada order tidak ditemukan.");
            }

            if (order.Customer.CustTypeId == CustomerType.CUSTOMER &&
                order.StatusId == InspectionStatus.ORDER_CREATED)
            {
                throw new BusinessException(409,"Silakan lakukan pembayaran sebelum melakukan assignment.");
            }

            IReadOnlyList<InspectionOrderItemEn> orderItems = await orderRepo.GetOrderItemsByOrderId(order.Id, ct);

            if (orderItems.Count == 0)
            {
                throw new BusinessException(404, "Order item tidak ditemukan.");
            }

            if (orderItems.Count != order.TotalUnit)
            {
                throw new BusinessException(400, "Jumlah unit pada order tidak sesuai.");
            }

            var activeAssignment = await orderRepo.GetActiveAssignment(id, ct);

            if (activeAssignment?.InspectorUsername.Equals(
                inspectorUsername,
                StringComparison.OrdinalIgnoreCase) == true)
            {
                throw new BusinessException(409,"Inspector tersebut sudah ditugaskan pada order ini.");
            }

            if (activeAssignment is not null)
            {
                var hasSubmittedInspection = await orderRepo.HasSubmittedInspectionAsync(id, ct);

                if (hasSubmittedInspection)
                {
                    throw new BusinessException(409,"Order tidak dapat di-reassign karena sudah ada unit yang disubmit oleh inspector.");
                }
            }

            var previousAssignment = await orderRepo.GetAssignment(id,inspectorUsername,ct);

            // Ambil informasi inspector sebelumnya untuk Activity Log.
            // Hanya dibutuhkan ketika reassignment.
            var previousInspector = activeAssignment is not null
                ? await userRepo.GetInspectorAsync(activeAssignment.InspectorUsername, ct)
                : null;

            var now = DateTime.UtcNow;
            var note = request.Note.Trim();

            await uow.BeginTransactionAsync(ct);

            try
            {
                // 1. Nonaktifkan assignment inspector sebelumnya.
                if (activeAssignment is not null)
                {
                    activeAssignment.StatusId = AssignmentStatus.REASSIGNED;
                    activeAssignment.UpdatedAt = now;
                    activeAssignment.UpdatedBy = username;
                    activeAssignment.UpdatedNote = note;
                }

                // 2. Aktifkan kembali assignment atau buat assignment baru.
                InspectionOrderAssignmentEn currentAssignment;

                if (previousAssignment is not null)
                {
                    previousAssignment.StatusId = AssignmentStatus.ASSIGNED;
                    previousAssignment.AssignedAt = now;
                    previousAssignment.UpdatedAt = now;
                    previousAssignment.UpdatedBy = username;
                    previousAssignment.UpdatedNote = note;

                    currentAssignment = previousAssignment;
                }
                else
                {
                    currentAssignment = new InspectionOrderAssignmentEn
                    {
                        OrderId = order.Id,
                        InspectorUsername = inspectorUsername,
                        StatusId = AssignmentStatus.ASSIGNED,
                        AssignedAt = now,
                        CreatedAt = now,
                        CreatedBy = username,
                        CreatedNote = note
                    };

                    orderRepo.AddAssignment(currentAssignment);
                }

                // 3. Buat inspection hanya saat first assignment.
                if (activeAssignment is null)
                {
                    var inspections = new List<InspectionEn>();

                    foreach (var item in orderItems)
                    {
                        var inspectionNo = await orderRepo.GenerateInspectionNo(order.Customer.CustTypeId,ct);

                        inspections.Add(new InspectionEn
                        {
                            OrderItemId = item.Id,
                            InspectionNo = inspectionNo,
                            CreatedAt = now,
                            CreatedBy = username
                        });
                    }

                    inspectionRepo.AddRange(inspections);
                }

                // 4. Update Order.
                order.StatusId = InspectionStatus.INSPECTOR_ASSIGNED;
                order.ScheduleAt = DateTimeHelper.JakartaToUtc(request.ScheduleAt);
                order.UpdatedAt = now;
                order.UpdatedBy = username;
                order.UpdatedNote = note;

                // 5. Insert Activity Log.
                var isReassignment = activeAssignment is not null;

                var activity = new ActivityLogEn
                {
                    OrderId = order.Id,
                    EntityId = currentAssignment.Id,
                    EntityTypeId = ActivityEntityType.ASSIGNMENT,

                    ActionCodeId = isReassignment
                        ? ActivityActionCode.INSPECTOR_REASSIGNED
                        : ActivityActionCode.INSPECTOR_ASSIGNED,

                    Description = isReassignment
                        ? $"Inspector reassigned: {previousInspector?.Username} to {inspector?.Username}"
                        : $"Inspector assigned: {inspector.Username}",

                    ActorUsername = username,
                    CreatedAt = now,

                    Metadata = isReassignment
                        ? JsonSerializer.Serialize(new
                        {
                            previousInspector = previousInspector?.Username,
                            newInspector = inspector?.Username
                        })
                        : JsonSerializer.Serialize(new
                        {
                            inspector = inspector?.Username,
                        })
                };

                activityRepo.Add(activity);

                // 6. Save and Commit.
                await uow.SaveChangesAsync(ct);
                await uow.CommitAsync(ct);

                return order.Id;
            }
            catch
            {
                await uow.RollbackAsync(CancellationToken.None);
                throw;
            }
        }

        public async Task DeleteOrderItem(long id, long itemId, DeleteOrderItemRequest request, string username, CancellationToken ct = default)
        {
            ArgumentNullException.ThrowIfNull(request);

            InspectionOrderEn? order = await orderRepo.GetOrderAsync(id, ct);

            if (order is null)
            {
                throw new BusinessException(404, $"Order tidak ditemukan.");
            }

            if (!InspectionStatus.ALLOWED_DELETE_ITEM.Contains(order.StatusId))
            {
                throw new BusinessException(400, "Order tidak dapat dihapus pada status ini.");
            }

            int totalItems = await orderRepo.CountOrderItems(order.Id, ct);

            if (totalItems <= 1)
            {
                throw new BusinessException(400, "Order harus memiliki minimal 1 unit.");
            }

            InspectionOrderItemEn? item = await orderRepo.GetOrderItem(id, itemId, ct);

            if (item is null)
            {
                throw new BusinessException(404, $"Order item tidak ditemukan.");
            }

            if(await orderRepo.HasSubmittedInspectionItemAsync(order.Id, item.Id,ct))
            {
                throw new BusinessException(
                    400,
                    "Unit tidak dapat dihapus karena inspection sudah di-submit oleh Inspector."
                );
            }

            VehicleEn? vehicle = await vehicleRepo.GetByIdAsync(item.VehicleId, ct);

            if (vehicle is null)
            {
                throw new BusinessException(404, "Vehicle tidak ditemukan.");
            }

            var now = DateTime.UtcNow;

            await uow.BeginTransactionAsync(ct);

            try
            {
                await inspectionRepo.DeleteByOrderItemId(item.Id, ct);

                orderRepo.DeleteOrderItem(item);
                vehicleRepo.DeleteVehicle(vehicle);

                order.TotalUnit = totalItems - 1;
                order.UpdatedAt = now;
                order.UpdatedBy = username;
                order.UpdatedNote = request.Note.Trim();

                var activity = new ActivityLogEn
                {
                    OrderId = order.Id,
                    EntityId = item.Id,
                    EntityTypeId = ActivityEntityType.ORDER_ITEM,
                    ActionCodeId = ActivityActionCode.ORDER_ITEM_DELETED,
                    Description = $"Unit {vehicle.PlateNo} berhasil dihapus dari order.",
                    ActorUsername = username,
                    CreatedAt = now,
                    Metadata = JsonSerializer.Serialize(new
                    {
                        vehicleId = vehicle.Id,
                        plateNo = vehicle?.PlateNo,
                        brand = vehicle?.Brand?.Name,
                        model = vehicle?.Model?.Name,
                        variant = vehicle?.Variant?.Name
                    })
                };

                activityRepo.Add(activity);

                await uow.SaveChangesAsync(ct);
                await uow.CommitAsync(ct);
            }
            catch
            {
                await uow.RollbackAsync(CancellationToken.None);

                throw;
            }
        }

        public async Task Update(long id, UpdateOrderRequest request, string username, CancellationToken ct = default)
        {
            ArgumentNullException.ThrowIfNull(request);

            InspectionOrderEn? order = await orderRepo.GetOrderAsync(id, ct);

            if (order is null)
            {
                throw new BusinessException(404, $"Order tidak ditemukan.");
            }

            if (request.PicName is not null)
            {
                order.PicName= request.PicName.Trim();
            }

            if (request.PicPhone is not null)
            {
                var phone = request.PicPhone.Trim();

                if (phone.Length > 0 && !System.Text.RegularExpressions.Regex.IsMatch(phone, @"^628[0-9]{7,12}$"))
                {
                    throw new BusinessException(400, "Phone harus diawali 628 dan terdiri dari 10–15 digit.");
                }

                order.PicPhone = phone;
            }

            if (request.ScheduleAt.HasValue && (InspectionStatus.ALLOWED_ORDER_EDIT_SCHEDULE.Contains(order.StatusId)))
            {
                order.ScheduleAt= DateTimeHelper.JakartaToUtc(request.ScheduleAt.Value);
            }

            var now = DateTime.UtcNow;

            await uow.BeginTransactionAsync(ct);

            try
            {
                order.UpdatedAt = now;
                order.UpdatedBy = username;
                order.UpdatedNote = request.Note.Trim();

                var activity = new ActivityLogEn
                {
                    OrderId = order.Id,
                    EntityTypeId = ActivityEntityType.ORDER,
                    ActionCodeId = ActivityActionCode.ORDER_UPDATED,
                    Description = "Order berhasil di update",
                    ActorUsername = username,
                    CreatedAt = now,
                    Metadata = null
                };

                activityRepo.Add(activity);

                await uow.SaveChangesAsync(ct);
                await uow.CommitAsync(ct);
            }
            catch
            {
                await uow.RollbackAsync(CancellationToken.None);

                throw;
            }
        }

        public async Task Cancel(long id, CancelOrderRequest request, string username, CancellationToken ct = default)
        {
            ArgumentNullException.ThrowIfNull(request);

            InspectionOrderEn? order = await orderRepo.GetOrderAsync(id, ct);

            if (order is null)
            {
                throw new BusinessException(404, $"Order tidak ditemukan.");
            }

            if (!InspectionStatus.ALLOWED_CANCEL_ORDER.Contains(order.StatusId))
            {
                throw new BusinessException(409, "Order tidak dapat di cancel karena status order tidak valid.");
            }

            var now = DateTime.UtcNow;

            await uow.BeginTransactionAsync(ct);

            try
            {
                order.StatusId = InspectionStatus.CANCELLED;
                order.UpdatedAt = now;
                order.UpdatedBy = username;
                order.UpdatedNote = request.Note.Trim();

                var activity = new ActivityLogEn
                {
                    OrderId = order.Id,
                    EntityTypeId = ActivityEntityType.ORDER,
                    ActionCodeId = ActivityActionCode.ORDER_CANCELED,
                    Description = "Order berhasil di cancel",
                    ActorUsername = username,
                    CreatedAt = now,
                    Metadata = null
                };

                activityRepo.Add(activity);

                await uow.SaveChangesAsync(ct);
                await uow.CommitAsync(ct);
            }
            catch
            {
                await uow.RollbackAsync(CancellationToken.None);

                throw;
            }
        }
    }
}
