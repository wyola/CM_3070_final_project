import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components';
import { useEffect, useState } from 'react';
import { OrganizationI } from '@/types';
import { useNavigate } from 'react-router';
import { API_ENDPOINTS, ORGANIZATION } from '@/constants';
import { axiosInstance } from '@/lib/axios';
import './home.scss';

export const Home = () => {
  const [organizations, setOrganizations] = useState<OrganizationI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const { data: response } = await axiosInstance.get(
          API_ENDPOINTS.ORGANIZATIONS.ALL
        );
        setOrganizations(response.data.organizations);
      } catch (error) {
        console.error('Error fetching organizations:', error);
        setError('Failed to load organizations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

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
    { header: 'Address', accessor: 'address' },
  ];

  return (
    <section className="content home">
      <Table>
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
                <TableCell key={`${organization.id}-${column.accessor}`}>
                  {organization[column.accessor as keyof OrganizationI]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
};
