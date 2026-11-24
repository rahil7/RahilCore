namespace RahilCore.Application.Common.Constants
{
    public static class InspectionStatus
    {
        public const long ORDER_CREATED = 4;
        public const long AWAITING_ASSIGNMENT = 5;
        public const long INSPECTOR_ASSIGNED = 6;
        public const long INSPECTION_SUBMITTED = 7;
        public const long UNDER_SCORING = 8;
        public const long AWAITING_APPROVAL = 9;
        public const long REVISION_REQUIRED = 10;
        public const long APPROVED = 11;
        public const long COMPLETED = 12;
        public const long CANCELLED = 13;

        public static readonly long[] ALLOWED_ORDER_EDIT =
        [
            ORDER_CREATED,
            AWAITING_ASSIGNMENT
        ];

        public static readonly long[] ALLOWED_ORDER_ASSIGNED =
        [
            ORDER_CREATED,
            AWAITING_ASSIGNMENT,
            INSPECTOR_ASSIGNED
        ];

        public static readonly long[] ALLOWED_DELETE_ITEM =
        [
            ORDER_CREATED,
            AWAITING_ASSIGNMENT,
            INSPECTOR_ASSIGNED
        ];

        public static readonly long[] ALLOWED_ORDER_EDIT_SCHEDULE =
        [
            ORDER_CREATED,
            AWAITING_ASSIGNMENT
        ];

        public static readonly long[] ALLOWED_CANCEL_ORDER =
        [
            ORDER_CREATED,
            AWAITING_ASSIGNMENT,
        ];
    }
}
