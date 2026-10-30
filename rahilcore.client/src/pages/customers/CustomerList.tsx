import DataTable from "../../components/shared/data-table/DataTable";
import {
    customerColumns,
    type Customer,
} from "../../features/customers/components/customerColumns";
import CustomerMobileCard from "../../features/customers/components/CustomerMobileCard";
import { useState } from "react";
import CustomerListToolbar, {
    type CustomerListQuery,
} from "../../features/customers/components/CustomerListToolbar";

export default function CustomerList() {
    const customerNames = [
        "PT Maju Jaya",
        "CV Berkah Abadi",
        "PT Sinar Mandiri",
        "CV Cipta Karya",
        "PT Nusantara Sejahtera",
        "UD Sumber Rezeki",
        "PT Global Teknologi",
        "CV Mitra Usaha",
        "PT Cahaya Abadi",
        "PT Sentosa Makmur",
        "CV Bintang Timur",
        "PT Indo Persada",
        "PT Karya Utama",
        "CV Anugerah Jaya",
        "PT Mega Pratama",
        "PT Solusi Digital Indonesia",
        "CV Mitra Sejahtera Abadi",
        "PT Teknologi Nusantara International",
        "UD Berkah Mandiri",
        "PT Cipta Solusi Global",
    ];

    const cities = [
        "Jakarta",
        "Bandung",
        "Tangerang",
        "Surabaya",
        "Medan",
        "Semarang",
        "Padang",
        "Pekanbaru",
    ];

    const customers: Customer[] = customerNames.map((name, index) => {
        const id = index + 1;
        const customerNumber = String(id).padStart(3, "0");

        const createdDate = new Date(2026, 5 + (index % 5), 10 + (index % 18), 9, 0);

        const activityDate = new Date(
            2026,
            9,
            28 - (index % 20),
            14 + (index % 8),
            15
        );

        return {
            id,
            custCode: `CUST-${customerNumber}`,
            custName: name,
            phone: `628981728${String(29 + index).padStart(2, "0")}`,
            email: `customer${id}@example.com`,
            cityName: cities[index % cities.length],
            status: index % 3 === 0 ? "Inactive" : "Active",
            createdAt: createdDate.toISOString(),
            lastActivityAt: activityDate.toISOString(),
            lastActivityBy: [
                "Rahmad Ilahi",
                "Admin",
                "System",
                "Operator",
            ][index % 4],
        };
    });

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const totalItems = customers.length;

    const totalPages = Math.ceil(totalItems / pageSize);

    const paginatedCustomers = customers.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    function handlePageChange(newPage: number) {
        setPage(newPage);
    }

    function handlePageSizeChange(newPageSize: number) {
        setPageSize(newPageSize);
        setPage(1);
    }

    const [,setQuery] = useState<CustomerListQuery>({
        searchBy: "custName",
        searchKey: "",
        sortBy: "lastActivityAt",
        sortDirection: "desc",
        filters: {
            custTypeIds: [],
            cityIds: [],
            status: [],
        },
    });

    function handleQueryChange(nextQuery: CustomerListQuery) {
        setQuery(nextQuery);
        setPage(1);
    }

    return (
        <div className="w-full min-w-0 space-y-3">
            <div className="px-1">
                <h1 className="text-xl font-semibold tracking-tight">
                    Customers
                </h1>
                <p className="text-sm text-muted-foreground">
                    Kelola data customer.
                </p>
            </div>

            <CustomerListToolbar onQueryChange={handleQueryChange} />

            <DataTable
                columns={customerColumns}
                data={paginatedCustomers}
                getRowId={(row) => row.id}
                renderMobile={(row) => (
                    <CustomerMobileCard customer={row} />
                )}
                pagination={{
                    page,
                    pageSize,
                    totalItems,
                    totalPages,
                }}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
            />
        </div>
    );
}