export const inspectionDetailMock = {
    id: 101,
    inspectionNo: "IPC26112100011",
    statusId: 5,
    statusName: "Inspection Submitted",

    order: {
        id: 15,
        orderNo: "ORD26111510",
        customerType: "Customer",
    },

    customer: {
        name: "Budi Santoso",
        code: "CUST-016",
        type: "Customer",
        email: "budi@example.com",
        phone: "08123456789",
        address: "Jakarta Selatan, DKI Jakarta",
    },

    vehicle: {
        plateNo: "BB 8017 BS",
        brand: "Audi",
        model: "A5",
        variant: "2.0 TFSI X-Line",
        year: 2025,
        exteriorColor: "Black",
    },

    inspectionFormName: "Vehicle Inspection",

    scheduleAt: "2026-11-24T09:00:00",
    inspector: {
        username: "ip.salim",
        name: "Inspector Salim",
    },

    assignedAt: "2026-11-21T23:27:00",
    submittedAt: "2026-11-24T10:00:00",
    createdAt: "2026-11-21T23:20:00",
    createdBy: "admin",

    lastActivityAt: "2026-11-24T10:00:00",
    lastActivityBy: "Inspector Salim",

    inspectionResult: null,
    scoring: null,

    activities: [],
};

export type InspectionDetailMock = typeof inspectionDetailMock;