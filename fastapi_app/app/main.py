from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from .database import engine, Base
from .routers import pages, api
import os

Base.metadata.create_all(bind=engine)

app = FastAPI()

# Mount static files
# The directory is relative to this file
static_dir = os.path.join(os.path.dirname(__file__), 'static')
app.mount("/static", StaticFiles(directory=static_dir), name="static")

app.include_router(pages.router)
app.include_router(api.router, prefix="/api") # Adding the prefix here as well for consistency


@app.get("/root") # Changing this to /root to avoid conflict
async def root():
    return {"message": "Hello World"}
