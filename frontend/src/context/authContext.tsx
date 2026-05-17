import { useAuth } from '@clerk/clerk-react';
import { createContext, useContext } from 'react';

type AuthContextType = {
    auth: ReturnType<typeof useAuth> | null;
}

const AuthContext = createContext<AuthContextType>({ auth: null });

export const useAuthContext = () => {
    return useContext(AuthContext);
}

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const auth = useAuth();

    return (
        <AuthContext.Provider value={{ auth }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider