"use server";

import { getMandiDataForCrop } from "@/lib/api/mandiDataProvider";

export async function fetchMandiDataAction(crop: string) {
    return await getMandiDataForCrop({ crop });
}