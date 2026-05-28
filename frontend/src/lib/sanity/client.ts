import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiToken = process.env.SANITY_API_TOKEN || "";

/**
 * Read-only client for server components.
 * Uses the CDN API with published perspective for fast, cached reads.
 */
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2024-06-01",
  useCdn: true,
  perspective: "published",
});

/**
 * Authenticated client for revalidation and mutations.
 * Requires SANITY_API_TOKEN with editor permissions.
 */
export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion: "2024-06-01",
  useCdn: false,
  token: apiToken,
  perspective: "published",
});

/**
 * Server-component fetch helper.
 * Wraps sanityClient.fetch with next.tags for on-demand revalidation.
 * Gracefully returns empty results when Sanity is not configured.
 */
export async function sanityFetch<T>(
  query: string,
  params?: Record<string, unknown>,
  tags?: string[]
): Promise<T | null> {
  // Skip fetch if Sanity project ID is not properly configured
  if (!projectId || projectId === "dummy" || projectId === "placeholder") {
    return null as T;
  }
  try {
    return await sanityClient.fetch(query, params || {}, {
      next: {
        tags: tags || ["sanity"],
        revalidate: 3600, // 1 hour default
      },
    });
  } catch {
    // Return null on any Sanity error (network, auth, etc.)
    return null as T;
  }
}
