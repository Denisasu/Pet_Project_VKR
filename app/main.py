from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Request
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from . import models, schemas
from .database import SessionLocal, engine
from .schemas import Application, Message, UpdateStatus
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import aiosmtplib
from email.mime.text import MIMEText
from app.schemas import UserVerificationCreate, UserVerificationCheck
from datetime import datetime, timedelta, timezone
import torch
import torch.nn as nn
import torchvision.transforms as transforms
import torchvision.models as torchvision_models
from PIL import Image
from fastapi import Form
import io
from io import BytesIO
import re
import random
import string
import os
import uuid
import base64
from fastapi.security import OAuth2PasswordBearer
from shapely.wkt import loads as wkt_loads
from geoalchemy2.shape import from_shape
from shapely.geometry import Point
from geoalchemy2.functions import ST_AsText
from geoalchemy2.shape import to_shape
from shapely.geometry import mapping
from typing import List
from .schemas import Application
from typing import List
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas
from .database import SessionLocal  
from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status

# Создаем таблицы
models.Base.metadata.create_all(bind=engine)

# Настройки для работы с паролями
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Инициализация FastAPI приложения
app = FastAPI()

UPLOAD_DIR = "static/photos"  # Папка для сохранения изображений
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Настроим FastAPI для обслуживания статических файлов
app.mount("/static", StaticFiles(directory="static"), name="static")

# CORS настройки - можно расширить для работы с внешними доменами, если нужно
origins = [
    "http://localhost:5173",  # Для локального сервера
    "http://127.0.0.1:5173",
    "http://localhost:8000",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Подключение папки static для хранения и доступа к изображениям
app.mount("/static", StaticFiles(directory="static"), name="static")

#------------------------------------------------------------------------------#

# Функция для подключения к БД
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Функция для хеширования пароля
def hash_password(password: str):
    return pwd_context.hash(password)

# Функция для проверки пароля
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

# Генерация случайного кода
def generate_verification_code():
    return str(random.randint(100000, 999999))  # 6-значный код

    # Устанавливаем время истечения в UTC
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)  # Код действует 10 минут

    return code, expires_at
    

# Конвертация изображения из base64 в файл
async def Image_Converter(Hax_Value: str):
    Hax_Value = Hax_Value + "=" * ((4 - len(Hax_Value) % 4) % 4)  # Добавляем знаки '=' для корректного base64 формата
    random_name = str(uuid.uuid4())
    img_path = f"./static/{random_name}.jpg"
    os.makedirs("static", exist_ok=True)
    with open(img_path, 'wb') as decodeit:
        decodeit.write(base64.b64decode(Hax_Value))
    img_url = f"base_url/static/{random_name}.jpg"
    return img_url

class EmailRequest(BaseModel):
    email: str

async def send_email(recipient: str, code: str):
    # Настройка параметров письма
    sender = "denislopushansky@yandex.ru"  
    subject = "Подтверждение регистрации"
    content = f"Ваш код подтверждения: {code}"

    # Создаем письмо
    message = MIMEText(content)
    message["From"] = sender
    message["To"] = recipient
    message["Subject"] = subject

    # Отправляем письмо через SMTP
    try:
        await aiosmtplib.send(
            message,
            hostname="smtp.yandex.ru",  # замените на ваш SMTP-сервер
            port= 465,
            username="denislopushansky@yandex.ru",
            password="ftelxkvdkjvsjiyl",
            use_tls=True
        )
    except Exception as e:
        print("Ошибка отправки:", e)
        raise HTTPException(status_code=500, detail="Ошибка при отправке письма")
    
async def save_and_crop_image(file: UploadFile):
    try:
        # Прочитать изображение из файла
        image = Image.open(io.BytesIO(await file.read()))
        
        # Применить обрезку изображения (например, до 150x150 пикселей)
        image = image.resize((150, 150))
        
        # Генерация уникального имени файла
        filename = f"{uuid.uuid4()}.jpg"
        file_path = os.path.join(UPLOAD_DIR, filename)
        
        # Сохранение изображения после обрезки
        image.save(file_path, "JPEG")
        
        # Возвращаем путь к изображению
        return f"/static/photos/{filename}"
    
    except Exception as e:
        print(f"Ошибка обработки изображения: {e}")
        raise HTTPException(status_code=400, detail="Ошибка обработки изображения")
    

# CRUD для Application
@app.post("/applications/", response_model=schemas.Application)
def create_application(application: schemas.ApplicationCreate, db: Session = Depends(get_db)):
    # Получаем пользователя по его user_id (предполагается, что user_id передается)
    db_user = db.query(models.User).filter(models.User.id == application.user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    db_application = models.Application(**application.dict(), user_id=db_user.id)
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    
    # Преобразуем сохраненную геолокацию в формат GeoJSON перед отправкой ответа
    location_geojson = mapping(to_shape(db_application.location))  # Преобразуем в GeoJSON
    photo_base64 = base64.b64encode(db_application.photo).decode('utf-8')

    # Возвращаем объект с правильной геолокацией
    return { 
        "id": db_application.id,
        "photo": photo_base64,
        "location": location_geojson,  # Форматируем location в GeoJSON
        "description": db_application.description,
        "status_id": application.status_id,
        "created_at": db_application.created_at,
        "user_id": db_application.user_id
    }



@app.get("/applications/", response_model=list[schemas.Application])
def get_applications(
    status: str = None, skip: int = 0, limit: int = 10, db: Session = Depends(get_db)
):
    query = db.query(models.Application)
    if status:
        query = query.join(models.Application.status).filter(models.Status.name == status)
    return query.offset(skip).limit(limit).all()

@app.get("/applications/{application_id}", response_model=schemas.Application)
def get_application(application_id: int, db: Session = Depends(get_db)):
    application = db.query(models.Application).filter(models.Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Заявка не найдена")
    return application

@app.delete("/applications/{application_id}")
def delete_application(application_id: int, db: Session = Depends(get_db)):
    db_application = db.query(models.Application).filter(models.Application.id == application_id).first()
    if db_application:
        db.delete(db_application)
        db.commit()
        return {"message": "Заявка успешно удалена"}
    raise HTTPException(status_code=404, detail="Заявка не найдена")

@app.put("/applications/{application_id}/status", response_model=schemas.Application)
def update_application_status(application_id: int, status: schemas.UpdateStatus, db: Session = Depends(get_db)):
    db_application = db.query(models.Application).filter(models.Application.id == application_id).first()
    if not db_application:
        raise HTTPException(status_code=404, detail="Заявка не найдена")

    db_status = db.query(models.Status).filter(models.Status.id == status.status_id).first()
    if not db_status:
        raise HTTPException(status_code=404, detail="Статус не найден")

    db_application.status_id = db_status.id
    db.commit()
    db.refresh(db_application)
    return db_application

@app.get("/applications/user/{user_id}", response_model=List[schemas.ApplicationBase])
def get_applications_by_user(user_id: int, db: Session = Depends(get_db)):
    applications = db.query(models.Application).filter(models.Application.user_id == user_id).all()
    if not applications:
        raise HTTPException(status_code=404, detail="Заявки не найдены")
    return applications



# CRUD для Message
@app.post("/messages/", response_model=schemas.Message)
def create_message(message: schemas.MessageCreate, db: Session = Depends(get_db)):
    try:
        # Проверяем, существует ли пользователь
        db_user = db.query(models.User).filter(models.User.id == message.user_id).first()
        if not db_user:
            raise HTTPException(status_code=404, detail="Пользователь не найден")

        # Создаем объект сообщения без дублирования user_id
        db_message = models.Message(**message.dict())

        db.add(db_message)
        db.commit()
        db.refresh(db_message)

        return db_message
    except Exception as e:
        print(f"Ошибка: {e}")
        raise HTTPException(status_code=500, detail="Ошибка на сервере")

@app.get("/messages/{message_id}", response_model=schemas.Message)
def get_message(message_id: int, db: Session = Depends(get_db)):
    message = db.query(models.Message).filter(models.Message.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Сообщение не найдено")
    return message

@app.delete("/messages/{message_id}")
def delete_message(message_id: int, db: Session = Depends(get_db)):
    db_message = db.query(models.Message).filter(models.Message.id == message_id).first()
    if db_message:
        db.delete(db_message)
        db.commit()
        return {"message": "Сообщение успешно удалено"}
    raise HTTPException(status_code=404, detail="Сообщение не найдено")

# Дополнительные маршруты
from sqlalchemy import text

@app.get("/statistics/")
async def get_statistics():
    with engine.connect() as connection:
        total_users = connection.execute(text("SELECT COUNT(*) FROM users")).scalar()
        total_applications = connection.execute(text("SELECT COUNT(*) FROM applications")).scalar()
        completed_applications = connection.execute(text("""
            SELECT COUNT(*)
            FROM applications
            JOIN status ON applications.status_id = status.id
            WHERE status.name = 'Completed'
        """)).scalar()

    return {
        "total_users": total_users,
        "total_applications": total_applications,
        "completed_applications": completed_applications
    }


@app.post("/convert_image", tags=["IMAGE"])
async def convert_image(Hax_Value: str):
    img_path = await Image_Converter(Hax_Value)
    return {"converted_image_url": img_path}

@app.post("/register/")
async def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Проверяем, существует ли пользователь с таким email
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Пользователь с таким email уже существует")

    # Хешируем пароль
    hashed_password = hash_password(user.password)

    # Генерируем и сохраняем код подтверждения
    verification_code = generate_verification_code()

    # Создаем нового пользователя, который еще не активирован
    new_user = models.User(
        email=user.email,
        password_hash=hashed_password,  # Сохраняем хешированный пароль
        first_name=user.first_name,
        photo_url=user.photo_url,
        verification_code=verification_code,
        verification_created_at=datetime.now(timezone.utc),
        verification_expires_at=datetime.now(timezone.utc) + timedelta(minutes=10),
        is_active=False  # Пользователь не активирован до подтверждения email
    )

    db.add(new_user)
    db.commit()  # Сохраняем пользователя с кодом подтверждения
    db.refresh(new_user)

    # Отправляем код подтверждения на email
    await send_email(user.email, verification_code)

    return {"message": "Пользователь зарегистрирован. Код подтверждения отправлен на email"}

@app.post("/verify-code/")
async def verify_code(data: UserVerificationCheck, db: Session = Depends(get_db)):
    # Ищем пользователя по email и коду подтверждения
    user = db.query(models.User).filter(
        models.User.email == data.email,
        models.User.verification_code == data.code
    ).first()

    if not user:
        raise HTTPException(status_code=400, detail="Неверный код подтверждения")

    # Проверяем, не истек ли срок действия кода
    current_time = datetime.now(timezone.utc)
    if user.verification_expires_at < current_time:
        raise HTTPException(status_code=400, detail="Код истёк")

    # Все проверки пройдены, активируем пользователя
    user.is_active = True
    db.commit()

    return {"message": "Код подтверждения действителен, пользователь активирован"}



# Конфигурация JWT

SECRET_KEY = "m5J7rLHfQWz0bXvnM-DJU6v_K7jgH7Q4RoVd9kD38hA"  
# Секретный ключ для подписи JWT токенов — должен быть уникальным и секретным

ALGORITHM = "HS256"  
# Алгоритм подписи токена (HMAC SHA-256)

ACCESS_TOKEN_EXPIRE_MINUTES = 60  
# Время жизни токена в минутах (1 час)

# Настройка схемы OAuth2 для получения токена
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")  
# tokenUrl — путь эндпоинта, куда отправлять форму с логином и паролем для получения токена


def create_access_token(data: dict, expires_delta: timedelta = None):
    # Создаем JWT токен с данными и временем истечения срока действия
    to_encode = data.copy()  # копируем словарь с данными для токена
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))  
    # рассчитываем время истечения токена: сейчас + expires_delta или значение по умолчанию
    to_encode.update({"exp": expire})  # добавляем поле "exp" — время истечения
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)  
    # создаем и подписываем JWT
    return encoded_jwt


def verify_token(token: str, credentials_exception):
    # Проверяем валидность и декодируем токен
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])  
        # декодируем токен и проверяем подпись
        user_id: int = payload.get("sub")  # получаем идентификатор пользователя из поля "sub"
        if user_id is None:
            # если в токене нет "sub" — токен недействительный
            raise credentials_exception
        return user_id  # возвращаем user_id для дальнейшего использования
    except JWTError:
        # если токен недействителен (ошибка подписи, истекший и т.п.)
        raise credentials_exception


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    # Получение текущего пользователя из токена
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Невалидный токен доступа",
        headers={"WWW-Authenticate": "Bearer"},
    )
    user_id = verify_token(token, credentials_exception)  # проверяем токен и получаем user_id
    user = db.query(models.User).filter(models.User.id == user_id).first()  
    # ищем пользователя в базе по id
    if user is None:
        # если пользователь не найден — возвращаем ошибку авторизации
        raise credentials_exception
    return user  # возвращаем объект пользователя


# Авторизация пользователя — эндпоинт для получения JWT токена
from fastapi.security import OAuth2PasswordRequestForm

@app.post("/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Получаем пользователя по email (здесь email используется как username)
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    
    # Проверяем правильность пароля и существование пользователя
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверные учетные данные",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Проверяем, что пользователь активен
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пользователь не активирован"
        )

    # Создаем токен с временем жизни из конфига
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)},  # "sub" — стандартное поле с идентификатором субъекта
        expires_delta=access_token_expires
    )
    
    # Возвращаем токен и дополнительные данные пользователя
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "first_name": user.first_name,
        "photo_url": user.photo_url
    }


@app.get("/users/me")
def read_users_me(current_user: models.User = Depends(get_current_user)):
    # Получение информации о текущем пользователе (авторизованном по токену)
    return {
        "id": current_user.id,
        "email": current_user.email,
        "first_name": current_user.first_name,
        "photo_url": current_user.photo_url
    }

@app.post("/send-confirmation-email/")
async def send_confirmation_email(request: EmailRequest):
    await send_email(request.email)
    return {"message": "Письмо с подтверждением отправлено"}

@app.put("/users/{user_id}")
async def update_user(
    user_id: int,
    first_name: str = Form(None),
    email: str = Form(None),
    file: UploadFile = None,
    db: Session = Depends(get_db),
):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    # Обновление данных
    if first_name:
        db_user.first_name = first_name
    if email:
        db_user.email = email

    # Обработка файла
    if file:
        file_location = f"{UPLOAD_DIR}/{uuid.uuid4()}_{file.filename}"
        with open(file_location, "wb") as file_object:
            file_object.write(file.file.read())
        db_user.photo_url = f"/static/photos/{file_location.split('/')[-1]}"

    db.commit()
    db.refresh(db_user)
    return db_user


# Эндпоинт для удаления пользователя
@app.delete("/delete-user/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    db.delete(user)
    db.commit()
    return {"message": "Пользователь удалён"}

@app.post("/send-verification-code/")
async def send_verification_code(email_request: EmailRequest, db: Session = Depends(get_db)):
    email = email_request.email

    # Проверяем, что email корректный
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        raise HTTPException(status_code=400, detail="Некорректный e-mail")

    # Генерируем код
    code = generate_verification_code()

    # Проверяем, существует ли пользователь с таким email
    existing_user = db.query(models.User).filter(models.User.email == email).first()

    if existing_user:
        # Если пользователь существует, обновляем его данные (для восстановления пароля)
        existing_user.verification_code = code
        existing_user.verification_created_at = datetime.now(timezone.utc)
        existing_user.verification_expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)
    else:
        # Если пользователь не существует, создаем запись в таблице verification_codes (для регистрации)
        verification_code = models.VerificationCode(
            email=email,
            code=code,
            created_at=datetime.now(timezone.utc),
            expires_at=datetime.now(timezone.utc) + timedelta(minutes=10)
        )
        db.add(verification_code)

    db.commit()

    # Отправляем код на email
    await send_email(email, code)
    return {"message": "Код подтверждения отправлен на ваш email"}


@app.post("/reset-password/")
async def reset_password(data: UserVerificationCheck, db: Session = Depends(get_db)):
    try:
        # Ищем пользователя по email и коду верификации
        user = db.query(models.User).filter(
            models.User.email == data.email,
            models.User.verification_code == data.code
        ).first()

        # Проверяем, что пользователь найден
        if not user:
            raise HTTPException(status_code=400, detail="Неверный код")

        # Получаем текущее время в UTC
        current_time = datetime.now(timezone.utc)

        # Преобразуем время истечения кода к UTC
        if user.verification_expires_at.tzinfo is not None:
            expires_at_utc = user.verification_expires_at.astimezone(timezone.utc)
        else:
            expires_at_utc = user.verification_expires_at.replace(tzinfo=timezone.utc)

        # Логируем значения для отладки
        print(f"Expires at: {expires_at_utc}, Current time: {current_time}")

        # Проверяем, что срок действия кода не истёк
        if expires_at_utc < current_time:
            raise HTTPException(status_code=400, detail="Код истёк")

        # Хэшируем новый пароль
        hashed_password = hash_password(data.new_password)

        # Обновляем пароль пользователя
        user.password_hash = hashed_password

        # Очищаем код верификации после использования
        user.verification_code = None
        user.verification_expires_at = None
        db.commit()

        return {"message": "Пароль успешно сброшен"}
    except Exception as e:
        print(f"Ошибка при сбросе пароля: {e}")
        raise HTTPException(status_code=500, detail=f"Произошла ошибка при сбросе пароля: {str(e)}")
    

@app.post("/upload_image/")
async def upload_image(file: UploadFile):
    image_url = await save_and_crop_image(file)
    return {"image_url": image_url}


# Загрузка модели
class_names = ['cardboard', 'glass', 'metal', 'paper', 'plastic', 'trash']  # Названия ваших классов
model = torchvision_models.resnet18(pretrained=False)
model.fc = nn.Linear(model.fc.in_features, len(class_names))
model.load_state_dict(torch.load('C:/Users/user/Desktop/Git Uploads/Pet_Project_VKR/Pet_Project_VKR_clean/app/trash_classifier.pth', map_location=torch.device('cpu')))
model.eval()  # Перевод модели в режим оценки

# Трансформация изображения
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

def predict(image: Image.Image):
    # Преобразование изображения в тензор
    image = transform(image).unsqueeze(0)  # Добавляем batch dimension
    with torch.no_grad():
        outputs = model(image)
        _, predicted = torch.max(outputs, 1)
        confidence = torch.nn.functional.softmax(outputs, dim=1)[0][predicted].item()
        predicted_class = class_names[predicted.item()]
    return predicted_class, confidence

# Маршрут для классификации
@app.post("/classify/")
async def classify_image(file: UploadFile = File(...)):
    try:
        # Открываем изображение
        image = Image.open(BytesIO(await file.read())).convert("RGB")
        predicted_class, confidence = predict(image)
        
        # Возвращаем результат
        return {
            "class": predicted_class,
            "confidence": confidence
        }
    except Exception as e:
        return {"error": str(e)}

# Пример маршрута для вашего запроса
@app.get("/your-api-endpoint/{parameter}")
async def get_data(parameter: str):
    # Логика обработки параметра
    return {"parameter": parameter}


@app.get("/get_location/{application_id}")
def get_application_location(application_id: int, db: Session = Depends(get_db)):
    # Получаем заявку по ID
    application = db.query(models.Application).filter(models.Application.id == application_id).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Заявка не найдена")
    
    # Получаем геометрическую точку из базы данных
    location_wkb = application.location  # Предположим, что это WKB
    
    # Преобразуем WKB в объект Point
    location_point = to_shape(location_wkb)
    
    # Получаем координаты
    longitude = location_point.x  # Долгота
    latitude = location_point.y   # Широта
    
    return {
        "latitude": latitude,
        "longitude": longitude
    }



