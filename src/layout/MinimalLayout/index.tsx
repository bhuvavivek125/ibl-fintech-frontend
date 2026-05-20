import { Outlet } from 'react-router-dom';

import Customization from '../Customization';

export default function MinimalLayout() {
  return (
    <>
      <Outlet />
      <Customization />
    </>
  );
}
