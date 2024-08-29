import {BsExclamationTriangle} from "react-icons/bs";

type FormErrorProps = {
  message?: string;
};

export const FormError = ({message}: FormErrorProps) => {
  if (!message) return null;

  return (
    <div className="flex min-h-10 items-center gap-x-2 rounded-md bg-red-200 px-3 text-sm text-red-600 dark:bg-red-900/75 dark:text-red-300">
      <BsExclamationTriangle className="size-3.5" />
      <p>{message}</p>
    </div>
  );
};
