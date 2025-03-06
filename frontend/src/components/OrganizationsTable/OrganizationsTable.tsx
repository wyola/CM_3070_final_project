import { useNavigate } from 'react-router';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components';
import { OrganizationI } from '@/types';
import { ORGANIZATION } from '@/constants';
import { useOrganizationsList } from '@/contexts';
import { CustomPagination } from '../CustomPagination/CustomPagination';
import './organizationsTable.scss';

export const OrganizationsTable = () => {
  const { organizations, pagination, updateCurrentPage } =
    useOrganizationsList();
  const navigate = useNavigate();

  const handleRowClick = (organizationId: number) => {
    navigate(`${ORGANIZATION}/${organizationId}`);
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'City', accessor: 'city' },
    { header: 'Voivodeship', accessor: 'voivodeship' },
  ];

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
                  {organization[column.accessor as keyof OrganizationI]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {pagination && (
        <CustomPagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={updateCurrentPage}
        />
      )}
    </>
  );
};
