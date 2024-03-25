import Image from "next/image";

interface Props {
  alt: string;
  src?: string;
  className?: React.StyleHTMLAttributes<HTMLImageElement>["className"];
  style?: React.StyleHTMLAttributes<HTMLImageElement>["style"];
  width: number;
  height: number;
  onMouseEnter?: (event: React.MouseEvent<HTMLImageElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLImageElement>) => void;
}

export const ProductImage = ({
  src,
  alt,
  className,
  width,
  height,
  onMouseEnter,
  onMouseLeave,
  style,
}: Props) => {
  const localSrc = src
    ? src.startsWith("http")
      ? src
      : `/products/${src}`
    : "/imagenes/placeholder.jpg";
  return (
    <Image
      alt={alt}
      height={height}
      width={width}
      className={className}
      src={localSrc}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={style}
    />
  );
};
