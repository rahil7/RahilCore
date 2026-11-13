using Microsoft.Extensions.DependencyInjection;
using RahilCore.Application.Features.Auth;
using RahilCore.Application.Features.Customers;
using RahilCore.Application.Features.Orders;
using RahilCore.Application.Features.Users;
using RahilCore.Application.Features.Vehicles;

namespace RahilCore.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddScoped<AuthService>();
            services.AddScoped<CreateUserService>();
            services.AddScoped<ICustomerService, CustomerService>();
            services.AddScoped<IOrderService, OrderService>();
            services.AddScoped<IVehicleService, VehicleService>();

            return services;
        }
    }
}
