import { useQuery } from '@tanstack/react-query';
import { PropsWithChildren, createContext, useContext } from 'react';

type useAuthenticationReturn<T> = {
  user: T | null;
  isSudo: boolean;
  isLoading: boolean;
  refetchUser: () => void;
};

//TODO: find a better fix for this
//eslint-disable-next-line @typescript-eslint/no-explicit-any
const AuthenticationContext = createContext<useAuthenticationReturn<any>>({
  user: null,
  isSudo: false,
  refetchUser: () => {},
  isLoading: false,
});

type AuthenticationProviderProps<T> = PropsWithChildren & {
  fetchCurrentUser: () => Promise<T>;
  isSudo?: (user: T) => boolean;
};
export default function AuthenticationProvider<T>({
  children,
  fetchCurrentUser,
  isSudo = () => false,
}: AuthenticationProviderProps<T>) {
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['authentication-provider-user-fetching'],
    queryFn: () => {
      return fetchCurrentUser();
    },
  });

  const userData: useAuthenticationReturn<T> = data
    ? {
        user: data,
        isSudo: isSudo(data),
        refetchUser: refetch,
        isLoading: isFetching,
      }
    : {
        user: null,
        isSudo: false,
        refetchUser: refetch,
        isLoading: isFetching,
      };

  return <AuthenticationContext.Provider value={userData}>{children}</AuthenticationContext.Provider>;
}

export const useAuthentication = () => useContext(AuthenticationContext);
