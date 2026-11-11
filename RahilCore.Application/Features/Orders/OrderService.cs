using RahilCore.Application.Abstractions.Persistence;
using RahilCore.Application.Common.Constants;
using RahilCore.Application.Common.Exceptions;
using RahilCore.Application.Features.Customers;
using RahilCore.Application.Features.Orders.Request;
using RahilCore.Application.Features.Vehicles;
using RahilCore.Domain.Entities;
using RahilCore.Domain.Entities.Inspections;

namespace RahilCore.Application.Features.Orders
{
    public class OrderService(
        IUnitOfWork uow,
        IOrderRepository orderRepo,
        ICustomerRepository customerRepo,
        IVehicleRepository vehicleRepo
        ) : IOrderService
    {
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
