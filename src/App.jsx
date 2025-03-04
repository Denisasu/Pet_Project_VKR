// App.jsx
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap'
import Home from './pages/Home/Home';
import Statistics from './pages/Statistics/Statistics';
import Zayvka from './pages/Zayavka/Zayvka';
import Login from './pages/Login/Login';
import Register from './pages/Registers/Register';
import PersonalAcc from './pages/PersonalAcc/PersonalAcc';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ProtectedRoute from './pages/ProtectedRoute';

import { AuthProvider } from './context/AuthContext'; // Убедитесь, что путь правильный
import Pererabot from './pages/Pererabotka/Pererabot';

function App() {
  // const { user } = useContext(AuthProvider);

  // const ProtectedRoute = ({ children }) => {
  //   return user ? children : <Navigate to="/login" />;
  // };

  // const AdminRoute = ({ children }) => {
  //   return user && user.role === 'admin' ? children : <Navigate to="/" />;
  // };

  return (
    <AuthProvider>
      <Header />
      <Container fluid className="main-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/zayvka" element={<Zayvka />} />
          <Route path="/analyze" element={<Pererabot />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/personalacc" element={<ProtectedRoute><PersonalAcc /></ProtectedRoute>} />
          
        </Routes>
      </Container>
      <Footer />
    </AuthProvider>
  );
}

export default App;
