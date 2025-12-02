import { createContext, useState } from 'react';
import { login } from '../services/login';

const AuthContext = createContext();

function AuthProvider({ children })
{
  const [isAuthenticated, setIsAuthenticated] = useState(() => 
  {
    const token = localStorage.getItem('token');

    return Boolean(token);
  });

  const [user, setUser] = useState(() => 
  {
    const storedUser = localStorage.getItem('user');

    return storedUser ? JSON.parse(storedUser) : null;
  });

  const singout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
  };

  const singin = async (email, password) => 
  {
    const { data, error } = await login(email, password);

    if (error) 
    {
      return { error };
    }

    const { token, user: userData } = data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);

    return {error: null, user: userData};
  };

  return (
    <AuthContext.Provider
      value={ {
        isAuthenticated,
        user,
        singin,
        singout,
      } }
    >
      {children}
    </AuthContext.Provider>
  );
};

export {
  AuthProvider,
  AuthContext,
};
