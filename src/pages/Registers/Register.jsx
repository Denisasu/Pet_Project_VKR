import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Register.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import register1 from '../../imgs/register/register1.png';
import { Container } from 'react-bootstrap';

function Register() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeConfirmed, setIsCodeConfirmed] = useState(false);
  const [focused, setFocused] = useState({});
  const navigate = useNavigate();

  const handleFocus = (field) => {
    setFocused((prevState) => ({ ...prevState, [field]: true }));
  };

  const handleBlur = (field, value) => {
    if (!value) {
      setFocused((prevState) => ({ ...prevState, [field]: false }));
    }
  };

  const sendCode = async () => {
    if (!email) {
      alert('Введите email');
      return;
    }
    try {
      const response = await axios.post(`http://localhost:8000/send-verification-code/`, { email });
      if (response.status === 200) {
        setIsCodeSent(true);
        alert('Код отправлен на ваш email');
      }
    } catch (error) {
      console.error('Ошибка отправки кода:', error);
      alert('Не удалось отправить код');
    }
  };

  const verifyCode = async () => {
    if (!confirmationCode) {
      alert('Введите код подтверждения');
      return;
    }
    setIsCodeConfirmed(true);
    alert('Код подтвержден!');
  };

  const handleRegister = async () => {
    if (!firstName || !email || !password || password !== confirmPassword) {
      alert('Пожалуйста, заполните все поля корректно');
      return;
    }
    try {
      const response = await axios.post(`http://localhost:8000/register/`, {
        first_name: firstName,
        email,
        password,
      });
      if (response.status === 200) {
        localStorage.setItem('user', JSON.stringify({ firstName, email }));
        alert('Регистрация завершена!');
        navigate('/login');
      }
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      alert('Не удалось зарегистрировать пользователя');
    }
  };

  return (
    <Container>
      <div className={styles.registerContainer}>
        <div className={styles.container}>
          <div className={styles.registerContent}>
            {!isCodeSent ? (
              <form>
                <h2 className={styles.title}>Присоединяйся</h2>
                <div className={`${styles.inputDiv} ${focused.firstName ? styles.focus : ''}`}>
                  <div className={styles.i}>
                    <i className="fas fa-user"></i>
                  </div>
                  <div className={styles.inputWrapper}>
                    <h5>Имя</h5>
                    <input
                      type="text"
                      className={styles.input}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      onFocus={() => handleFocus('firstName')}
                      onBlur={(e) => handleBlur('firstName', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className={`${styles.inputDiv} ${focused.email ? styles.focus : ''}`}>
                  <div className={styles.i}>
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className={styles.inputWrapper}>
                    <h5>Email</h5>
                    <input
                      type="email"
                      className={styles.input}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => handleFocus('email')}
                      onBlur={(e) => handleBlur('email', e.target.value)}
                      required
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
                      required
                    />
                  </div>
                </div>

                <div className={`${styles.inputDiv} ${focused.confirmPassword ? styles.focus : ''}`}>
                  <div className={styles.i}>
                    <i className="fas fa-lock"></i>
                  </div>
                  <div className={styles.inputWrapper}>
                    <h5>Подтверждение пароля</h5>
                    <input
                      type="password"
                      className={styles.input}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onFocus={() => handleFocus('confirmPassword')}
                      onBlur={(e) => handleBlur('confirmPassword', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.btn}
                  onClick={sendCode}
                >
                  Регистрация
                </button>
              </form>
            ) : (
              <form>
                <h2 className={styles.title}>Подтверждение почты</h2>
                <div className={`${styles.inputDiv} ${focused.confirmationCode ? styles.focus : ''}`}>
                  <div className={styles.i}>
                    <i className="fas fa-key"></i>
                  </div>
                  <div className={styles.inputWrapper}>
                    <h5>Введите код подтверждения</h5>
                    <input
                      type="text"
                      className={styles.input}
                      value={confirmationCode}
                      onChange={(e) => setConfirmationCode(e.target.value)}
                      onFocus={() => handleFocus('confirmationCode')}
                      onBlur={(e) => handleBlur('confirmationCode', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.btn}
                  onClick={verifyCode}
                >
                  Подтвердить
                </button>
                {isCodeConfirmed && (
                  <button
                    type="button"
                    className={styles.btn}
                    onClick={handleRegister}
                  >
                    Зарегистрироваться
                  </button>
                )}
              </form>
            )}
          </div>
          <img src={register1} className={styles.registerImage} alt="register" />
        </div>
        
      </div>
  </Container>
  );
}

export default Register;
