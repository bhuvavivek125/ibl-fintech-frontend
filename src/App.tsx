import { RouterProvider } from 'react-router-dom';

import router from 'routes';

import Locales from 'ui-component/Locales';
import NavigationScroll from 'layout/NavigationScroll';
import RTLLayout from 'ui-component/RTLLayout';
import Snackbar from 'ui-component/extended/Snackbar';
import Notistack from 'ui-component/third-party/Notistack';
import Metrics from 'metrics';

import ThemeCustomization from 'themes';

// auth provider imports 
import { JWTProvider as AuthProvider } from 'contexts/JWTContext';
import { AdminAuthProvider } from 'contexts/AdminAuthContext';

console.log('App is running');


export default function App() {
  return (
    <>
      <ThemeCustomization>
        <RTLLayout>
          <Locales>
            <NavigationScroll>
              <AdminAuthProvider>
                <AuthProvider>
                  <>
                    <Notistack>
                      <RouterProvider router={router} />
                      <Snackbar />
                    </Notistack>
                  </>
                </AuthProvider>
              </AdminAuthProvider>
            </NavigationScroll>
          </Locales>
        </RTLLayout>
      </ThemeCustomization>
      <Metrics />
    </>
  );
}
