from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import pages, api
import os

Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files from the original main app
static_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../main/static'))
app.mount("/static", StaticFiles(directory=static_dir), name="static")

app.include_router(pages.router)
app.include_router(api.router, prefix="/api")


@app.get("/root")
async def root():
    return {"message": "Hello World"}
