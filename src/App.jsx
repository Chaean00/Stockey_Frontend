import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './utils/authContext';
import mainRouter from '../src/routers/main-router';

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={mainRouter} />
    </AuthProvider>
  );
}

export default App;
