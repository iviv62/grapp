from fastapi import APIRouter, Request, Form, File, UploadFile, Depends
from fastapi.responses import HTMLResponse, PlainTextResponse
from fastapi.templating import Jinja2Templates
from pathlib import Path
from sqlalchemy.orm import Session

from .. import utils, crud
from ..database import SessionLocal

router = APIRouter()

templates = Jinja2Templates(directory=str(Path(__file__).parent.parent / "templates"))

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("graph_visualization/home.html", {"request": request, "home": 1})

@router.get("/about", response_class=HTMLResponse)
async def about(request: Request):
    return templates.TemplateResponse("graph_visualization/about.html", {"request": request, "home": 1})

@router.get("/manual", response_class=HTMLResponse)
async def manual(request: Request):
    return templates.TemplateResponse("graph_visualization/manual.html", {"request": request, "home": 1})

@router.get("/graph/json-editor/", response_class=HTMLResponse)
async def json_editor(request: Request):
    return templates.TemplateResponse("graph_visualization/jsonEditor.html", {"request": request})

@router.get("/about/license.txt", response_class=PlainTextResponse)
async def license_page():
    license_path = Path(__file__).parent.parent / "templates/graph_visualization/license.txt"
    with open(license_path) as f:
        content = f.read()
    return PlainTextResponse(content)

@router.get("/graph", response_class=HTMLResponse)
async def graph_page_get(request: Request, g6: str = None, db: Session = Depends(get_db)):
    context = {"request": request}
    if g6:
        graphData = utils.convertGraph(g6)
        context['data'] = graphData
        context["commands"] = crud.get_commands(db)
    return templates.TemplateResponse("graph_visualization/graph.html", context)


@router.post("/graph", response_class=HTMLResponse)
async def graph_page_post(request: Request, text: str = Form(None), file: UploadFile = File(None), radio: str = Form(...), db: Session = Depends(get_db)):
    context = {"request": request}
    data = ""
    if file and file.filename:
        contents = await file.read()
        data = contents.decode("utf-8")
    elif text:
        data = text
    else:
        return templates.TemplateResponse("graph_visualization/error.html", {"request": request, "message": "No data provided"})

    graphData = utils.convertGraph(data)

    if graphData == "error":
        return templates.TemplateResponse("graph_visualization/error.html", {"request": request, "message": "Invalid graph format"})

    context['data'] = graphData
    context["commands"] = crud.get_commands(db)

    if radio == "2D":
        return templates.TemplateResponse("graph_visualization/graph.html", context)
    else:
        return templates.TemplateResponse("graph_visualization/graph3d.html", context)

@router.get("/graph3d", response_class=HTMLResponse)
async def graph_page_3d(request: Request):
    return templates.TemplateResponse("graph_visualization/graph3d.html", {"request": request})
