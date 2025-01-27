import React, { useEffect, useState } from 'react';
import { Image, Alert } from 'react-bootstrap';
import axios from 'axios';
import styles from "./Pererabot.module.css";
import ellipse from '../../imgs/pererabot/ellipse.svg';
import star from '../../imgs/pererabot/star.svg';

function Pererabot() {
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [classificationResult, setClassificationResult] = useState(null);
  const [baseUrl, setBaseUrl] = useState('http://localhost:8000');

  // Адреса для переработки в зависимости от класса
  const recyclingAddresses = {
    картон: [
      "ул. Логовская, 68",
      "ул. Г. Титова 35А, склад 11",
      "Малахова улица, 1/2, 2 этаж"
    ],
    стекло: [
      "Промышленная, 180",
      "Германа Титова, 6/4",
      "Павловский тракт, 220"
    ],
    металл: [
      "Проспект Космонавтов, 3",
      "Смирнова, 10",
      "Германа Титова, 4д/1"
    ],
    бумага: [
      "ул. Логовская, 68",
      "ул. Г. Титова 35А, склад 11",
      "Кулагина, 28"
    ],
    пластик: [
      "ул. Г. Титова 35А, склад 11",
      "Стахановская, 80",
      "Северо-Западная улица, 82"
    ],
    другое: [
      "Малахова улица, 177е",
      "Пролетарская улица, 64",
      "Енисейская, 61а"
    ]
  };

  useEffect(() => {
    // Логика для установки правильного baseUrl
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = /android/.test(userAgent); // Проверка на Android
  
    if (isAndroid) {
      setBaseUrl('http://192.168.31.128:8000'); // Для мобильного устройства
    } else {
      setBaseUrl('http://localhost:8000'); // Для веб-приложения
    }
  
  }, []);
  
  // Перевод классов с английского на русский
  const translateClass = (classificationClass) => {
    const classTranslation = {
      cardboard: "картон",
      glass: "стекло",
      metal: "металл",
      paper: "бумага",
      plastic: "пластик",
      trash: "другое"
    };
    return classTranslation[classificationClass] || classificationClass;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
  
    if (!image) {
      console.error('Файл изображения не выбран');
      setIsSubmitting(false);
      return;
    }
  
    const formData = new FormData();
    formData.append("file", image);
  
    try {
      const response = await axios.post(`${baseUrl}/classify/`, formData, {
        headers: {"Content-Type": "multipart/form-data"},
      });
      console.log("Классификация завершена:", response.data);
      setClassificationResult(response.data);
    } catch (error) {
      console.error("Ошибка классификации:", error.response && error.response.data ? error.response.data : error);
    } finally {
      setIsSubmitting(false);
    }
  };
   

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setClassificationResult(null); // Сброс предыдущего результата
    } else {
      console.error("Нет файла");
    } // Сброс предыдущего результата
  };

  // Функция для получения адресов переработки по классу
  const getRecyclingAddresses = (classificationClass) => {
    const translatedClass = translateClass(classificationClass);
    return recyclingAddresses[translatedClass] || [];
  };

  return (
  <div className={styles.pererabotContainer}>
    <div className={styles.container}>
      <div className={styles.pererabotContent}>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <h2 className={styles.title}>Классификация отходов</h2>

          <div className={styles.inputDiv}>
            <label htmlFor="fileInput" className={styles.fileLabel}>
              <div className={styles.icon}>
                <i className="fas fa-camera"></i>
              </div>
              <h5>Фото</h5>
              <input
                id="fileInput"
                type="file"
                onChange={handleImageChange}
                className={styles.input}
                capture="camera"
                accept="image/*"
                //style={{ display: "none" }} // Скрываем сам input
              />
            </label>
          </div>

          {image && (
            <div className={styles.preview}>
              <Image src={URL.createObjectURL(image)} fluid />
            </div>
          )}

          <div className={styles.buttonsWrapper}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting || !image}
            >
              {isSubmitting ? "Анализ..." : "Классифицировать"}
            </button>
          </div>
        </form>

        {classificationResult && (
          <Alert variant="info" className={styles.alert}>
            <h4>Результат: {translateClass(classificationResult.class)}</h4>
            <p>Уверенность: {(classificationResult.confidence * 100).toFixed(2)}%</p>

            {/* Адреса переработки */}
            <div className={styles.recyclingAddresses}>
              <h5>Адреса для переработки:</h5>
              <ul>
                {getRecyclingAddresses(classificationResult.class).map((address, index) => (
                  <li key={index}>{address}</li>
                ))}
              </ul>
            </div>
          </Alert>
        )}
      </div>
    </div>

    {/* Добавление изображений */}
    <img src={ellipse} alt="ellipse" className={styles.ellipse} />
    <img src={star} alt="star" className={styles.star} />
  </div>
);
}

export default Pererabot;
