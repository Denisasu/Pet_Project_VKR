import React, { useEffect } from "react";
import { Button, Container} from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import "./home.css";
import statisticsImg from "../../imgs/statistics.png";
import analysisImg from "../../imgs/analysis.png";
import applicationImg from "../../imgs/application.png";
import profileImg from "../../imgs/profile.png";
import One_carusel from "../../components/One_carusel";
import { CATEGORY_COLORS, getCategoryName } from "../../constants/mapSettings";

import GeocodeMap from "../../components/layout/Geocode-map";
import config from '../../config/config.json'
import { YMaps } from "@pbe/react-yandex-maps";

function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  // Функция для навигации на страницу "Заявка"
  const handleClick = () => {
    navigate("/PersonalAcc");
  };

  useEffect(() => {
    if (location.state && location.state.sectionId) {
      const section = document.getElementById(location.state.sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <Container>
      {/* Секция, приветствующая пользователя и предлагающая перейти в личный кабинет */}
      <div className="home-container" id="home-container">
        <section className="secone">
          <div className="secone-one">
            <div className="header">
              <div className="line-container-first">
                <h1>Охрана</h1>
                {/* <div className="dashed-line"></div> */}
              </div>
              <div className="line-container-second">
                {/* <div className="dashed-line"></div> */}
                <h2>это</h2>
              </div>
            </div>
            <div className="button-group">
              <Button onClick={handleClick} className="btn-title">
                Очистить природу
              </Button>
              <Button href="#project-container" className="btn-title two">
                О проекте
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Страница 2 - "О проекте" с прокруткой */}
      <div className="project-container" id="project-container">
        <div className="project-header">
          <h1>О проекте</h1>
        </div>
        <div className="project-goal">
          <h2>Цель</h2>
          <p>
            Сбор и обработка заявок о загрязнении природы на территории
            Алтайского края
          </p>
        </div>
        <div className="project-functionality">
          <h2>Функционал</h2>
          <div className="buttons-container">
            <a href="/Statistics.jsx" className="function-button">
              <img src={statisticsImg} alt="Статистика" />
              Статистика
            </a>
            <a href="/analyze" className="function-button">
              <img src={analysisImg} alt="Анализ" />
              Анализ вторсырья
            </a>
            <a href="/Zayvka" className="function-button">
              <img src={applicationImg} alt="Подача заявки" />
              Подача заявки
            </a>
            <a href="/Login" className="function-button">
              <img src={profileImg} alt="Личный кабинет" />
              Личный кабинет
            </a>
          </div>
        </div>
      </div>

      {/* Страница 3 - "Актуальность" с прокруткой */}
      <div className="actuality-container" id="actuality-container">
        <div className="actuality-header">
          <h1>Актуальность</h1>
        </div>
        <div className="actual-sliders">
          <One_carusel />
        </div>
        <div className="actual-sliders">
          <Row>
            <Col md="3">
              <Card
                style={{
                  height: "415px",
                  width: "18rem",
                  padding: "15px",
                  backgroundColor: "#2CA1A5",
                }}
              >
                <Card.Img variant="top" src={photo_1} />
                <Card.Body>
                  <Card.Title style={{ color: "white" }}>
                    Чистота природы
                  </Card.Title>
                  <Card.Text style={{ color: "white" }}>
                    Берегите природу, оставляйте за собой чистоту.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md="3">
              <Card
                style={{
                  height: "415px",
                  width: "18rem",
                  padding: "15px",
                  backgroundColor: "#2CA1A5",
                }}
              >
                <Card.Img variant="top" src={photo_2} />
                <Card.Body>
                  <Card.Title style={{ color: "white" }}>Вместе</Card.Title>
                  <Card.Text style={{ color: "white" }}>
                    Масса людей - наша сила.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md="3">
              <Card
                style={{
                  height: "415px",
                  width: "18rem",
                  padding: "15px",
                  backgroundColor: "#2CA1A5",
                }}
              >
                <Card.Img variant="top" src={photo_3} />
                <Card.Body>
                  <Card.Title style={{ color: "white" }}>
                    Оздоровление
                  </Card.Title>
                  <Card.Text style={{ color: "white" }}>
                    Обеспечение благоприятных условий.т
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md="3">
              <Card
                style={{
                  height: "415px",
                  width: "18rem",
                  padding: "15px",
                  backgroundColor: "#2CA1A5",
                }}
              >
                <Card.Img variant="top" src={photo_4} />
                <Card.Body>
                  <Card.Title style={{ color: "white" }}>Будущее</Card.Title>
                  <Card.Text style={{ color: "white" }}>
                    Спасая природу, мы спасаем себя и наши будущие поколения.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* Страница 4 - "Карта с пунктами сбора вторсырья" */}
      <div className="maps-container" id="maps-container">
        <div className="maps-header">
          <h1>Пункты сбора вторсырья</h1>
        </div>
        
        <div className="map-container">
          <YMaps query={{ apikey: config.YANDEX_API_KEY }}>
            <GeocodeMap />
          </YMaps>
        </div>
        
        <div className="maps-info-metkas">
          <div className="metkas">
            {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
              <div key={category} className="metka">
                <span 
                  className="metka-color" 
                  style={{ backgroundColor: color }}
                />
                <p>{getCategoryName(category)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Страница 5 - "Этапы" с прокруткой */}
      <div className="stages-container" id="stages-container">
        <div className="stages-header">
          <h1>Этапы</h1>
        </div>
        <div className="stages-items">
          <div className="stage_1">
            <div className="stage_1_text">
              <h2>01</h2>
            </div>
            <div className="stage_1_items">
              <h3>Регистрация Личного кабинета</h3>
              <p>Перейти на регистрацию можно по кнопке ниже.</p>
              <Button
                href="/Register"
                className="btn-title main"
              >
                Регистрация
              </Button>
            </div>
          </div>
        </div>
        <div className="stages-items two">
          <div className="stage_1">
            <div className="stage_1_text">
              <h2>02</h2>
            </div>
            <div className="stage_1_items">
              <h3>Подать заявку</h3>
              <p>
                В личном кабинете на панели инструментов найдите кнопку
                «Заявка», перед вами появится окно с формой подачи заявки.
                Заполните и отправьте её.
              </p>
              <Button
                href="/PersonalAcc"
                className="btn-title main"
              >
                Заявка
              </Button>
            </div>
          </div>
        </div>
        <div className="stages-items">
          <div className="stage_1">
            <div className="stage_1_text">
              <h2>03</h2>
            </div>
            <div className="stage_1_items">
              <h3>Анализ</h3>
              <p>
                В личном кабинете на панели инструментов найдите кнопку
                «Анализ», перед вами откроется окно с формой анализа с помощью
                ИИ. Он определит вторсырьё, которое вы хотите сдать на
                переработку и подскажет куда его необходимо сдать.
              </p>
              <Button
                href="/Pererabot"
                className="btn-title main"
              >
                Анализ
              </Button>
            </div>
          </div>
        </div>
        <div className="stages-items two">
          <div className="stage_1">
            <div className="stage_1_text">
              <h2>04</h2>
            </div>
            <div className="stage_1_items">
              <h3>Рассмотрение заявки</h3>
              <p>
                В личном кабинете будут отображаться поданные вами заявки о
                проблемах в природе, так же у них есть статус работы (3 вида). В
                зависимости от вида работы заявки вы видите как раотают наши
                сотрудники.
              </p>
              <Button
                href="/PersonalAcc"
                className="btn-title main"
              >
                Личный кабинет
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Home;