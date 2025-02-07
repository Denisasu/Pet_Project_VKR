import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import logo from "/logo.svg";
import git_logo from "/github.svg";
import telegram_logo from "/telegram.svg";
import vk_logo from "/vk.svg";
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <Container >
        <Row>
          <Col md={2} sm={6}>
            <a href="/"><img className='logo-f' src={logo} alt="Защитник природы - логотип"/></a>
          </Col>
          <Col md={4} sm={6}>
            <h5>Меню</h5>
            <ul className="footer-links">
              <li><a href="/">Главная</a></li>
              <li><a href="/statistics">Статистика</a></li>
              <li><a href="/contacts">Обратная связь</a></li>
            </ul>
            <ul className="footer-links">
              <li><a href="/zayvka">Анализ</a></li>
              <li><a href="/zayvka">Личный кабинет</a></li>
            </ul>
          </Col>
          <Col md={3} sm={6}>
            <h5>Контактная информация</h5>
            <ul className="footer-links">
              <li><a href="yandex@yandex.ru">yandex@yandex.ru</a></li>
            </ul>
          </Col>
          <Col md={3} sm={6}>
            <h5>Следите за нами</h5>
            <div className="social-icons">
              {/* <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><img src={vk_logo} alt="" /></a> */}
              <ul className="footer-links">
                <a href="https://vk.com" target="_blank" rel="noopener noreferrer"><img src={git_logo} alt="" /></a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><img src={telegram_logo} alt="" /></a>
              </ul>
            </div>
          </Col>
        </Row>
        <Row>
            <Col md={8} sm={6} style={{display: 'flex', alignItems: 'flex-end'}}>
                <div className="bottom-footer">   
                    <h6>@ Все права защищены 2024-2025</h6>
                </div>
            </Col>
            <Col md={4} sm={6} >
                <ul className="social-links">
                    <li><a href="/">Политика конфиденциальности</a></li>
                    <li><a href="/">Политика использования cookie</a></li>
                    <li><a href="/">Обработка персональных данных</a></li>
                </ul>
            </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
