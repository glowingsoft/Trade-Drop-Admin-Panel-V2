import { Navigate } from 'react-router-dom';

import { paths } from 'src/routes/paths';

export default function Page() {
  return <Navigate to={paths.adminDashboard.events} replace />;
}
