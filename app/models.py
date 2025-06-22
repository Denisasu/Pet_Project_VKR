from sqlalchemy import Column, Integer, String, LargeBinary, DateTime, Float, ForeignKey, Boolean
from sqlalchemy.sql import func
from datetime import datetime, timedelta
from .database import Base
from sqlalchemy import Boolean
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry

class Application(Base):
    __tablename__ = "applications"
    
    id = Column(Integer, primary_key=True, index=True)
    photo = Column(LargeBinary, nullable=False)
    location = Column(Geometry("POINT"), nullable=False)  # Храним геопозицию как точку
    description = Column(String, nullable=False)
    created_at = Column(DateTime, default=func.now()) 

    status_id = Column(Integer, ForeignKey('status.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)

    user = relationship("User", back_populates="applications")
    status = relationship("Status", back_populates="applications")


class Status(Base):
    __tablename__ = "status"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)

    applications = relationship("Application", back_populates="status") 

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    message = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)  # Связь с пользователем

    user = relationship("User", back_populates="messages")  # Связь с пользователем

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(255), nullable=False)  # Добавлено поле для имени
    created_at = Column(DateTime(timezone=True), default=func.now(), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    city = Column(String(255), nullable=False)
    applications = relationship("Application", back_populates="user")  # Связь с заявками
    messages = relationship("Message", back_populates="user")
    
