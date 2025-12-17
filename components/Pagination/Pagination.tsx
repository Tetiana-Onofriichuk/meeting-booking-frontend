import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  page: number;
  total: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, total, onChange }: PaginationProps) {
  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel=">"
      previousLabel="<"
      pageRangeDisplayed={3}
      marginPagesDisplayed={2}
      pageCount={total}
      forcePage={Math.max(0, page - 1)}
      onPageChange={({ selected }) => onChange(selected + 1)}
      containerClassName={css.pagination}
      activeClassName={css.active}
    />
  );
}
