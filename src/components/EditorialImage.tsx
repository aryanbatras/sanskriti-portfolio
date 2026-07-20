import Image from "next/image";

interface EditorialImageProps {
  src: string;
  alt: string;
  variant?: "full-bleed" | "contained" | "background";
  aspectRatio?: "wide" | "square" | "portrait";
  className?: string;
}

export default function EditorialImage({
  src,
  alt,
  variant = "contained",
  aspectRatio = "wide",
  className = "",
}: EditorialImageProps) {
  const aspectClass =
    aspectRatio === "wide"
      ? "aspect-[16/9]"
      : aspectRatio === "square"
      ? "aspect-square"
      : "aspect-[3/4]";

  if (variant === "background") {
    return (
      <div
        className={`relative w-full h-full overflow-hidden ${className}`}
        aria-hidden="true"
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover grayscale opacity-20"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/60 to-transparent" />
      </div>
    );
  }

  return (
    <figure
      className={`${variant === "full-bleed" ? "w-screen ml-[calc(-50vw+50%)]" : "w-full"} ${aspectClass} relative overflow-hidden ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
        sizes="(max-width: 768px) 100vw, 80vw"
      />
      <div className="absolute inset-0 bg-ink/10" />
      {alt && (
        <figcaption className="sr-only">{alt}</figcaption>
      )}
    </figure>
  );
}
