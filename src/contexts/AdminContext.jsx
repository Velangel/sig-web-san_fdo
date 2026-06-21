import { createContext, useContext, useState } from 'react';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  
  const login = (user, pass) => {
    if (user === 'admin' && pass === '1234') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };
  
  const logout = () => setIsAdmin(false);
  
  return (
    <AdminContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);