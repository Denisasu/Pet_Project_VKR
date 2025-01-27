import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import './PersonalAcc.css';

function PersonalAcc() {
  const { user, setUser, logout } = useAuth();
  const [applications, setApplications] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    city: '',
    email: '',
    photo_url: null,
  });
  const [baseUrl, setBaseUrl] = useState(''); // Добавлено состояние для baseUrl

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      console.log('Пользователь не авторизован');
      navigate('/login');
    } else {
      console.log('Пользователь загружен:', user);
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        city: user.city || '',
        email: user.email || '',
        photo_url: null,
      });
      fetchApplications(user.email);
    }
  }, [navigate, user]);

  useEffect(() => {
    // Определяем baseUrl
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = /android/.test(userAgent);

    if (isAndroid) {
      setBaseUrl('http://192.168.31.128:8000'); // Для Android
    } else {
      setBaseUrl('http://localhost:8000'); // Для веба
    }
  }, []);

  const fetchApplications = async (email) => {
    if (!baseUrl) return; // Ждем, пока baseUrl будет установлен
    try {
      const response = await axios.get(`${baseUrl}/applications/email/${email}`);
      setApplications(response.data);
    } catch (error) {
      console.error('Ошибка при получении заявок:', error);
    }
  };

  const fetchUserData = async () => {
    if (!baseUrl || !user) return;
    try {
      const response = await axios.get(`${baseUrl}/users/${user.id}`);
      setUser(response.data);
    } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({ ...prevData, photo_url: file }));
  };

  const handleSave = async () => {
    if (!baseUrl || !user || !user.id) {
      console.error('Ошибка: baseUrl, user или user.id не определены');
      return;
    }

    const formDataToUpdate = new FormData();
    formDataToUpdate.append('first_name', formData.first_name);
    formDataToUpdate.append('last_name', formData.last_name);
    formDataToUpdate.append('city', formData.city);
    formDataToUpdate.append('email', formData.email);

    if (formData.photo_url) {
      formDataToUpdate.append('file', formData.photo_url);
    }

    try {
      const response = await axios.put(`${baseUrl}/users/${user.id}`, formDataToUpdate, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUser(response.data);
      fetchUserData();
      setIsEditing(false);
      setFormData({
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        city: response.data.city,
        email: response.data.email,
        photo_url: null,
      });
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
      console.error('Ошибка при обновлении данных пользователя:', error);
      alert('Ошибка при сохранении данных. Попробуйте снова.');
    }
  };
  
  const handleLogout = () => {
    logout();
    localStorage.removeItem('user'); // Удаляем данные о пользователе из localStorage при выходе
    navigate('/login');
  };

  // Загрузка данных из localStorage при загрузке страницы
  useEffect(() => {
    const cachedUser = localStorage.getItem('user');
    if (cachedUser) {
      setUser(JSON.parse(cachedUser));  // Если данные есть в localStorage, обновляем контекст
    }
  }, [setUser]);

  if (!user) {
    return null; // Вернем null, пока данные пользователя не загружены
  }

  return (
    <div className="personal-acc-container">
      <div className="right-column">
        <div className="user-info-wrapper">
          <img src={user.photo_url || "https://via.placeholder.com/150"} alt="User" className="user-photo" />
          {!isEditing ? (
            <div className="user-info">
              <h3>{`${user.first_name} ${user.last_name}`}</h3>
              <p>Город: {user.city}</p>
              <p>Email: {user.email}</p>
            </div>
          ) : (
            <div className="edit-form">
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                placeholder="Имя"
              />
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                placeholder="Фамилия"
              />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Город"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
              />
              <input
                type="file"
                name="photo"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>
          )}
        </div>
        <div className="user-actions">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="action-btn edit-btn">
              Редактировать данные
            </button>
          ) : (
            <>
              <button onClick={handleSave} className="action-btn save-btn">
                Сохранить
              </button>
              <button onClick={() => setIsEditing(false)} className="action-btn cancel-btn">
                Отмена
              </button>
            </>
          )}
          <button onClick={handleLogout} className="action-btn logout-btn">
            Выйти из аккаунта
          </button>
        </div>
      </div>

      <div className="left-column">
        <h2>Мои заявки</h2>
        <table className="applications-table">
          <thead>
            <tr>
              <th>Номер заявки</th>
              <th>Дата создания</th>
              <th>Содержание</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {applications.length > 0 ? (
              applications.map((app) => (
                <tr key={app.id}>
                  <td>{app.id}</td>
                  <td>{new Date(app.created_at).toLocaleDateString()}</td>
                  <td>{app.description}</td>
                  <td>{app.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">У вас нет заявок.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PersonalAcc;
