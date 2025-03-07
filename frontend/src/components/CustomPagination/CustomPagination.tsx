import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components';
import './customPagination.scss';

type CustomPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const CustomPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: CustomPaginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  //workaround for disabling prev/next buttons (no "disabled" prop in PaginationNext/PaginationPrevious)
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <Pagination className="pagination">
      <PaginationContent>
        <PaginationItem className="pagination__button">
          <PaginationPrevious
            onClick={() => !isFirstPage && onPageChange(currentPage - 1)}
            className={isFirstPage ? 'pagination__disabled' : ''}
          />
        </PaginationItem>

        {pages.map((page) => (
          <PaginationItem key={page} className="pagination__button">
            <PaginationLink
              onClick={() => onPageChange(page)}
              isActive={page === currentPage}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem className="pagination__button">
          <PaginationNext
            onClick={() => !isLastPage && onPageChange(currentPage + 1)}
            className={isLastPage ? 'pagination__disabled' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
