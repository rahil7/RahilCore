using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using RahilCore.Application.Abstractions.Persistence;
using RahilCore.Application.Features.City;
using RahilCore.Application.Features.Customers;
using RahilCore.Application.Features.MasterParameters;
using RahilCore.Application.Features.Orders;
using RahilCore.Application.Features.Vehicles;
using RahilCore.Infrastructure.Persistence;
using RahilCore.Infrastructure.Persistence.DbContext;
using RahilCore.Infrastructure.Persistence.Repositories;
using RahilCore.Infrastructure.Security;

namespace RahilCore.Infrastructure.DependencyInjection;

public static class InfrastructureServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionString =
            configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException(
                "Connection string 'DefaultConnection' belum dikonfigurasi.");

        services.AddDbContext<RahilCoreDbContext>(options => options.UseNpgsql(connectionString));

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IPasswordHasherService, PasswordHasherService>();
        services.AddScoped<ICustomerRepository, CustomerRepository>();
        services.AddScoped<IMasterParameterRepository, MasterParameterRepository>();
        services.AddScoped<ICityRepository, CityRepository>();
        services.AddScoped<IOrderRepository, OrderRepository>();
        services.AddScoped<IVehicleRepository, VehicleRepository>();

        services.AddScoped<IUnitOfWork, UnitOfWork>();

        return services;
    }
}
