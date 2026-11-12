using RahilCore.Application.Abstractions.Persistence;
using RahilCore.Application.Common.Constants;
using RahilCore.Application.Common.Exceptions;
using RahilCore.Application.Common.Helpers;
using RahilCore.Application.Features.City;
using RahilCore.Application.Features.Customers;
using RahilCore.Application.Features.Orders.Request;
using RahilCore.Application.Features.Vehicles;
using RahilCore.Domain.Entities;
using RahilCore.Domain.Entities.Customers;
using RahilCore.Domain.Entities.Inspections;

namespace RahilCore.Application.Features.Orders
{
    public class OrderService(
        IUnitOfWork uow,
        IOrderRepository orderRepo,
        ICustomerRepository customerRepo,
        IVehicleRepository vehicleRepo,
        ICityRepository cityRepo
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
                throw new BusinessException(400,"Kombinasi Brand, Model, dan Variant tidak valid.");
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
                var note = request.Note?.Trim();

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

                string orderCode = await orderRepo.GenerateOrderNoAsync(ct);

                var order = new InspectionOrderEn
                {
                    OrderNo = orderCode,
                    CustomerId = customerId,
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
                throw new BusinessException(400,$"Form Inspeksi dengan ID '{request.InspectionFormId}' tidak valid.");
            }

            var now = DateTime.UtcNow;
            var note = request.Note.Trim();

            string orderCode = await orderRepo.GenerateOrderNoAsync(ct);

            var order = new InspectionOrderEn
            {
                OrderNo = orderCode,
                CustomerId = request.CustomerId,
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

                await uow.CommitAsync(ct);

                return order.Id;
            }
            catch
            {
                await uow.RollbackAsync(CancellationToken.None);
                throw;
            }
        }
    }
}
