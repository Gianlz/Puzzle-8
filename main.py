from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from puzzle import Puzzle8

app = FastAPI(title="Resolvedor de Puzzle-8")

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuração dos arquivos estáticos e templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="Templates")

class RequisicaoPuzzle(BaseModel):
    estado_inicial: list
    estado_final: list
    tipo_busca: str

@app.get("/", response_class=HTMLResponse)
async def pagina_inicial(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/resolver")
async def resolver_puzzle(requisicao: RequisicaoPuzzle):
    puzzle = Puzzle8(requisicao.estado_inicial, requisicao.estado_final)
    
    if requisicao.tipo_busca == "largura":
        solucao, tempo_execucao, nos_expandidos = puzzle.resolver_busca_largura()
    else:
        solucao, tempo_execucao, nos_expandidos = puzzle.resolver_busca_a_estrela()
    
    return {
        "solucao": solucao,
        "tempo_execucao": tempo_execucao,
        "nos_expandidos": nos_expandidos
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

