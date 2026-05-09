from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, equipment, requests, users, dashboard

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="School Equipment Lending Portal",
    description="REST API for managing school equipment borrowing and returns",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(equipment.router)
app.include_router(requests.router)
app.include_router(users.router)
app.include_router(dashboard.router)


@app.get("/")
def root():
    return {"message": "School Equipment Lending Portal API", "docs": "/docs"}
