from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.auth_router import router as auth_router
from app.routers.government_router import router as government_router
from app.routers.government_students_router import router as government_students_router
from app.routers.government_dashboard_router import router as government_dashboard_router
from app.routers.government_recruiters_router import router as government_recruiters_router
from app.routers.government_jobs_router import router as government_jobs_router
from app.routers.government_analytics_router import router as government_analytics_router

app = FastAPI(
    title="SIH Government Dashboard API"
)

# CORS configuration to allow local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth_router)
app.include_router(government_router)
app.include_router(government_dashboard_router)
app.include_router(government_students_router)
app.include_router(government_recruiters_router)
app.include_router(government_jobs_router)
app.include_router(government_analytics_router)

@app.get("/")
def root():
    return {
        "status": "running"
    }