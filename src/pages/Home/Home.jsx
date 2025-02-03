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
        navigate('/PersonalAcc');
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

                {/* Страница 3 - "Актуальность" с прокруткой */}
                <div className="actuality-container" id="actuality-container">
                    <div className="actuality-header">
                        <h1>Актуальность</h1>
                    </div>
                    <div className="actual-sliders">
                        <div className="actual-sliders-item">

                        </div>
                    </div>
                    
                </div>

                {/* Страница 3 - "Актуальность" с прокруткой */}
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
                                <h3>Подача заявки</h3>
                                <p>Подайте заявку на участие в проекте</p>
                            </div>
                        </div>
                    </div>
                    
                </div>


            </Container>
        </>
    );
}

export default Home;
