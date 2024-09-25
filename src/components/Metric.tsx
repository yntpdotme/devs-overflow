import {cn} from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

type MetricProps = {
  imgUrl: string;
  alt: string;
  value: string | number;
  title: string;
  href?: string;
  textStyles: string;
  imgStyles?: string;
  isAuthor?: boolean;
  titleStyles?: string;
};

const Metric = ({
  imgUrl,
  alt,
  value,
  title,
  href,
  textStyles,
  imgStyles,
  isAuthor,
  titleStyles,
}: MetricProps) => {
  const getFirstLetter = (value: string | number): string => {
    const stringValue = value.toString();
    return stringValue.charAt(0).toUpperCase();
  };

  const metricContent = (
    <>
      {imgUrl && (
        <Image
          src={imgUrl}
          width={18}
          height={18}
          alt={alt}
          className={`rounded-full object-contain ${imgStyles ?? ""}`}
        />
      )}

      {!imgUrl && isAuthor && (
        <span className="primary-gradient flex size-5 items-center justify-center rounded-full font-space-grotesk text-xs font-semibold text-white">
          {getFirstLetter(value)}
        </span>
      )}

      <p className={`${textStyles} flex items-center gap-1`}>
        {value}

        {title ? (
          <span className={cn(`small-regular line-clamp-1`, titleStyles)}>
            {title}
          </span>
        ) : null}
      </p>
    </>
  );

  return href ? (
    <Link href={href} className="flex-center gap-1">
      {metricContent}
    </Link>
  ) : (
    <div className="flex-center gap-1">{metricContent}</div>
  );
};

export default Metric;
