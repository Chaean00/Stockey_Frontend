import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './utils/authContext';
import mainRouter from '../src/routers/main-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ChatProvider } from './utils/chatContext';

function App() {
  return (
    <ChatProvider>
      <AuthProvider>
        <RouterProvider router={mainRouter} />
      </AuthProvider>
    </ChatProvider>
  );
}

export default App;
