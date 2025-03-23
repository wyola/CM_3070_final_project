import { useNavigate } from 'react-router';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  CustomPagination,
  ArrowIcon,
  FeedbackMessage,
} from '@/components';
import { OrganizationI } from '@/types';
import { ORGANIZATION } from '@/constants';
import { useOrganizationsList } from '@/contexts';
import './organizationsTable.scss';

export const OrganizationsTable = () => {
  const { organizations, pagination, updateCurrentPage, error, isLoading } =
    useOrganizationsList();
  const navigate = useNavigate();

  const handleRowClick = (organizationId: number) => {
    navigate(`${ORGANIZATION}/${organizationId}`);
  };

  const getCellContent = (organization: OrganizationI, accessor: string) => {
    if (accessor === 'action') {
      return <ArrowIcon width={20} height={20} />;
    }

    if (
      accessor === 'name' ||
      accessor === 'city' ||
      accessor === 'voivodeship'
    ) {
      return organization[accessor];
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'City', accessor: 'city' },
    { header: 'Voivodeship', accessor: 'voivodeship' },
    { header: '', accessor: 'action' },
  ];

  if (!organizations.length) {
    return (
      <FeedbackMessage
        message={
          isLoading
            ? 'Loading organizations...'
            : error
            ? error
            : 'No organizations found matching your criteria'
        }
        imageSrc="/images/dog-question.svg"
      />
    );
  }

  return (
    <>
      <Table className="organizations-table">
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.accessor}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizations.map((organization) => (
            <TableRow
              key={organization.id}
              onClick={() => handleRowClick(organization.id)}
            >
              {columns.map((column) => (
                <TableCell
                  key={`${organization.id}-${column.accessor}`}
                  data-column={column.accessor}
                >
                  {getCellContent(organization, column.accessor)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {pagination && pagination.pages > 1 && (
        <CustomPagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={updateCurrentPage}
        />
      )}
    </>
  );
};
