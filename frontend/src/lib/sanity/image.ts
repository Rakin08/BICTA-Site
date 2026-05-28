import imageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "./client";
import type { SanityImage } from "@/types";

const builder = imageUrlBuilder(sanityClient);

/**
 * Build a URL from a Sanity image asset.
 * Usage: urlFor(image).width(400).height(300).url()
 */
export function urlFor(source: SanityImage | null) {
  if (!source || !source.asset) {
    // Return a no-op builder that produces empty string
    return {
      url: () => "",
      width: () => ({ url: () => "" }),
      height: () => ({ url: () => "" }),
      format: () => ({ url: () => "" }),
    } as unknown as ReturnType<typeof builder.image>;
  }
  return builder.image(source);
}

/**
 * Convenience: get image URL with dimensions.
 */
export function getImageUrl(
  source: SanityImage | null,
  options: { width?: number; height?: number; format?: "webp" | "jpg" | "png" } = {}
): string {
  if (!source || !source.asset) return "";

  let img = builder.image(source);
  if (options.width) img = img.width(options.width);
  if (options.height) img = img.height(options.height);
  if (options.format) img = img.format(options.format);

  return img.url();
}
