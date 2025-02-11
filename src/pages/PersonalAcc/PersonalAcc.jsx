import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import avatars from "../../imgs/avatars.svg"; // Убедитесь, что путь правильный
import popap from "../../imgs/popap/popap.png";
import { Modal, Button } from "react-bootstrap";
import "./PersonalAcc.css";

function PersonalAcc() {
  const { user, setUser, logout } = useAuth();
  const [applications, setApplications] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    city: "",
    email: "",
    photo_url: null,
  });
  const [showModal, setShowModal] = useState(false); // Состояние для модального окна
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focused, setFocused] = useState({
    name: false,
    email: false,
    question: false,
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      console.log("Пользователь не авторизован");
      navigate("/login");
    } else {
      console.log("Пользователь загружен:", user);
      setFormData({
        first_name: user.first_name || "",
        city: user.city || "",
        email: user.email || "",
        photo_url: null,
      });
      fetchApplications(user.email);
    }
  }, [navigate, user]);

  const handleFocus = (field) => {
    setFocused((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const handleBlur = (field) => {
    setFocused((prev) => ({
      ...prev,
      [field]: false,
    }));
  };


  const fetchApplications = async (email) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/applications/email/${email}`
      );
      setApplications(response.data);
    } catch (error) {
      console.error("Ошибка при получении заявок:", error);
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
    if (!user || !user.id) {
      console.error("Ошибка: user или user.id не определены");
      return;
    }

    const formDataToUpdate = new FormData();
    formDataToUpdate.append("first_name", formData.first_name);
    formDataToUpdate.append("city", formData.city);
    formDataToUpdate.append("email", formData.email);

    if (formData.photo_url) {
      formDataToUpdate.append("file", formData.photo_url);
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/users/${user.id}`,
        formDataToUpdate,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser(response.data);
      setIsEditing(false);
      setFormData({
        first_name: response.data.first_name,
        city: response.data.city,
        email: response.data.email,
        photo_url: null,
      });
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      console.error("Ошибка при обновлении данных пользователя:", error);
      alert("Ошибка при сохранении данных. Попробуйте снова.");
    }
  };

  const handleApply = () => {
    console.log("Подача заявки");
    navigate("/zayvka");
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("user"); // Удаляем данные о пользователе из localStorage при выходе
    navigate("/login");
  };

  const handleShowModal = () => {
    // Сбрасываем данные формы при открытии окна
    setEmail('');
    setName('');
    setDescription('');
    
    setShowModal(true); // Показываем модальное окно
  };

  const handleCloseModal = () => {
    // Очищаем форму при закрытии окна
    setEmail('');
    setName('');
    setDescription('');
    
    setShowModal(false); // Закрываем модальное окно
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const feedbackData = { email, name, message: description };

    setIsSubmitting(true);

    try {
  
      const response = await fetch(`http://localhost:8000/messages/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData),
      });
      console.log("Ответ сервера:", response.status, await response.text());

      if (!response.ok) throw new Error('Ошибка при отправке сообщения');
      setIsSubmitting(false);
      
      setTimeout(() => setShowModal(false), 2000); // Закрываем модалку через 3 секунды после успешной отправки
    } catch (error) {
      console.error('Ошибка:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="personal-acc-container">
        <div className="right-column">
          <div className="user-info-wrapper">
            <img
              src={user.photo_url || avatars}
              alt="User"
              className="user-photo"
            />
            {!isEditing ? (
              <div className="user-info">
                <h3>{user.first_name}</h3>
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
              <button
                onClick={() => setIsEditing(true)}
                className="action-btn edit-btn"
              >
                Редактировать данные
              </button>
            ) : (
              <>
                <button onClick={handleSave} className="action-btn save-btn">
                  Сохранить
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="action-btn cancel-btn"
                >
                  Отмена
                </button>
              </>
            )}
            <button onClick={handleLogout} className="action-btn logout-btn">
              Выйти из аккаунта
            </button>
          </div>
          <div className="apply-button-container">
            <button onClick={handleApply} className="apply-btn">
              Подать заявку
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

      {/* Кнопка для открытия формы обратной связи */}
      <div className="footer-con-vop">
        <div className="feedback-icon" onClick={handleShowModal}>
          ?
        </div>
      </div>

      {/* Модальное окно с формой обратной связи */}
      <Modal show={showModal} onHide={handleCloseModal} centered className="custom-modal">
        <Modal.Body>
          {/* Кнопка закрытия */}
          <button className="close-btn" onClick={handleCloseModal}>
            &times;
          </button>

          <div className="modal-content-wrapper">
            {/* Левая часть - картинка */}
            <div className="modal-image-wrapper">
              <img src={popap} alt="PPAP Image" className="modal-img" />
            </div>

            {/* Правая часть - форма */}
            <div className="modal-form-wrapper">
              <h2 className="modal-form-title">Напишите нам</h2>
              <form onSubmit={handleSubmit}>
                <div className={`inputDiv ${focused.name || name ? 'focus' : ''}`}>
                  <div className="icon">
                    <i className="fas fa-user"></i>
                  </div>
                  <div className="inputWrapper">
                    <h5>Имя</h5>
                    <input
                      type="text"
                      className="input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => handleFocus("name")}
                      onBlur={() => handleBlur("name")}
                    />
                  </div>
                </div>

                <div className={`inputDiv ${focused.email || email ? 'focus' : ''}`}>
                  <div className="icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="inputWrapper">
                    <h5>Электронная почта</h5>
                    <input
                      type="email"
                      className="input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => handleFocus("email")}
                      onBlur={() => handleBlur("email")}
                    />
                  </div>
                </div>

                <div className={`inputDiv ${focused.question || description ? 'focus' : ''}`}>
                  <div className="icon">
                    <i className="fas fa-pencil-alt"></i>
                  </div>
                  <div className="inputWrapper">
                    <h5>Ваш вопрос</h5>
                    <textarea
                      className="input"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      onFocus={() => handleFocus("question")}
                      onBlur={() => handleBlur("question")}
                    />
                  </div>
                </div>

                <div className="buttonsWrapper">
                  <button
                    type="submit"
                    className={`btn ${isSubmitting ? 'submitting' : ''}`}
                    disabled={isSubmitting || !email || !name || !description}
                  >
                    {isSubmitting ? 'Отправка...' : 'Отправить'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default PersonalAcc;
