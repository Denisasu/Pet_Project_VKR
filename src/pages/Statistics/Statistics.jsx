import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import { Map, YMaps } from '@pbe/react-yandex-maps';
import { RECYCLING_POINTS } from '../../data/recyclingPoints'; // Импортируем массив пунктов переработки
import styles from "./Statistics.module.css";

function Statistics() {
  const [statistics, setStatistics] = useState(null); // Состояние для хранения статистики

  useEffect(() => {
    // Делаем запрос на сервер для получения статистики
    axios.get('http://localhost:8000/statistics/') // Прямой запрос без использования baseUrl
      .then(response => {
        console.log('Server response:', response.data); // Логируем ответ сервера для отладки
        setStatistics(response.data); // Устанавливаем статистику в состояние
      })
      .catch(error => {
        console.error('Ошибка при получении статистики:', error);
      });
  }, []); // useEffect будет срабатывать при монтировании компонента

  // Если статистика не загружена, отображаем заглушку
  if (!statistics) {
    return <div style={{marginTop:'150px',alignContent:"center"}}>Loading...</div>;
  }

  return (

      <Container className={styles.container}>
        <Row className={styles.row}>
          <Col xs={12} md={6} className={styles.colHalf}>
            <Row className={styles.infoBlock}>
              <Col>
                <div className={styles.section}>
                  <div className={styles.sectionTitle}>Колличество пользователей</div>
                  <div className={styles.sectionValue}>{statistics.total_users}</div>
                </div>
                <div className={styles.section}>
                  <div className={styles.sectionTitle}>Количество заявок</div>
                  <div className={styles.sectionValue}>{statistics.total_applications}</div>
                </div>
                <div className={styles.section}>
                  <div className={styles.sectionTitle}>Колличество пунктов сбора вторсырья</div>
                  <div className={styles.sectionValue}>{RECYCLING_POINTS.length}</div>
                </div>
              </Col>
            </Row>
          </Col>
          <Col xs={12} md={6} className={styles.colHalf}>
            <YMaps>
              <div className={styles.mapContainer}>
                <Map defaultState={{ center: [53.346785, 83.776856], zoom: 9 }} style={{ width: '100%', height: '100%' }} />
              </div>
            </YMaps>
          </Col>
        </Row>
      </Container>

  );
}

export default Statistics;