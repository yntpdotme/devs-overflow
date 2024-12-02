import Image from "next/image";
import Link from "next/link";

import {Button} from "@/components/ui/button";
import {DEFAULT_EMPTY, DEFAULT_ERROR} from "@/constants/states";

type DataRendererProps<T> = {
  success: boolean;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  data: T[] | null | undefined;
  empty?: {
    title: string;
    message: string;
    button?: {
      text: string;
      href: string;
    };
  };
  render: (data: T[]) => React.ReactNode;
};

type StateMessageProps = {
  image: {
    light: string;
    dark: string;
    alt: string;
  };
  title: string;
  message: string;
  button?: {
    text: string;
    href: string;
  };
};

const StateMessage = ({image, title, message, button}: StateMessageProps) => (
  <div className="mt-10 flex w-full flex-col items-center px-6 sm:px-12">
    <>
      <Image
        src={image.dark}
        alt={image.alt}
        width={220}
        height={150}
        className="hidden object-contain dark:block"
      />
      <Image
        src={image.light}
        alt={image.alt}
        width={220}
        height={150}
        className="object-contain dark:hidden"
      />
    </>

    <h2 className="h2-bold text-dark200_light900 mt-8">{title}</h2>

    <p className="body-regular text-dark500_light700 mb-5 mt-3 max-w-sm text-center">
      {message}
    </p>

    {button && (
      <Link href={button.href}>
        <Button className="min-h-[40px] rounded-md bg-light-800 px-6 py-3 text-dark-400 shadow-none hover:bg-light-700 dark:bg-dark-300 dark:text-light-700 dark:hover:bg-dark-400">
          {button.text}
        </Button>
      </Link>
    )}
  </div>
);

const DataRenderer = <T,>({
  success,
  error,
  data,
  empty = DEFAULT_EMPTY,
  render,
}: DataRendererProps<T>) => {
  if (!success) {
    return (
      <StateMessage
        image={{
          light: "/images/light-error.png",
          dark: "/images/dark-error.png",
          alt: "Error state illustration",
        }}
        title={error?.message || DEFAULT_ERROR.title}
        message={
          error?.details
            ? JSON.stringify(error.details, null, 2)
            : DEFAULT_ERROR.message
        }
        button={DEFAULT_ERROR.button}
      />
    );
  }

  if (!data || data.length === 0)
    return (
      <StateMessage
        image={{
          light: "/images/light-illustration.png",
          dark: "/images/dark-illustration.png",
          alt: "Empty state illustration",
        }}
        title={empty.title}
        message={empty.message}
        button={empty.button}
      />
    );

  return <>{render(data)}</>;
};

export default DataRenderer;
