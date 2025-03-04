from datetime import datetime
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from geoalchemy2 import Geometry
from geoalchemy2.shape import to_shape
from shapely.geometry import mapping
from fastapi import UploadFile

class Location(BaseModel):
    type: str  # теперь строка для типа геометрии
    coordinates: List[float]

class Application(BaseModel):
    id: int
    photo: bytes
    email: str
    location: Location
    description: str
    status: str  # Добавлено поле
    created_at: datetime  # Добавлено поле
    user_id: int

    class Config:
        from_attributes = True
        arbitrary_types_allowed = True
        orm_mode = True

    # Метод для сериализации поля location в формат GeoJSON
    def dict(self, **kwargs):
        result = super().dict(**kwargs)
        
        # Форматируем дату
        if isinstance(result['created_at'], datetime):
            result['created_at'] = result['created_at'].isoformat()

        # Преобразуем WKBElement в GeoJSON
        if isinstance(result['location'], Geometry):
            geometry = to_shape(result['location'])  # Преобразуем в shapely объект
            result['location'] = mapping(geometry)  # Получаем GeoJSON
        
        return result

class ApplicationCreate(BaseModel):
    photo: bytes
    email: str
    location: Location 
    description: str

class UpdateStatus(BaseModel):
    status: str

class Message(BaseModel):
    id: int
    email: str
    name: str
    message: str
    user_id: int

    class Config:
        from_attributes = True

class MessageCreate(BaseModel):
    email: str
    name: str
    message: str

class UserBase(BaseModel):
    email: EmailStr
    first_name: Optional[str] = None  # Добавлено поле для имени
    city: Optional[str] = None
    photo_url: Optional[str] = None 

class UserCreate(UserBase):
    password: str  # Поле для пароля

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    city: Optional[str] = None
    email: Optional[EmailStr] = None
    photo_url: Optional[UploadFile]

class EmailVerificationCreate(BaseModel):
    email: EmailStr
    code: str
    user_id: int 

class EmailVerificationCheck(BaseModel):
    email: EmailStr
    code: str
    new_password: str