using RahilCore.Application.Common.DTOs;
using RahilCore.Application.Common.Exceptions;
using RahilCore.Application.Features.Customers;
using RahilCore.Application.Features.Inspections.Queries;
using RahilCore.Application.Features.MasterParameters;
using RahilCore.Application.Features.Orders;
using RahilCore.Application.Features.Orders.DTOs;
using RahilCore.Application.Features.Orders.Queries;
using RahilCore.Application.Features.Users;
using RahilCore.Application.Features.Vehicles;
using RahilCore.Domain.Entities;
using RahilCore.Domain.Entities.Inspections;

namespace RahilCore.Application.Features.Inspections.DTOs
{
    public class InspectionService(
            IInspectionRepository inspectionRepo,
            IOrderRepository orderRepo,
            IUserRepository userRepo,
            IVehicleRepository vehicleRepo,
            IMasterParameterRepository masterParameterRepo,
            IActivityRepository activityRepo
        ) : IInspectionService
    {
        // options
        public async Task<InspectionFilterOptions?> GetFilterOptionsAsync(CancellationToken ct = default)
        {
            var customerTypes = await masterParameterRepo
                .GetFilterOptionsAsync(MasterParameterTypes.CUST_TYPE, ct);

            var inspectionStatus = await masterParameterRepo
                .GetFilterOptionsAsync(MasterParameterTypes.INSP_STATUS, ct);

            var inspectorLookup = await userRepo.GetInspectorLookup(ct);

            var searchFields = InspectionQueryMetadata.Fields
                .Where(x => x.CanSearch)
                .Select(x => new QueryFieldOptionDto
                {
                    Value = x.Field,
                    Label = x.Label
                })
                .ToList();

            var sortFields = InspectionQueryMetadata.Fields
                .Where(x => x.CanSort)
                .Select(x => new QueryFieldOptionDto
                {
                    Value = x.Field,
                    Label = x.Label
                })
                .ToList();

            return new InspectionFilterOptions
            {
                CustomerTypes = customerTypes,
                InspectionStatus = inspectionStatus,
                Inspectors = inspectorLookup,
                SearchFields = searchFields,
                SortFields = sortFields
            };
        }

        // queries
        public async Task<(IReadOnlyList<InspectionListDto> items, int totalItems)> GetPagedAsync(InspectionListQuery query, CancellationToken ct = default)
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
                ? InspectionQueryMetadata.DefaultSortBy
                : query.SortBy.Trim();

            query.SortDirection = string.IsNullOrWhiteSpace(query.SortDirection)
                ? InspectionQueryMetadata.DefaultSortDirection
                : string.Equals(query.SortDirection, "asc", StringComparison.OrdinalIgnoreCase)
                    ? "asc"
                    : "desc";

            if (query.SearchBy is not null &&
                !InspectionQueryMetadata.CanSearch(query.SearchBy))
            {
                throw new BusinessException(400, $"Field '{query.SearchBy}' is not allowed for searching.");
            }

            if (!InspectionQueryMetadata.CanSort(query.SortBy))
            {
                throw new BusinessException(400, $"Field '{query.SortBy}' is not allowed for sorting.");
            }

            var today = DateOnly.FromDateTime(TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("Asia/Jakarta")));

            query.ScheduleFrom ??= today;
            query.ScheduleTo ??= today;

            if (query.ScheduleFrom > query.ScheduleTo)
            {
                throw new BusinessException(400, "CreatedFrom cannot be later than CreatedTo.");
            }

            query.StatusIds = query.StatusIds?.Where(x => x > 0).Distinct().ToList();

            query.CustTypeIds = query.CustTypeIds?.Where(x => x > 0).Distinct().ToList();

            query.Inspectors = query.Inspectors?
                .Where(x => !string.IsNullOrWhiteSpace(x))
                .Select(x => x.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();

            return await inspectionRepo.GetPagedAsync(query, ct);
        }

        public async Task<InspectionDetailDto?> GetDetail(long id, CancellationToken ct = default)
        {
            if (id <= 0)
            {
                return null;
            }

            InspectionEn? inspection = await inspectionRepo.GetDetail(id, ct);

            if (
                    inspection is null || 
                    inspection.OrderItem is null ||
                    inspection.OrderItem.Order is null ||
                    inspection.OrderItem.Vehicle is null ||
                    inspection.OrderItem.InspectionForm is null ||
                    inspection.OrderItem.Order.Customer is null
                )
            {
                return null;
            }

            VehicleEn? vehicle = await vehicleRepo.GetByIdAsync(inspection.OrderItem.VehicleId, ct);

            if(vehicle is null)
            {
                return null;
            }

            BaseAssignmentDto? assignment = await orderRepo.GetOrderAssignment(inspection.OrderItem.OrderId, ct);
            IReadOnlyList<BaseActivityDto> activities = await activityRepo.GetByOrderIdAsync(inspection.OrderItem.OrderId, ct);

            var customer = inspection.OrderItem.Order.Customer;
            var inspectionCustomer = new BaseCustomerDto
            {
                CustomerCode = customer.CustCode,
                CustomerName = customer.CustName,
                CustomerTypeId = customer.CustTypeId,
                CustomerType = customer.CustType!.ParamName!,
                Email = customer.Email,
                Phone = customer.Phone,
                Address = customer.Address,
            };

            var inspectionVehicle = new InspectionVehicleDto
            {
                PlateNo = vehicle.PlateNo,
                Vin = vehicle.Vin,
                EngineNo = vehicle.EngineNo,
                TaxExpiryDate = vehicle.TaxExpiryDate,
                Odometer = vehicle.Odometer,
                FirstOwnership = vehicle.FirstOwnership,

                BrandId = vehicle.BrandId,
                Brand = vehicle.Brand!.Name,

                ModelId = vehicle.ModelId,
                Model = vehicle.Model!.Name,

                VariantId = vehicle.VariantId,
                Variant = vehicle.Variant!.Name,

                ExteriorColorId = vehicle.ExteriorColorId,
                ExteriorColor = vehicle.ExteriorColor!.Name,

                BodyTypeId = vehicle.BodyTypeId,
                BodyType = vehicle.BodyType!.ParamName,

                InteriorColorId = vehicle.InteriorColorId,
                InteriorColor = vehicle.InteriorColor!.Name,

                FuelTypeId = vehicle.FuelTypeId,
                FuelType = vehicle.FuelType!.ParamName,

                TransmissionId = vehicle.TransmissionId,
                Transmission = vehicle.Transmission!.ParamName,

                OwnershipTypeId = vehicle.OwnershipTypeId,
                OwnershipType = vehicle.OwnershipType!.ParamName,
            };

            return new InspectionDetailDto
            {
                Id = inspection.Id,
                InspectionNo = inspection.InspectionNo,
                OrderNo = inspection.OrderItem.Order.OrderNo,
                StatusId = inspection.OrderItem.Order.StatusId,
                StatusName = inspection.OrderItem.Order.Status!.ParamName!,
                PicName = inspection.OrderItem.Order.PicName,
                PicPhone = inspection.OrderItem.Order.PicPhone,
                InspectionFormId = inspection.OrderItem.InspectionFormId,
                InspectionFormName = inspection.OrderItem.InspectionForm.Name,
                ScheduleAt = inspection.OrderItem.Order.ScheduleAt,
                CreatedAt = inspection.OrderItem.Order.CreatedAt,
                CreatedBy = inspection.OrderItem.Order.CreatedBy,
                CreatedNote = inspection.OrderItem.Order.CreatedNote,
                LastActivityAt = inspection.OrderItem.Order.UpdatedAt ?? inspection.OrderItem.Order.CreatedAt,
                LastActivityBy = inspection.OrderItem.Order.UpdatedBy ?? inspection.OrderItem.Order.CreatedBy ?? string.Empty,
                LastActivityNote = inspection.OrderItem.Order.UpdatedNote ?? inspection.OrderItem.Order.CreatedNote,

                Assignment = assignment,
                Activities = activities,

                Customer = inspectionCustomer,

                vehicle = inspectionVehicle
            };
        }
    }
}
