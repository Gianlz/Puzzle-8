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
            
            // Adicionar atributos para drag and drop
            celula.setAttribute('draggable', 'true');
            celula.addEventListener('dragstart', handleDragStart);
            celula.addEventListener('dragover', handleDragOver);
            celula.addEventListener('drop', handleDrop);
            
            // Remover evento de clique existente
            // celula.onclick = () => tratarCliqueCelula(idGrid, i, j);
            
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
        // Atualizar estado diretamente sem animação
        const temp = estado[i][j];
        estado[i][j] = numeroSelecionado.valor;
        estado[numeroSelecionado.linha][numeroSelecionado.coluna] = temp;
        
        // Atualizar a visualização
        criarGrid(idGrid, estado);
        
        document.querySelectorAll('.celula-puzzle').forEach(celula => {
            celula.classList.remove('selecionado');
        });
        numeroSelecionado = null;
        
        // Manter configuração ativa
        document.querySelectorAll(`#${idGrid} .celula-puzzle`).forEach(celula => {
            celula.classList.add('configurando');
        });
    }
}

function resolverPuzzle() {
    if (configuracaoAtual) {
        alternarGrid(configuracaoAtual);
    }
    
    let algoritmoSelecionado = 'largura';
    const radioSelecionado = document.querySelector('input[name="algoritmo"]:checked');
    if (radioSelecionado) {
        algoritmoSelecionado = radioSelecionado.value;
    }
    
    // Verifica se os elementos existem antes de manipulá-los
    const resultadoDiv = document.getElementById('resultado');
    const solucaoDiv = document.getElementById('solucao');
    
    // Se não encontrar o elemento resultado, cria ele
    if (!resultadoDiv) {
        const novoResultado = document.createElement('div');
        novoResultado.id = 'resultado';
        document.body.appendChild(novoResultado);
    }
    
    // Limpa resultados anteriores
    if (resultadoDiv) {
        resultadoDiv.innerHTML = '';
    }
    if (solucaoDiv) {
        solucaoDiv.style.display = 'none';
    }
    
    fetch('/resolver', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            estado_inicial: estadoInicial,
            estado_final: estadoFinal,
            tipo_busca: algoritmoSelecionado
        })
    })
    .then(response => response.json())
    .then(data => {
        const resultado = document.getElementById('resultado');
        
        if (!data.solucionavel) {
            const mensagemErro = `
                <div class="alert alert-danger fade show" role="alert" style="
                    background: linear-gradient(145deg, #ff5b5b, #ff8c8c);
                    border: none;
                    color: white;
                    box-shadow: 0 4px 15px rgba(255, 91, 91, 0.2);
                    border-radius: 10px;
                    padding: 20px;
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 1000;
                    min-width: 300px;
                    max-width: 400px;
                    animation: slideIn 0.3s ease-out;
                ">
                    <div style="display: flex; align-items: start; justify-content: space-between;">
                        <div>
                            <h4 class="alert-heading" style="
                                font-size: 1.5rem;
                                margin-bottom: 15px;
                                font-weight: 600;
                            ">
                                <i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>
                                Configuração impossível!
                            </h4>
                        </div>
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" 
                            style="background: none; border: none; color: white; font-size: 1.5rem; padding: 0;"
                            onclick="this.parentElement.parentElement.remove();">
                            &times;
                        </button>
                    </div>
                    <p style="margin-bottom: 15px; font-size: 1.1rem;">
                        Este puzzle não tem solução possível devido à configuração inicial e final.
                    </p>
                    <hr style="border-top: 1px solid rgba(255,255,255,0.2); margin: 15px 0;">
                    <p class="mb-0" style="
                        display: flex;
                        align-items: center;
                        font-size: 1rem;
                        color: #f8f9fa;
                    ">
                        <i class="fas fa-lightbulb" style="margin-right: 10px;"></i>
                        Dica: Tente reorganizar as peças do estado inicial ou final.
                    </p>
                </div>
                <div class="modal-backdrop fade show" style="opacity: 0.5;"></div>
            `;
            
            // Remover backdrop anterior se existir
            const oldBackdrop = document.querySelector('.modal-backdrop');
            if (oldBackdrop) {
                oldBackdrop.remove();
            }
            
            if (resultado) {
                resultado.innerHTML = mensagemErro;
            }
            
            // Adicionar estilo de animação se ainda não existir
            if (!document.getElementById('popup-styles')) {
                const style = document.createElement('style');
                style.id = 'popup-styles';
                style.textContent = `
                    @keyframes slideIn {
                        0% {
                            transform: translate(-50%, -60%);
                            opacity: 0;
                        }
                        100% {
                            transform: translate(-50%, -50%);
                            opacity: 1;
                        }
                    }
                    
                    .alert {
                        backdrop-filter: blur(10px);
                        -webkit-backdrop-filter: blur(10px);
                    }
                    
                    .alert:hover {
                        transform: translate(-50%, -50%) scale(1.02);
                        transition: transform 0.2s ease;
                    }
                `;
                document.head.appendChild(style);
            }
            return;
        }
        
        if (data.erro) {
            const mensagemAviso = `
                <div class="alert alert-warning">
                    <h4 class="alert-heading">Não foi possível encontrar solução</h4>
                    <p>${data.erro}</p>
                    <hr>
                    <p class="mb-0">Tente usar um algoritmo diferente ou verifique a configuração do puzzle.</p>
                </div>`;
            if (resultado) {
                resultado.innerHTML = mensagemAviso;
            }
            return;
        }
        
        // Mostra os resultados apenas se os elementos existirem
        const solucao = document.getElementById('solucao');
        const metricaTempo = document.getElementById('metrica-tempo');
        const metricaEstados = document.getElementById('metrica-estados');
        const divPassos = document.getElementById('passos');
        
        if (solucao) {
            solucao.style.display = 'block';
        }
        
        if (metricaTempo) {
            metricaTempo.textContent = `${data.tempo_execucao.toFixed(3)}s`;
        }
        
        if (metricaEstados) {
            metricaEstados.textContent = data.nos_expandidos;
        }
        
        if (divPassos) {
            divPassos.innerHTML = '';
            
            // Mostrar apenas visualização normal
            data.solucao.forEach((estado, indice) => {
                const passo = document.createElement('div');
                passo.className = 'passo';
                
                const cabecalhoPasso = document.createElement('h3');
                cabecalhoPasso.textContent = `Passo ${indice + 1}`;
                
                passo.appendChild(cabecalhoPasso);
                passo.appendChild(criarGridEstado(estado));
                divPassos.appendChild(passo);
            });
        }
        
        // Adiciona mensagem de sucesso
        if (resultado) {
            resultado.innerHTML = `
                <div class="alert alert-success fade show" role="alert" style="
                    background: linear-gradient(145deg, #28a745, #34ce57);
                    border: none;
                    color: white;
                    box-shadow: 0 4px 15px rgba(40, 167, 69, 0.2);
                    border-radius: 10px;
                    padding: 20px;
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 1000;
                    min-width: 300px;
                    max-width: 400px;
                    animation: slideIn 0.3s ease-out;
                ">
                    <div style="display: flex; align-items: start; justify-content: space-between;">
                        <div>
                            <h4 class="alert-heading" style="
                                font-size: 1.5rem;
                                margin-bottom: 15px;
                                font-weight: 600;
                            ">
                                <i class="fas fa-check-circle" style="margin-right: 10px;"></i>
                                Solução encontrada!
                            </h4>
                        </div>
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" 
                            style="background: none; border: none; color: white; font-size: 1.5rem; padding: 0;"
                            onclick="this.parentElement.parentElement.remove();">
                            &times;
                        </button>
                    </div>
                    <p style="margin-bottom: 15px; font-size: 1.1rem;">
                        O puzzle foi resolvido com sucesso.
                    </p>
                    <hr style="border-top: 1px solid rgba(255,255,255,0.2); margin: 15px 0;">
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-top: 15px;
                    ">
                        <p style="margin: 0;">
                            <i class="fas fa-arrow-down" style="margin-right: 10px;"></i>
                            Confira abaixo os passos da solução.
                        </p>
                      
                    </div>
                </div>
                <div class="modal-backdrop fade show" style="opacity: 0.5;"></div>
            `;

            // Adicionar temporizador para remover o pop-up após 3 segundos
            setTimeout(() => {
                const alert = document.querySelector('.alert');
                const backdrop = document.querySelector('.modal-backdrop');
                if (alert) {
                    alert.style.animation = 'slideOut 0.3s ease-out forwards';
                    setTimeout(() => {
                        if (alert) alert.remove();
                        if (backdrop) backdrop.remove();
                    }, 300);
                }
            }, 3000);

            // Adicionar animação de saída se ainda não existir
            if (!document.getElementById('popup-styles')) {
                const style = document.createElement('style');
                style.id = 'popup-styles';
                style.textContent += `
                    @keyframes slideOut {
                        0% {
                            transform: translate(-50%, -50%);
                            opacity: 1;
                        }
                        100% {
                            transform: translate(-50%, -60%);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        const resultado = document.getElementById('resultado');
        if (resultado) {
            resultado.innerHTML = `
                <div class="alert alert-danger">
                    <h4 class="alert-heading">Erro!</h4>
                    <p>Ocorreu um erro ao processar a solicitação.</p>
                    <hr>
                    <p class="mb-0">Por favor, tente novamente mais tarde.</p>
                </div>`;
        }
    });
}

// Garante que os elementos necessários existam quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    criarGrid('gridInicial', estadoInicial);
    criarGrid('gridFinal', estadoFinal);
    
    // Cria div de resultado se não existir
    if (!document.getElementById('resultado')) {
        const resultado = document.createElement('div');
        resultado.id = 'resultado';
        document.body.appendChild(resultado);
    }
});

// Remover estilos relacionados à animação
const style = document.createElement('style');
style.textContent = `
    .passo {
        margin: 20px 0;
    }
    
    .btn {
        padding: 10px 20px;
        border-radius: 5px;
        border: none;
        color: white;
        cursor: pointer;
        font-weight: 600;
    }
    
    .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }
    
    .btn-primary {
        background: linear-gradient(145deg, #007bff, #0056b3);
    }
    
    .btn-success {
        background: linear-gradient(145deg, #28a745, #218838);
    }
`;
document.head.appendChild(style);

// Funções para drag and drop
let draggedCell = null;

function handleDragStart(event) {
    draggedCell = event.target;
    event.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
}

function handleDrop(event) {
    event.preventDefault();
    const targetCell = event.target;
    
    if (draggedCell && targetCell !== draggedCell && targetCell.classList.contains('celula-puzzle')) {
        // Obter posições das células
        const linha1 = parseInt(draggedCell.dataset.linha);
        const coluna1 = parseInt(draggedCell.dataset.coluna);
        const linha2 = parseInt(targetCell.dataset.linha);
        const coluna2 = parseInt(targetCell.dataset.coluna);
        
        // Determinar qual grid está sendo configurado
        const idGrid = draggedCell.parentElement.id;
        const estado = idGrid === 'gridInicial' ? estadoInicial : estadoFinal;
        
        // Trocar os valores nos estados
        const temp = estado[linha1][coluna1];
        estado[linha1][coluna1] = estado[linha2][coluna2];
        estado[linha2][coluna2] = temp;
        
        // Atualizar a visualização
        criarGrid(idGrid, estado);
    }
}