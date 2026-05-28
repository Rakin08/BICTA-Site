import type {
  EventListItem,
  EventDetail,
  ProgramItem,
  ImpactMetricItem,
  PartnerInquiryPayload,
  EventStatus,
  EventType,
  EventMode,
} from "@/types";

const API_BASE = process.env.BICTA_API_URL || process.env.NEXT_PUBLIC_BICTA_API_URL || "";

function getTrpcUrl(procedure: string, input?: unknown): string {
  const base = API_BASE || "http://localhost:3001";
  const url = new URL(`${base}/trpc/${procedure}`);
  if (input !== undefined) {
    url.searchParams.set("input", JSON.stringify(input));
  }
  return url.toString();
}

interface FetchOptions {
  revalidate?: number;
  tags?: string[];
}

async function trpcFetch<T>(
  procedure: string,
  input?: unknown,
  opts?: FetchOptions
): Promise<T | null> {
  if (!API_BASE) {
    return null as T;
  }
  try {
    const url = getTrpcUrl(procedure, input);
    const res = await fetch(url, {
      next: {
        revalidate: opts?.revalidate ?? 60,
        tags: opts?.tags,
      },
    });

    if (!res.ok) {
      return null as T;
    }

    const json = await res.json();
    return json.result?.data ?? (null as T);
  } catch {
    return null as T;
  }
}

// ─── Events ──────────────────────────────────────────────────

export interface EventsListResponse {
  events: EventListItem[];
  total: number;
}

export async function getEvents(params?: {
  status?: EventStatus;
  eventType?: EventType;
  mode?: EventMode;
  featured?: boolean;
  published?: boolean;
  limit?: number;
  offset?: number;
}): Promise<EventsListResponse> {
  const data = await trpcFetch<{ events: EventListItem[]; total: number }>("event.list", params, {
    revalidate: 60,
    tags: ["events"],
  });
  return data || { events: [], total: 0 };
}

export async function getEventBySlug(
  slug: string
): Promise<EventDetail | null> {
  return trpcFetch("event.bySlug", { slug }, {
    revalidate: 300,
    tags: [`event-${slug}`],
  });
}

export async function getAllEventSlugs(): Promise<string[]> {
  const data = await trpcFetch<{ data: Array<{ slug: string }> }>(
    "event.list",
    { published: true, limit: 100, select: "slug" }
  );
  return (data?.data ?? []).map((e) => e.slug);
}

// ─── Programs ────────────────────────────────────────────────

export async function getPrograms(
  featured?: boolean
): Promise<ProgramItem[]> {
  const data = await trpcFetch<ProgramItem[]>("program.list", { featured }, {
    revalidate: 3600,
    tags: ["programs"],
  });
  return data || [];
}

export async function getProgramBySlug(
  slug: string
): Promise<ProgramItem | null> {
  return trpcFetch("program.bySlug", { slug }, {
    revalidate: 3600,
    tags: [`program-${slug}`],
  });
}

// ─── Impact Metrics ──────────────────────────────────────────

export async function getImpactMetrics(): Promise<ImpactMetricItem[]> {
  const data = await trpcFetch<ImpactMetricItem[]>("metrics.list", undefined, {
    revalidate: 3600,
    tags: ["metrics"],
  });
  return data || [];
}

// ─── Alumni ──────────────────────────────────────────────────

export async function getAlumni(featured?: boolean) {
  return trpcFetch("alumni.list", { featured, limit: 6 }, {
    revalidate: 3600,
    tags: ["alumni"],
  });
}

// ─── Partner Inquiry ─────────────────────────────────────────

export async function submitPartnerInquiry(
  data: PartnerInquiryPayload
): Promise<void> {
  const res = await fetch(getTrpcUrl("partner.submit"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ json: data }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Failed to submit inquiry");
  }
}

// ─── Contact ─────────────────────────────────────────────────

export async function submitContact(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<void> {
  const res = await fetch(getTrpcUrl("contact.submit"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ json: data }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Failed to submit contact form");
  }
}
