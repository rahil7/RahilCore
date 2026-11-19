
import { useNavigate } from "react-router-dom";
import { PageDetailHeader } from "../../../components/layout/PageDetailHeader";
import OrderDetailHeader from "./components/OrderDetailHeader";
import OrderCustomerSection from "./components/OrderCustomerSection";
import OrderInformationSection from "./components/OrderInformationSection";
import OrderVehicleSection from "./components/OrderVehicleSection";
import OrderPaymentSection from "./components/OrderPaymentSection";
import OrderAssignmentSection from "./components/OrderAssignmentSection";
import OrderActivitySection from "./components/OrderActivitySection";

export default function OrderDetail() {
    const navigate = useNavigate();

    // Temporary mock data
    const order = {
        id: 1,
        orderNo: "ORDS26111817",
        statusId: 1,
        status: "New Order",
        paymentStatusId: 1,
        paymentStatus: "Unpaid",
        createdAt: "18 Nov 2026, 22:27",
        createdBy: "admin",
        isAssigned: false,
        picName: "Budi Santoso",
        picPhone: "6281234567890",
        inspectionForm: "Standard Inspection",
        scheduleAt: "20 Nov 2026, 09:00",
        note: "It is a long established fact that a reader will",
        customer: {
            code: "CUST-009",
            name: "CV Cahaya Mobil Nusantara",
            type: "Showroom",
            email: "admin@cahayamobil.com",
            phone: "6281234567890",
            address: "Lorem Ipsum is simply dummy text of the ",
        },
        vehicles: [
            {
                plateNo: "B 1234 ABC",
                brand: "Toyota",
                model: "Avanza",
                variant: "1.5 G CVT",
                yearOfManufacture: 2023,
                exteriorColor: "White",
            },
            {
                plateNo: "B 2345 DEF",
                brand: "Honda",
                model: "HR-V",
                variant: "1.5 SE",
                yearOfManufacture: 2024,
                exteriorColor: "Black",
            },
            {
                plateNo: "B 3456 GHI",
                brand: "Mitsubishi",
                model: "Xpander",
                variant: "Ultimate",
                yearOfManufacture: 2023,
                exteriorColor: "Silver",
            },
            {
                plateNo: "B 4567 JKL",
                brand: "Suzuki",
                model: "XL7",
                variant: "Alpha",
                yearOfManufacture: 2024,
                exteriorColor: "Grey",
            },
            {
                plateNo: "B 5678 MNO",
                brand: "Daihatsu",
                model: "Terios",
                variant: "R Deluxe",
                yearOfManufacture: 2022,
                exteriorColor: "White",
            }
        ],
        payment: null,
        assignment: {
            inspectorCode: "INSP-001",
            inspectorName: "Agus Setiawan",
            scheduleAt: "20 Nov 2026, 09:00",
            assignedAt: "18 Nov 2026, 16:30",
            assignedBy: "admin",
        },
        activities: [
            {
                id: 1,
                action: "Inspector Assigned",
                description: "Inspector assigned: Agus Setiawan",
                createdAt: "18 Nov 2026, 16:30",
                createdBy: "admin",
                type: "ASSIGNMENT" as const,
            },
            {
                id: 2,
                action: "Payment Created",
                description: "Payment record created with Bank Transfer",
                createdAt: "18 Nov 2026, 15:45",
                createdBy: "admin",
                type: "PAYMENT" as const,
            },
            {
                id: 3,
                action: "Order Created",
                description: "Order created successfully",
                createdAt: "18 Nov 2026, 14:20",
                createdBy: "admin",
                type: "ORDER" as const,
            },
        ],
    };

    return (
        <div className="space-y-5">
            <PageDetailHeader
                title="Order Detail"
                backTo="/orders"
            />

            <OrderDetailHeader
                orderNo={order.orderNo}
                orderType={order.orderType}
                status={order.status}
                paymentStatus={order.paymentStatus}
                createdAt={order.createdAt}
                createdBy={order.createdBy}
                canEdit={!order.isAssigned}
                onEdit={() => navigate(`/orders/${order.id}/edit`)}
            />

            <div className="grid gap-4 lg:grid-cols-2">
                <OrderCustomerSection
                    customer={order.customer}
                    picName={order.picName}
                    picPhone={order.picPhone}
                />

                <OrderInformationSection
                    inspectionForm={order.inspectionForm}
                    scheduleAt={order.scheduleAt}
                    note={order.note}
                />
            </div>

            <OrderVehicleSection vehicles={order.vehicles} />

            <OrderPaymentSection
                payment={order.payment}
                onCreate={() => {
                    // Akan kita hubungkan ke PaymentDialog
                }}
                onEdit={() => {
                    // Akan kita hubungkan ke PaymentDialog
                }}
            />

            <OrderAssignmentSection
                assignment={order.assignment}
                canAssign={!order.assignment}
                canReassign={Boolean(order.assignment)}
                onAssign={() => {
                    // Nanti buka AssignmentDialog
                }}
                onReassign={() => {
                    // Nanti buka AssignmentDialog
                }}
            />

            <OrderActivitySection activities={order.activities} />
        </div>
    );
}
