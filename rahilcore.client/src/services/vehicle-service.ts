import type { ApiResponse } from "../types/api";
import type { FilterOption } from "../types/common";
import { apiClient } from "../lib/api-client";

export const vehicleService = {
    getModelLookup(brandId: number) {
        return apiClient.get<ApiResponse<FilterOption[]>>(
            `/api/vehicles/brands/${brandId}/models/lookup`,
        );
    },

    getVariantLookup(modelId: number) {
        return apiClient.get<ApiResponse<FilterOption[]>>(
            `/api/vehicles/models/${modelId}/variants/lookup`,
        );
    },
};