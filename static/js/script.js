let estadoInicial = [
    [1, 2, 3],
    [4, 0, 5],
    [6, 7, 8]
];

let estadoFinal = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0]
];

let numeroSelecionado = null;
let configuracaoAtual = null;

function criarGrid(idGrid, estado) {
    const grid = document.getElementById(idGrid);
    grid.innerHTML = '';
    
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const celula = document.createElement('div');
            celula.className = 'celula-puzzle' + (estado[i][j] === 0 ? ' vazia' : '');
            celula.textContent = estado[i][j] || '';
            celula.dataset.linha = i;
            celula.dataset.coluna = j;
            celula.onclick = () => tratarCliqueCelula(idGrid, i, j);
            grid.appendChild(celula);
        }
    }
}

function criarGridEstado(estado) {
    const grid = document.createElement('div');
    grid.className = 'grid-puzzle';
    
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const celula = document.createElement('div');
            celula.className = 'celula-puzzle' + (estado[i][j] === 0 ? ' vazia' : '');
            celula.textContent = estado[i][j] || '';
            grid.appendChild(celula);
        }
    }
    return grid;
}

function alternarGrid(tipo) {
    if (configuracaoAtual === tipo) {
        configuracaoAtual = null;
        document.querySelectorAll('.celula-puzzle').forEach(celula => {
            celula.classList.remove('configurando');
        });
    } else {
        configuracaoAtual = tipo;
        const idGrid = tipo === 'inicial' ? 'gridInicial' : 'gridFinal';
        const idOutroGrid = tipo === 'inicial' ? 'gridFinal' : 'gridInicial';
        
        document.querySelectorAll(`#${idGrid} .celula-puzzle`).forEach(celula => {
            celula.classList.add('configurando');
        });
        document.querySelectorAll(`#${idOutroGrid} .celula-puzzle`).forEach(celula => {
            celula.classList.remove('configurando');
        });
    }
}

function tratarCliqueCelula(idGrid, i, j) {
    const estado = idGrid === 'gridInicial' ? estadoInicial : estadoFinal;
    
    if (!configuracaoAtual || idGrid !== `grid${configuracaoAtual.charAt(0).toUpperCase() + configuracaoAtual.slice(1)}`) {
        return;
    }

    if (numeroSelecionado === null) {
        numeroSelecionado = {
            valor: estado[i][j],
            linha: i,
            coluna: j
        };
        document.querySelector(`#${idGrid} [data-linha="${i}"][data-coluna="${j}"]`).classList.add('selecionado');
    } else {
        const temp = estado[i][j];
        estado[i][j] = numeroSelecionado.valor;
        estado[numeroSelecionado.linha][numeroSelecionado.coluna] = temp;
        
        document.querySelectorAll('.celula-puzzle').forEach(celula => {
            celula.classList.remove('selecionado');
        });
        numeroSelecionado = null;
        
        criarGrid(idGrid, estado);
        
        document.querySelectorAll(`#${idGrid} .celula-puzzle`).forEach(celula => {
            celula.classList.add('configurando');
        });
    }
}

async function resolverPuzzle(metodo) {
    if (configuracaoAtual) {
        alternarGrid(configuracaoAtual);
    }
    
    try {
        const resposta = await fetch('/resolver', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                estado_inicial: estadoInicial,
                estado_final: estadoFinal,
                tipo_busca: metodo
            })
        });

        const dados = await resposta.json();
        exibirSolucao(dados);
    } catch (erro) {
        console.error('Erro ao resolver o puzzle:', erro);
    }
}

function exibirSolucao(dados) {
    const divSolucao = document.getElementById('solucao');
    const metricaTempo = document.getElementById('metrica-tempo');
    const metricaEstados = document.getElementById('metrica-estados');
    
    divSolucao.style.display = 'block';
    metricaTempo.textContent = `${dados.tempo_execucao.toFixed(3)}s`;
    metricaEstados.textContent = dados.nos_expandidos;

    const divPassos = document.getElementById('passos');
    divPassos.innerHTML = '';

    dados.solucao.forEach((estado, indice) => {
        const passo = document.createElement('div');
        passo.className = 'passo';
        passo.style.animationDelay = `${indice * 0.1}s`;
        
        const cabecalhoPasso = document.createElement('h3');
        cabecalhoPasso.textContent = `Passo ${indice + 1}`;
        
        passo.appendChild(cabecalhoPasso);
        passo.appendChild(criarGridEstado(estado));
        divPassos.appendChild(passo);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    criarGrid('gridInicial', estadoInicial);
    criarGrid('gridFinal', estadoFinal);
}); 