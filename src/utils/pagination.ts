import { LIMIT } from "@/constant/base";

export const getPaginationMetadata = (
  filter: Record<string, unknown>,
  count: number
) => {
  const page_size = filter.limit ? Number(filter.limit) : LIMIT;
  const page_count = Math.ceil(count / page_size);
  const page = filter.page ? Number(filter.page) : 1;
  return { total_count: count, page_size, page_count, page };
};
