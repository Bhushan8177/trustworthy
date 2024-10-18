import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const withAuth = (WrappedComponent: React.ComponentType, allowedRoles: string[] = []) => {
  return (props: any) => {
    const Router = useRouter();
    const [verified, setVerified] = useState(false);

    useEffect(() => {
      const verifyToken = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          Router.replace('/login');
        } else {
          try {
            const res = await axios.get('/api/verify-token', {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (allowedRoles.length > 0 && !allowedRoles.includes(res.data.role)) {
              Router.replace('/');
            } else {
              setVerified(true);
            }
          } catch (error) {
            localStorage.removeItem('token');
            Router.replace('/login');
          }
        }
      };
      verifyToken();
    }, []);

    if (verified) {
      return <WrappedComponent {...props} />;
    } else {
      return null;
    }
  };
};

export default withAuth;