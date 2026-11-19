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
        public async Task<long> CreateOrderForCustomer(CreateOrderCustomerRequest request, string createdBy, CancellationToken ct = default)
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
                throw new BusinessException(400, $"Form Inspeksi dengan ID '{request.InspectionFormId}' tidak valid.");
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
                        throw new BusinessException(404, $"Customer dengan ID '{request.CustomerId}' tidak ditemukan.");
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
                        CreatedBy = createdBy,
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
                    CreatedBy = createdBy,
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
                    CreatedBy = createdBy,
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
                    CreatedBy = createdBy,
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
                    ActorUsername = createdBy,
                    CreatedAt = now,
                    Metadata = ""
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

        public async Task<long> CreateOrderForDealer(CreateOrderDealerRequest request, string createdBy, CancellationToken ct)
        {
            ArgumentNullException.ThrowIfNull(request);

            if (!await customerRepo.ExistsByIdAsync(request.CustomerId, ct))
            {
                throw new BusinessException(404, $"Customer dengan ID '{request.CustomerId}' tidak ditemukan.");
            }

            if (request.InspectionFormId != InspectionForm.DEALER_INSPECTION &&
                request.InspectionFormId != InspectionForm.CUSTOMER_INSPECTION)
            {
                throw new BusinessException(400, $"Form Inspeksi dengan ID '{request.InspectionFormId}' tidak valid.");
            }

            var now = DateTime.UtcNow;
            var note = request.Note.Trim();

            string orderCode = await orderRepo.GenerateOrderNoAsync(CustomerType.DEALER, ct);

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
                CreatedBy = createdBy,
                CreatedAt = now,
                CreatedNote = note,
            };

            await uow.BeginTransactionAsync(ct);

            try
            {
                // 1. Insert Order
                orderRepo.Add(order);
                await uow.SaveChangesAsync(ct);

                // 2. Prepare Vehicles
                var vehicles = Enumerable.Range(0, request.TotalUnit)
                    .Select(_ => new VehicleEn
                    {
                        CustomerId = request.CustomerId,
                        CreatedAt = now,
                        CreatedBy = createdBy,
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
                    CreatedBy = createdBy,
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
                    ActorUsername = createdBy,
                    CreatedAt = now,
                    Metadata = ""
                };

                await uow.CommitAsync(ct);

                return order.Id;
            }
            catch
            {
                await uow.RollbackAsync(CancellationToken.None);
                throw;
            }
        }

        public async Task<long> CreatePayment(long id, CreatePaymentRequest request, string createdBy, CancellationToken ct = default)
        {
            ArgumentNullException.ThrowIfNull(request);

            InspectionOrderEn? order = await orderRepo.GetByIdAsync(id, ct);

            if (order is null)
            {
                throw new BusinessException(404, $"Order dengan ID '{id}' tidak ditemukan.");
            }

            if(await orderRepo.ExistsPaymentAsync(id, ct))
            {
                throw new BusinessException(409, "Payment already exists.");
            }

            if (order.Customer is null)
            {
                throw new BusinessException(404, "Customer pada order tidak ditemukan.");
            }

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

            await uow.BeginTransactionAsync(ct);

            string? uploadedObjectKey = null;

            try
            {
                var now = DateTime.UtcNow;
                var note = request.Note.Trim();
               
                decimal totalAmount = request.SubtotalAmount - discountAmount;

                order.StatusId = InspectionStatus.AWAITING_ASSIGNMENT;
                order.PaymentStatusId = PaymentStatus.PAID;
                order.DiscountAmount = request.DiscountAmount;
                order.SubtotalAmount = request.SubtotalAmount;
                order.InvoiceDate = now;
                order.InvoiceNo = InvoiceHelper.GenerateInvoiceNo(order.Customer.CustTypeId,order.Id,now);
                order.UpdatedAt = now;
                order.UpdatedBy = createdBy;
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
                    CreatedBy = createdBy,
                    CreatedNote = note
                };

                // Upload payment proof jika ada
                if (request.PaymentProof is not null)
                {
                    var file = request.PaymentProof;
                    var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

                    uploadedObjectKey =$"payments/{now:yyyy/MM}/{Guid.NewGuid()}{extension}";

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
                    ActorUsername = createdBy,
                    CreatedAt = now,
                    Metadata = ""
                };

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
                throw new BusinessException(400,$"Field '{query.SortBy}' is not allowed for sorting.");
            }

            var today = DateOnly.FromDateTime(TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow,TimeZoneInfo.FindSystemTimeZoneById("Asia/Jakarta")));
            
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

            var url = await objectStorageService.GetPresignedUrlAsync(payment.StorageKey,15);

            return new FileAccessDto(
                Url: url,
                FileName: payment.FileName!,
                FileType: payment.FileType!,
                FileSize: payment.FileSize!.Value
            );
        }

        public async Task<long> Assign(long id, AssignOrderRequest request,string createdBy, CancellationToken ct)
        {
            ArgumentNullException.ThrowIfNull(request);

            if (string.IsNullOrWhiteSpace(request.InspectorUsername))
                throw new BusinessException(400, "Inspector username is required.");

            var inspectorUsername = request.InspectorUsername.Trim();

            var order = await orderRepo.GetByIdAsync(id, ct);

            if (order is null)
                throw new BusinessException(404, $"Order dengan ID '{id}' tidak ditemukan.");

            if (order.TotalUnit <= 0)
                throw new BusinessException(400, "Total unit pada order tidak valid.");

            if (order.StatusId != InspectionStatus.ORDER_CREATED &&
                order.StatusId != InspectionStatus.AWAITING_ASSIGNMENT &&
                order.StatusId != InspectionStatus.INSPECTOR_ASSIGNED)
            {
                throw new BusinessException(
                    409,
                    "Order tidak dapat di-assign karena status order tidak valid."
                );
            }

            if (order.Customer is null)
                throw new BusinessException(404, "Customer pada order tidak ditemukan.");

            if (order.Customer.CustTypeId == CustomerType.CUSTOMER &&
                order.StatusId == InspectionStatus.ORDER_CREATED)
            {
                throw new BusinessException(
                    409,
                    "Silakan lakukan pembayaran sebelum melakukan assignment."
                );
            }

            var inspector = await userRepo.GetInspectorAsync(inspectorUsername, ct);

            if (inspector is null)
                throw new BusinessException(404, "Inspector tidak ditemukan.");

            var orderItem = await orderRepo.GetOrderItemByOrderId(id, ct);

            if (orderItem is null)
                throw new BusinessException(404, "Order item tidak ditemukan.");

            var activeAssignment = await orderRepo.GetActiveAssignment(id, ct);

            if (activeAssignment?.InspectorUsername.Equals(
                inspectorUsername,
                StringComparison.OrdinalIgnoreCase) == true)
            {
                throw new BusinessException(
                    409,
                    "Inspector tersebut sudah ditugaskan pada order ini."
                );
            }

            if (activeAssignment is not null)
            {
                var hasSubmittedInspection =
                    await orderRepo.HasSubmittedInspectionAsync(id, ct);

                if (hasSubmittedInspection)
                {
                    throw new BusinessException(
                        409,
                        "Order tidak dapat di-reassign karena sudah ada unit yang disubmit oleh inspector."
                    );
                }
            }

            var previousAssignment = await orderRepo.GetAssignment(
                id,
                inspectorUsername,
                ct
            );

            // Ambil informasi inspector sebelumnya untuk Activity Log.
            // Hanya dibutuhkan ketika reassignment.
            var previousInspector = activeAssignment is not null
                ? await userRepo.GetInspectorAsync(activeAssignment.InspectorUsername, ct)
                : null;

            await uow.BeginTransactionAsync(ct);

            try
            {
                var now = DateTime.UtcNow;
                var note = request.Note.Trim();

                // 1. Nonaktifkan assignment inspector sebelumnya.
                if (activeAssignment is not null)
                {
                    activeAssignment.StatusId = AssignmentStatus.REASSIGNED;
                    activeAssignment.UpdatedAt = now;
                    activeAssignment.UpdatedBy = createdBy;
                    activeAssignment.UpdatedNote = note;
                }

                // 2. Aktifkan kembali assignment atau buat assignment baru.
                InspectionOrderAssignmentEn currentAssignment;

                if (previousAssignment is not null)
                {
                    previousAssignment.StatusId = AssignmentStatus.ASSIGNED;
                    previousAssignment.AssignedAt = now;
                    previousAssignment.UpdatedAt = now;
                    previousAssignment.UpdatedBy = createdBy;
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
                        CreatedBy = createdBy,
                        CreatedNote = note
                    };

                    orderRepo.AddAssignment(currentAssignment);
                }

                // 3. Buat inspection hanya saat first assignment.
                if (activeAssignment is null)
                {
                    var inspections = new List<InspectionEn>();

                    for (var unit = 0; unit < order.TotalUnit; unit++)
                    {
                        var inspectionNo = await orderRepo.GenerateInspectionNo(
                            order.Customer.CustTypeId,
                            ct
                        );

                        inspections.Add(new InspectionEn
                        {
                            OrderItemId = orderItem.Id,
                            InspectionNo = inspectionNo,
                            CreatedAt = now,
                            CreatedBy = createdBy
                        });
                    }

                    inspectionRepo.AddRange(inspections);
                }

                // 4. Update Order.
                order.StatusId = InspectionStatus.INSPECTOR_ASSIGNED;
                order.ScheduleAt = DateTimeHelper.JakartaToUtc(request.ScheduleAt);
                order.UpdatedAt = now;
                order.UpdatedBy = createdBy;
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

                    ActorUsername = createdBy,
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

        public async Task<OrderDetailDto?> GetByIdAsync(long id, CancellationToken ct = default)
        {
            if (id <= 0)
            {
                return null;
            }

            InspectionOrderEn? order = await orderRepo.GetByIdAsync(id, ct);
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
            OrderAssignmentDto? assignment = await orderRepo.GetOrderAssignment(id, ct);
            IReadOnlyList<OrderActivityDto> activities = await activityRepo.GetByOrderIdAsync(id,ct);

            if (order.Customer is null) return null;
            if (orderItems.Count == 0) return null;

            var customer = new OrderCustomerDto
            {
                CustomerCode = order.Customer.CustCode,
                CustomerName = order.Customer.CustName,
                CustomerType = order.Customer.CustType?.ParamName ?? "-",
                Email = order.Customer.Email,
                Phone = order.Customer.Phone,
                Address = order.Customer.Address
            };

            var inspectionForm = orderItems 
                .Select(x => x.InspectionForm)
                .FirstOrDefault(x => x != null);

            IReadOnlyList<OrderVehicleDto> vehicles = orderItems
                .Select(x => new OrderVehicleDto
                {
                    VehicleId = x.VehicleId,
                    PlateNo = x.Vehicle?.PlateNo ?? string.Empty,
                    Brand = x.Vehicle?.Brand?.Name ?? string.Empty,
                    Model = x.Vehicle?.Model?.Name ?? string.Empty,
                    Variant = x.Vehicle?.Variant?.Name ?? string.Empty,
                    YearOfManufacture = x.Vehicle?.YearOfManufacture ?? 0,
                    ExteriorColor = x.Vehicle?.ExteriorColor?.Name ?? string.Empty
                })
                .OrderBy(x => x.VehicleId)
                .ToList();

            return new OrderDetailDto
            {
                Id = order.Id,
                OrderNo = order.OrderNo,
                StatusId = order.StatusId,
                Status = order.Status?.ParamName!,
                PaymentStatusId = order.PaymentStatusId,
                PaymentStatus = order.PaymentStatus?.ParamName!,
                CreatedAt = order.CreatedAt,
                CreatedBy = order.CreatedBy ?? string.Empty,
                CreatedNote = order.CreatedNote ?? string.Empty,
                PicName = order.PicName,
                PicPhone = order.PicPhone,
                ScheduleAt = order.ScheduleAt,
                Note = order.CreatedNote,
                InspectionFormId = inspectionForm!.Id,
                InspectionFormName = inspectionForm!.Name,

                Customer = customer,
                Vehicles = vehicles,
                Payment = payment,
                Assignment = assignment,
                IsAssigned = assignment != null,
                Activities = activities
            };
        }
    }
}
