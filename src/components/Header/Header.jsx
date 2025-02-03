import React, { useState } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import logo from '/logo.svg';
import menuicon from '../../imgs/header-menu/Menu-icon.svg';
import menuiconexit from '../../imgs/header-menu/Menu-icon-exit.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../pages/AuthContext'; // Подключаем контекст аутентификации
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Получаем данные пользователя из контекста
  const [isMenuOpen, setMenuOpen] = useState(false); // Состояние для управления меню

  const handleIconClick = () => {
    if (user) {
      navigate('/personalacc'); // Переход в личный кабинет
    } else {
      navigate('/login'); // Переход на страницу входа
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen); // Переключаем состояние меню
  };

  const closeMenu = () => {
    setMenuOpen(false); // Закрываем меню
  };
  //
  const scrollToSection = (id) => {
    const section = document.getElementById(id); // Найти секцию по ID
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' }); // Прокрутка с плавным эффектом
      closeMenu(); // Закрыть меню (если мобильная версия)
    }
  };

  return (
    <Container>
      <Navbar fixed="top" expand="lg" className="navbar-custom">
        <Container>
          <Navbar.Brand as={Link} to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} height={40} width={40} alt="Logo" />
            <span style={{ paddingLeft: '10px' }}>Защитник природы</span>
          </Navbar.Brand>

          <Nav className="desktop-nav">
            <Nav.Link onClick={() => scrollToSection('secone')}>Главная</Nav.Link>
            <Nav.Link onClick={() => scrollToSection('project-container')}>О проекте</Nav.Link>
            <Nav.Link onClick={() => scrollToSection('actuality-container')}>Актуальность</Nav.Link>
            <Nav.Link onClick={() => scrollToSection('stages-container')}>Этапы</Nav.Link>
          </Nav>

          <div className="menu-icon" onClick={toggleMenu}>
            <img src={menuicon} height={40} width={40} alt="Logo" />
          </div>
          <div className={`menu ${isMenuOpen ? 'open' : ''}`}> 
            <img className='menu-exit' src={menuiconexit} height={40} width={40} alt="Logo" onClick={closeMenu} /> 
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/" onClick={closeMenu}>Главная</Nav.Link>
              <Nav.Link as={Link} to="/statistics" onClick={closeMenu}>Статистика</Nav.Link>
              <Nav.Link as={Link} to="/contacts" onClick={closeMenu}>Контакты</Nav.Link>
              <Nav.Link as={Link} to="/analyze" onClick={closeMenu}>Анализ</Nav.Link>
              <Nav.Link as={Link} to="/login" onClick={closeMenu}>Личный кабинет</Nav.Link>
            </Nav>
          </div>
        </Container>
      </Navbar>
    </Container>
  );
}

export default Header;
