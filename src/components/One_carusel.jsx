import Carousel from "react-bootstrap/Carousel";
import photo_1 from "../imgs/actual-slider/images/1_photo.png"
import photo_2 from "../imgs/actual-slider/images/2_photo.png"
import photo_3 from "../imgs/actual-slider/images/3_photo.png"
import photo_4 from "../imgs/actual-slider/images/4_photo.png"

function One_carusel() {
  return (
    <>
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-50 "
            src={photo_1}
            alt="First slide"
          />
          <Carousel.Caption className="position-static">
            <h5>Чистота природы</h5>
            <p>Берегите природу, оставляйте за собой чистоту.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-50"
            src={photo_2}
            alt="Second slide"
          />
          <Carousel.Caption className="position-static">
            <h5>Вместе</h5>
            <p>Масса людей - наша сила.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-50"
            src={photo_3}
            alt="Third slide"
          />
          <Carousel.Caption className="position-static">
            <h5>Оздоровление</h5>
            <p>
            Обеспечение благоприятных условий.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-50"
            src={photo_4}
            alt="Third slide"
          />
          <Carousel.Caption className="position-static">
            <h5>Будущее</h5>
            <p>
              Спасая природу, мы спасаем себя и наши будущие поколения.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </>
  );
}

export default One_carusel;
