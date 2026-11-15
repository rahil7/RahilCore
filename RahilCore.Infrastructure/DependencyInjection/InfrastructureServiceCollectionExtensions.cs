using Amazon.Runtime;
using Amazon.S3;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using RahilCore.Application.Abstractions.Persistence;
using RahilCore.Application.Abstractions.Storage;
using RahilCore.Application.Features.City;
using RahilCore.Application.Features.Customers;
using RahilCore.Application.Features.Inspections;
using RahilCore.Application.Features.MasterParameters;
using RahilCore.Application.Features.Orders;
using RahilCore.Application.Features.Vehicles;
using RahilCore.Infrastructure.Persistence;
using RahilCore.Infrastructure.Persistence.DbContext;
using RahilCore.Infrastructure.Persistence.Repositories;
using RahilCore.Infrastructure.Security;
using RahilCore.Infrastructure.Storage;
using RahilCore.Infrastructure.Storage.Configurations;

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

        var objectStorage = configuration
            .GetSection(ObjectStorageOptions.SectionName)
            .Get<ObjectStorageOptions>()
            ?? throw new InvalidOperationException("ObjectStorage configuration is missing.");

        services.Configure<ObjectStorageOptions>(configuration.GetSection(ObjectStorageOptions.SectionName));

        services.AddSingleton<IAmazonS3>(_ =>
        {
            var credentials = new BasicAWSCredentials(
                objectStorage.AccessKey,
                objectStorage.SecretKey);

            var config = new AmazonS3Config
            {
                ServiceURL = objectStorage.ServiceURL,
                ForcePathStyle = true,
                RequestChecksumCalculation = RequestChecksumCalculation.WHEN_REQUIRED
            };

            return new AmazonS3Client(credentials, config);
        });
        services.AddScoped<IObjectStorageService, ObjectStorageService>();

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IPasswordHasherService, PasswordHasherService>();
        services.AddScoped<ICustomerRepository, CustomerRepository>();
        services.AddScoped<IMasterParameterRepository, MasterParameterRepository>();
        services.AddScoped<ICityRepository, CityRepository>();
        services.AddScoped<IOrderRepository, OrderRepository>();
        services.AddScoped<IVehicleRepository, VehicleRepository>();
        services.AddScoped<IInspectionRepository, InspectionRepository>();

        services.AddScoped<IUnitOfWork, UnitOfWork>();

        return services;
    }
}
