import { useQuery } from '@tanstack/react-query';
import { PropsWithChildren, createContext, useContext } from 'react';

type useAuthenticationReturn<T> = {
  user: T | null;
  isSudo: boolean;
  isLoading: boolean;
  refetchUser: () => void;
};

const nullRecord = {
  user: null,
  isSudo: false,
  refetchUser: () => {},
  isLoading: false,
};

//TODO: find a better fix for this
//eslint-disable-next-line @typescript-eslint/no-explicit-any
const AuthenticationContext = createContext<useAuthenticationReturn<any>>(nullRecord);

type AuthenticationProviderProps<T> = PropsWithChildren & {
  fetchCurrentUser: () => Promise<T | null>;
  //TODO: consider if this should also be typed T | null
  isSudo?: (user: T) => boolean;
};
export default function AuthenticationProvider<T>({
  children,
  fetchCurrentUser,
  isSudo = () => false,
}: AuthenticationProviderProps<T>) {
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['optimus-bo-ui', 'authentication-provider-user-fetching'],
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
        ...nullRecord,
        refetchUser: refetch,
        isLoading: isFetching,
      };

  return <AuthenticationContext.Provider value={userData}>{children}</AuthenticationContext.Provider>;
}

export const useAuthentication = () => useContext(AuthenticationContext);
