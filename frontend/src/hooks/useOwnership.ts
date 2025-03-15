import { useParams } from 'react-router';
import { useUser } from '@/contexts';

export const useOwnership = () => {
  const { id } = useParams();
  const { user } = useUser();
  return user?.organizationId === Number(id);
};
