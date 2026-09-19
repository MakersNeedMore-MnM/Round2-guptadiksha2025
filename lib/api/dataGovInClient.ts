// lib/api/dataGovInClient.ts
// Server-only module. Never import this from a "use client" component.

const RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070";
const BASE_URL = `https://api.data.gov.in/resource/${RESOURCE_ID}`;

export interface DataGovRecord {
    state: string;
    district: string;
    market: string;
    commodity: string;
    variety: string;
    grade: string;
    arrival_date: string;
    min_price: number;
    max_price: number;
    modal_price: number;
}

export interface FetchOptions {
    state?: string;
    commodity?: string;
    limit?: number;
    timeoutMs?: number;
}

export async function fetchMandiPrices(
    opts: FetchOptions = {}
): Promise<DataGovRecord[]> {
    const apiKey = process.env.DATA_GOV_IN_API_KEY;
    if (!apiKey) {
        throw new Error("DATA_GOV_IN_API_KEY is not set");
    }

    const params = new URLSearchParams({
        "api-key": apiKey,
        format: "json",
        limit: String(opts.limit ?? 500),
    });

    // Server-side filtering
    if (opts.state) params.append("filters[state]", opts.state);
    if (opts.commodity) params.append("filters[commodity]", opts.commodity);

    const controller = new AbortController();
    const timeout = setTimeout(
        () => controller.abort(),
        opts.timeoutMs ?? 6000
    );

    try {
        const res = await fetch(`${BASE_URL}?${params.toString()}`, {
            signal: controller.signal,
            // Cache for 30 min — mandi data doesn't change that often
            next: { revalidate: 1800 },
        });

        if (!res.ok) {
            throw new Error(`data.gov.in responded ${res.status}`);
        }

        const json = await res.json();
        const records = json?.records;
        if (!Array.isArray(records)) {
            throw new Error("Unexpected API response shape");
        }

        return records as DataGovRecord[];
    } finally {
        clearTimeout(timeout);
    }
}