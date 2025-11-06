export type PaginationResult<T> = {
  data: T[];
  meta: Meta;
};

export type Meta = {
  total_count: number;
  page_size: number;
  page_count: number;
  page: number;

};
