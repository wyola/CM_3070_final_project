import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components';
import { useEffect, useState } from 'react';
import { Organization } from '@/types/organization.types';
import { useNavigate } from 'react-router';
import { API_ENDPOINTS } from '@/constants';
import './home.scss';

export const Home = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.ORGANIZATIONS.ALL);
        const data = await response.json();
        setOrganizations(data.data.organizations);
      } catch (error) {
        console.error('Error fetching organizations:', error);
      }
    };

    fetchOrganizations();
  }, []);

  const navigate = useNavigate();

  const handleRowClick = (organizationId: number) => {
    navigate(`/organization/${organizationId}`);
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
                  {organization[column.accessor as keyof Organization]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
};
