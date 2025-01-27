import React, { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './home.css';
import statisticsImg from '../../imgs/statistics.png';
import analysisImg from '../../imgs/analysis.png';
import applicationImg from '../../imgs/application.png';
import profileImg from '../../imgs/profile.png';

function Home() {
    const navigate = useNavigate();

    // Функция для навигации на страницу "Заявка"
    const handleClick = () => {
        navigate('/Zayvka');
    };

    return (
        <>
            <Container className='container'>
                {/* Секция, приветствующая пользователя и предлагающая перейти к заявке */}
                <section className='secone' id="secone">
                    <div className='ellipse'></div>
                    <div className='secone-one'>
                        <div className="header">
                            <div className="line-container-first">
                                <h1>Охрана</h1>
                                <div className="dashed-line"></div>
                            </div>
                            <div className="line-container-second">
                                <div className="dashed-line"></div>
                                <h2>это</h2>
                            </div>
                        </div>
                        <div className='button-group'>
                            <Button 
                                onClick={handleClick} 
                                className='btn-title'>  
                                Очистить природу
                            </Button>  
                            <Button 
                                onClick={handleClick} 
                                className='btn-title'>  
                                О проекте
                            </Button> 
                        </div>
                    </div>
                </section>
                {/* Элипс в середине страницы */}
                
            
                
                {/* Страница 2 - "О проекте" с прокруткой */}
                <div className="project-container" id="project-container">
                    <div className="project-header">
                        <h1>О проекте</h1>
                    </div>
                    <div className="project-goal">
                        <h2>Цель</h2>
                        <p>Сбор и обработка заявок о загрязнении природы на территории Алтайского края</p>
                    </div>
                    <div className="project-functionality">
                        <h2>Функционал</h2>
                        <div className="buttons-container">
                            <button className="function-button">
                                <img src={statisticsImg} alt="Статистика" />
                                Статистика
                            </button>
                            <button className="function-button">
                                <img src={analysisImg} alt="Анализ" />
                                Анализ вторсырья
                            </button>
                            <button className="function-button">
                                <img src={applicationImg} alt="Подача заявки" />
                                Подача заявки
                            </button>
                            <button className="function-button">
                                <img src={profileImg} alt="Личный кабинет" />
                                Личный кабинет
                            </button>
                        </div>
                    </div>
                    </div>
            </Container>

                

                {/* Актуальность (закомментировано) */}
                {/*
                <section>
                    <div className="aktual">
                        <h2>Актуальность</h2>
                        <div className="aktall">
                            <div className="akt1">
                                <h3>Чистота</h3>
                                <p>Берегите природу, оставляйте за собой чистоту</p>
                                <img src={act1} alt="Чистота" width={300} />
                            </div>

                            <div className="akt2">
                                <h3>Вместе</h3>
                                <p>Масса людей наша сила</p>
                                <img src={act2} alt="Чистота" width={300} />
                            </div>

                            <div className="akt3">
                                <h3>Оздоровление</h3>
                                <p>Обеспечение благоприятных условий</p>
                                <img src={act3} alt="Чистота" width={300} />
                            </div>

                            <div className="akt4">
                                <h3>Будущее</h3>
                                <p>Спасая природу, мы спасаем себя и наши будущие поколения</p>
                                <img src={act4} alt="Чистота" width={300} />
                            </div>
                        </div>
                    </div>
                </section>
                */}

                {/* Инструкции по очищению природы */}
                {/*
                <section>
                    <div className="inform">
                        <h2>Как начать очищать природу</h2>
                        <div className="infblock">
                            <div className="inf1">
                                <div className='inf1-one'>1</div>
                                <p>Перейти на страницу заполнения заявки по кнопке &quot;Очистить природу&quot;</p>
                            </div>

                            <div className="inf2">
                                <div className='inf2-one'>2</div>
                                <p>Сделать фотографию загрязненной местности и прикрепить ее в Вашу Заявку</p>
                            </div>

                            <div className="inf3">
                                <div className='inf3-one'>3</div>
                                <p>Ввести номер телефона и дать разрешение на получение Вашей геолокации</p>
                            </div>

                            <div className="inf4">
                                <div className='inf4-one'>4</div>
                                <p>Опишите загрязненную местность и смело нажимайте кнопку &quot;Отправить заявку&quot;</p>
                            </div>
                        </div>
                    </div>
                </section>
                */}
            
        </>
    );
}

export default Home;
