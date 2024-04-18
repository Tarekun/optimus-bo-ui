import { useQuery } from '@tanstack/react-query';
import { PropsWithChildren, createContext, useContext } from 'react';
import { UserRead, getUtenteCorrente } from '../api/utenti';

type useAuthenticationReturn = {
  utente: UserRead | null;
  isSudo: boolean;
  isLoading: boolean;
  refetchUser: () => void;
};
const nullUser: useAuthenticationReturn = {
  utente: null,
  isSudo: false,
  isLoading: false,
  refetchUser: () => {},
};

const AuthenticationContext = createContext<useAuthenticationReturn>(nullUser);

export default function AuthenticationProvider({ children }: PropsWithChildren) {
  const { data, refetch, isFetching } = useQuery({
    //riesegui la richiesta quando cambia la pagina
    //(il login può essere fatto solo navigando a /login e venendo poi rediretti)
    queryKey: ['utente-corrente'],
    queryFn: () => {
      return getUtenteCorrente();
    },
  });
  const utente: useAuthenticationReturn = data
    ? {
        utente: data,
        isSudo: data.is_superuser,
        refetchUser: refetch,
        isLoading: isFetching,
      }
    : {
        ...nullUser,
        refetchUser: refetch,
        isLoading: isFetching,
      };

  return <AuthenticationContext.Provider value={utente}>{children}</AuthenticationContext.Provider>;
}

export const useAuthentication = () => useContext(AuthenticationContext);
