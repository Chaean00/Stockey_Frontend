import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './utils/authContext';
import mainRouter from '../src/routers/main-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ChatProvider } from './utils/chatContext';
import { LikeProvider } from './utils/likeContext';

function App() {
  return (
    <LikeProvider>
      <ChatProvider>
        <AuthProvider>
          <RouterProvider router={mainRouter}></RouterProvider>
        </AuthProvider>
      </ChatProvider>
    </LikeProvider>
  );
}

export default App;
