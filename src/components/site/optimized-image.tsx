import type { ImgHTMLAttributes } from "react";
import { optimizedImages } from "@/data/optimized-images";

type OptimizedImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
};

/** Keep the existing img element/CSS while selecting an appropriate local asset. */
export function OptimizedImage({
  src,
  alt,
  sizes = "(max-width: 700px) calc(100vw - 40px), (max-width: 1200px) 50vw, 640px",
  loading,
  fetchPriority,
  ...props
}: OptimizedImageProps) {
  const image = optimizedImages[src];
  return (
    <img
      width={image?.width}
      height={image?.height}
      decoding="async"
      {...props}
      src={image?.src ?? src}
      srcSet={image?.srcSet}
      sizes={image ? sizes : undefined}
      alt={alt}
      loading={loading ?? (fetchPriority === "high" ? "eager" : "lazy")}
      fetchPriority={fetchPriority}
    />
  );
}
