import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { useAuth } from "../../context/AuthContext"; // Импорт контекста аутентификации
import styles from './Login.module.css'; 
import '@fortawesome/fontawesome-free/css/all.min.css';
import avatar from '../../imgs/login/avatar.png';
import wave from '../../imgs/login/wave.png';
import bg from '../../imgs/login/bg.png';
import { Container } from 'react-bootstrap';

function Login() {
  const [focused, setFocused] = useState({ email: false, password: false });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth(); // Получаем функцию для входа из контекста
  const navigate = useNavigate(); // Инициализируем navigate


  const handleFocus = (field) => {
    setFocused(prevState => ({ ...prevState, [field]: true }));
  };

  const handleBlur = (field, value) => {
    if (value === "") {
      setFocused(prevState => ({ ...prevState, [field]: false }));
    }
  };

  const handleRegisterRedirect = () => {
    window.location.href = '/register';
  };

  const handleLogin = async () => {
  if (!email || !password) {
    alert("Пожалуйста, заполните все поля.");
    return;
  }

  try {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);

    const response = await axios.post('http://localhost:8000/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });

    if (response.status === 200 && response.data.access_token) {
      const { access_token, user_id, first_name, photo_url } = response.data;

      const userData = {
        id: user_id,
        email,
        first_name: first_name || 'Не указано',
        photo_url: photo_url || '',
      };

      // Храним только access token, так как refresh не реализован
      if (rememberMe) {
        localStorage.setItem('accessToken', access_token);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        sessionStorage.setItem('accessToken', access_token);
        sessionStorage.setItem("user", JSON.stringify(userData));
      }

      

      login(userData, rememberMe);
      navigate('/personalacc');
    }
  } catch (error) {
    console.error('Ошибка при входе:', error);
    if (error.response && error.response.status === 401) {
      alert('Неверный email или пароль!');
    } else {
      alert('Произошла ошибка при подключении к серверу.');
    }
  }
};


  const handleForgotPassword = () => {
    navigate('/forgotpassword');
  };

  return (
    <Container fluid>
      <div className={styles.loginContainer}>
        <img src={wave} className={styles.wave} alt="wave" />
        <div className={styles.container}>
          <div className={styles.img}>
            <img src={bg} alt="background" />
          </div>
          <div className={styles.loginContent}>
            <form>
              <div className={styles.avatarWrapper}>
                <img src={avatar} alt="avatar" className={styles.avatar} />
              </div>
              <h2 className={styles.title}>Вход</h2>
              
              <div className={`${styles.inputDiv} ${focused.email ? styles.focus : ''}`}>
                <div className={styles.i}>
                  <i className="fas fa-user"></i>
                </div>
                <div className={styles.inputWrapper}>
                  <h5>Email</h5>
                  <input 
                    type="text" 
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => handleFocus('email')}
                    onBlur={(e) => handleBlur('email', e.target.value)}
                  />
                </div>
              </div>

              <div className={`${styles.inputDiv} ${focused.password ? styles.focus : ''}`}>
                <div className={styles.i}>
                  <i className="fas fa-lock"></i>
                </div>
                <div className={styles.inputWrapper}>
                  <h5>Пароль</h5>
                  <input 
                    type="password" 
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => handleFocus('password')}
                    onBlur={(e) => handleBlur('password', e.target.value)}
                  />
                </div>
              </div>

              {/* Обёртка для "Запомнить меня" и "Забыли пароль?" */}
              <div className={styles.optionsWrapper}>
                <div className={styles.checkboxWrapper}>
                  <input 
                    type="checkbox" 
                    id="rememberMe" 
                    checked={rememberMe} 
                    onChange={(e) => setRememberMe(e.target.checked)} 
                  />
                  <label htmlFor="rememberMe">Запомнить меня</label>
                </div>
                <a href="#" onClick={handleForgotPassword}>Забыли пароль?</a>
              </div>

              <div className={styles.buttonsWrapper}>
                <button type="button" className={styles.btn} onClick={handleLogin}>Войти</button>
                <p className={styles.registerLink}>
                  У вас нет аккаунта? <span onClick={handleRegisterRedirect} className={styles.registerBtn}>Зарегистрироваться</span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
  </Container>
  );
}

export default Login;
