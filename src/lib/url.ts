import qs from "query-string";

type UrlQueryParams = {
  params: string;
  key: string;
  value: string;
};

type RemoveUrlQueryParams = {
  params: string;
  keysToRemove: string[];
};

export const formUrlQuery = ({params, key, value}: UrlQueryParams) => {
  const queryString = qs.parse(params);

  queryString[key] = value;

  return qs.stringifyUrl({
    url: window.location.pathname,
    query: queryString,
  });
};

export const removeKeysFromUrlQuery = ({
  params,
  keysToRemove,
}: RemoveUrlQueryParams) => {
  const queryString = qs.parse(params);

  keysToRemove.forEach(key => {
    delete queryString[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: queryString,
    },
    {skipNull: true}
  );
};

export const buildApiUrl = (baseUrl: string, params: Record<string, string | number>) => {
  const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      acc[key] = String(value);
    }
    return acc;
  }, {} as Record<string, string>);

  return qs.stringifyUrl({
    url: baseUrl,
    query: cleanParams,
  });
};