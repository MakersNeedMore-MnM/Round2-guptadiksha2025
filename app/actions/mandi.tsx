"use server";

import { getMandiDataForCrop } from "@/lib/api/mandiDataProvider";

export async function fetchMandiDataAction(crop: string) {
    return await getMandiDataForCrop({
        crop,
        // No `state` — fetch India-wide, then filter to nearby states inside the provider
    });
}