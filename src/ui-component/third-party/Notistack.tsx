import { SnackbarProvider } from 'notistack';

export default function Notistack({ children }: any) {
  return (
    <SnackbarProvider maxSnack={3}>
      {children}
    </SnackbarProvider>
  );
}
