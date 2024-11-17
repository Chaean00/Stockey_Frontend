import { RouterProvider } from 'react-router-dom';
import mainRouter from '../src/routers/main-router';

function App() {
  return <RouterProvider router={mainRouter} />;
}

export default App;
