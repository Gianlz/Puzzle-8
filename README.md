# Implementação do PUZZLE-8

![Captura de tela 2024-11-05 143429](https://github.com/user-attachments/assets/a56d29c6-954f-454b-b6f1-bfd72b51794f)


# 🧩 Puzzle-8

O **Puzzle-8** é um clássico jogo de tabuleiro deslizante cujo objetivo é organizar os blocos de 1 a 8 na ordem correta, movendo-os dentro de um espaço limitado.

---

## 📖 Descrição

Essa implementação do Puzzle-8 foi sugerida durante a disciplina de Inteligência Artificial no Instituto Federal Catarinense, Campus Rio do Sul, incentivada pelo professor Juliano T. Brignoli.

Para resolver o problema, foram utilizadas duas abordagens:

1. **Busca Horizontal**
2. **Busca A***

---

## ⚙️ Algoritmos

### 🌐 1. Busca Horizontal

A Busca Horizontal faz-se a busca em níveis horizontais (da esquerda para a direita) a após a verificação de todos os nós de um mesmo nível muda-se para o seguinte.

![Captura de tela de 2024-11-04 16-26-56](https://github.com/user-attachments/assets/59ced491-1ad2-4a78-8eb1-058b9d417f50)


### ✨ 2. A* (A-Estrela)

O algoritmo A* utiliza uma função heurística para decidir quais nós expandir. Ele combina o custo acumulado de alcançar um nó com uma estimativa da distância (usando a distância de manhattan adaptada) até o objetivo, balanceando eficiência e precisão.

![Captura de tela de 2024-11-04 16-30-34](https://github.com/user-attachments/assets/acc74701-54d9-407c-bf43-9771aa73291a)

## ✏️ Exemplos de utilização

Em ambos os algoritmos foi utilizando os seguintes tabuleiros como estado inicial e final:

![Captura de tela de 2024-11-05 15-28-42](https://github.com/user-attachments/assets/b7d5b7d0-0da7-41c5-b475-b08ea94f3128)

## 💡 Soluções 

### 🌐 Busca Horizontal

![Captura de tela de 2024-11-05 15-33-24](https://github.com/user-attachments/assets/10cec7a0-7668-4ea1-a69a-79901ea3f304)

### ✨ A* (A-Estrela)

![Captura de tela de 2024-11-05 15-44-17](https://github.com/user-attachments/assets/929054dc-537c-4221-a447-34153af85e98)

Além disso também é mostrado todos os passos que foram necessário para resolver o puzzle

![Captura de tela de 2024-11-05 15-45-32](https://github.com/user-attachments/assets/4cd35ac7-ed15-436e-80c7-8ffd7a6c4937)

... 

![Captura de tela de 2024-11-05 15-46-49](https://github.com/user-attachments/assets/bb716bfe-5404-4993-b4fc-a1ceced05905)

---

## 🖥️ Como Utilizar a Aplicação

### ⚡ Requisitos

> Ter o [Python3](https://www.python.org/) instalado

 ### Instalação no Windows e Linux

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/Gianlz/Puzzle-8.git
2. **Instale o fastAPI**:
   ```bash
   pip install fastapi[standard]
   pip install uvicorn
   pip install pydantic

3. **Execute o projeto**:
   ```bash
   fastapi dev main.py ou python3 main.py

Para utilizar a interface web acesse: http://127.0.0.1:8000/
