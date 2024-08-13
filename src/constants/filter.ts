export type FilterOption = {
  label: string;
  value: string;
};

export const questionFilters: FilterOption[] = [
  {label: "Newest", value: "newest"},
  {label: "Popular", value: "popular"},
  {label: "Unanswered", value: "unanswered"},
  {label: "Recommended", value: "recommended"},
];
