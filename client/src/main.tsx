import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app/layout/style.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import 'react-toastify/dist/ReactToastify.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from 'react-router';
import { router } from './app/routes/Routes.tsx';
import { store, StoreContext } from './lib/stores/store.ts';
import { ToastContainer } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ThemeProvider } from '@mui/material/styles';
import { appTheme } from './app/theme.ts';


const queryClient = new QueryClient();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={appTheme}>
        <StoreContext.Provider value={store}>
          <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools />
            <ToastContainer position='bottom-right' hideProgressBar theme='colored' />
            <RouterProvider router={router} />
          </QueryClientProvider>
        </StoreContext.Provider>
      </ThemeProvider>
    </LocalizationProvider>
  </StrictMode>,
)
