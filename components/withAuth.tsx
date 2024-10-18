import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie';
import { message } from 'antd';

const withAuth = (WrappedComponent: React.ComponentType, allowedRoles: string[] = []) => {
  return (props: any) => {
    const Router = useRouter();
    const [verified, setVerified] = useState(false);

    useEffect(() => {
      const verifyToken = async () => {
        const token = Cookies.get('token');
        if (!token) {
          const currentPath = Router.asPath;
          Router.replace(`/login?redirect=${encodeURIComponent(currentPath)}`);
        } else {
          try {
            // Add a small delay to allow time for the token to be set
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const res = await axios.get('/api/verify-token', {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (allowedRoles.length > 0 && !allowedRoles.includes(res.data.role)) {
              message.error('You do not have permission to access this page.');
              Router.replace('/');
            } else {
              setVerified(true);
            }
          } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
              Cookies.remove('token');
              message.error('Your session has expired. Please log in again.');
              const currentPath = Router.asPath;
              Router.replace(`/login?redirect=${encodeURIComponent(currentPath)}`);
            } else {
              console.error('Error verifying token:', error);
              message.error('An error occurred. Please try again.');
            }
          }
        }
      };

      verifyToken();
    }, [Router.asPath]); // Add Router.asPath as a dependency

    if (verified) {
      return <WrappedComponent {...props} />;
    } else {
      return null; // Or you could return a loading spinner here
    }
  };
};

export default withAuth;