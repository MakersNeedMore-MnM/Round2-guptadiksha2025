import { NextResponse } from "next/server";
import { getMandiDataForCrop } from "@/lib/api/mandiDataProvider";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const crop = searchParams.get("crop") ?? "Tomatoes";
    const result = await getMandiDataForCrop({ crop });
    return NextResponse.json(result);
}