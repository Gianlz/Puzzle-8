from collections import deque
import time
import heapq

class Puzzle8:
    def __init__(self, estado_inicial, estado_final):
        self.estado_inicial = estado_inicial
        self.estado_final = estado_final
        self.movimentos = [(0, 1), (1, 0), (0, -1), (-1, 0)]  # direita, baixo, esquerda, cima
    
    def obter_posicao_vazia(self, estado):
        """Encontra a posição do espaço vazio (0) no tabuleiro."""
        for i in range(3):
            for j in range(3):
                if estado[i][j] == 0:
                    return i, j
        return None
    
    def movimento_valido(self, x, y):
        """Verifica se uma posição está dentro dos limites do tabuleiro."""
        return 0 <= x < 3 and 0 <= y < 3
    
    def calcular_distancia_manhattan(self, estado):
        """Calcula a distância de Manhattan total para o estado atual."""
        distancia = 0
        for i in range(3):
            for j in range(3):
                if estado[i][j] != 0:
                    valor = estado[i][j]
                    pos_final = self.obter_posicao_valor(self.estado_final, valor)
                    # Calcula a distância de Manhattan como número de movimentos necessários
                    movimentos_x = abs(i - pos_final[0])
                    movimentos_y = abs(j - pos_final[1])
                    # Soma total de movimentos horizontais e verticais necessários
                    distancia += movimentos_x + movimentos_y
                    # Adiciona movimentos extras necessários para desviar de outras peças
                    if movimentos_x > 0 and movimentos_y > 0:
                        distancia += 2  # Penalidade para movimentos diagonais que precisam ser decompostos
        return distancia
    
    def contar_pecas_fora_lugar(self, estado):
        """Conta o número de peças que não estão em sua posição final."""
        contador = 0
        for i in range(3):
            for j in range(3):
                if estado[i][j] != 0 and estado[i][j] != self.estado_final[i][j]:
                    contador += 1
        return contador
    
    def obter_posicao_valor(self, estado, valor):
        """Encontra a posição de um valor específico no tabuleiro."""
        for i in range(3):
            for j in range(3):
                if estado[i][j] == valor:
                    return (i, j)
        return None
    
    def gerar_proximos_estados(self, estado):
        """Gera todos os estados possíveis a partir do estado atual."""
        pos_x, pos_y = self.obter_posicao_vazia(estado)
        proximos_estados = []
        
        for dx, dy in self.movimentos:
            novo_x, novo_y = pos_x + dx, pos_y + dy
            
            if self.movimento_valido(novo_x, novo_y):
                novo_estado = [linha[:] for linha in estado]
                novo_estado[pos_x][pos_y], novo_estado[novo_x][novo_y] = \
                    novo_estado[novo_x][novo_y], novo_estado[pos_x][pos_y]
                proximos_estados.append(novo_estado)
        
        return proximos_estados
    
    def contar_inversoes(self, estado):
        """Conta o número de inversões em um estado do puzzle."""
        # Converte a matriz 2D em uma lista 1D, ignorando o espaço vazio (0)
        lista_plana = [num for linha in estado for num in linha if num != 0]
        inversoes = 0
        
        for i in range(len(lista_plana)):
            for j in range(i + 1, len(lista_plana)):
                if lista_plana[i] > lista_plana[j]:
                    inversoes += 1
        return inversoes
    
    def eh_solucionavel(self):
        """Verifica se o puzzle tem solução comparando a paridade das inversões."""
        inversoes_inicial = self.contar_inversoes(self.estado_inicial)
        inversoes_final = self.contar_inversoes(self.estado_final)
        
        # Em um puzzle 8, se a diferença entre o número de inversões
        # do estado inicial e final for ímpar, não há solução
        return (inversoes_inicial % 2) == (inversoes_final % 2)
    
    def resolver_busca_largura(self):
        """Implementa a busca em largura (BFS) para resolver o puzzle."""
        if not self.eh_solucionavel():
            return None, 0, 0, False  # Adicionado False para indicar impossibilidade
            
        tempo_inicial = time.perf_counter()
        fila = deque([(self.estado_inicial, [])])
        visitados = set()
        nos_expandidos = 0
        
        while fila:
            estado_atual, caminho = fila.popleft()
            estado_tupla = tuple(map(tuple, estado_atual))
            
            if estado_atual == self.estado_final:
                tempo_final = time.perf_counter()
                return caminho + [estado_atual], tempo_final - tempo_inicial, nos_expandidos, True
            
            if estado_tupla in visitados:
                continue
                
            visitados.add(estado_tupla)
            nos_expandidos += 1
            
            for proximo_estado in self.gerar_proximos_estados(estado_atual):
                fila.append((proximo_estado, caminho + [estado_atual]))
        
        return None, time.perf_counter() - tempo_inicial, nos_expandidos, False
    
    def resolver_busca_a_estrela(self):
        """Implementa a busca A* para resolver o puzzle."""
        if not self.eh_solucionavel():
            return None, 0, 0, False  # Adicionado False para indicar impossibilidade
            
        tempo_inicial = time.perf_counter()
        heap = [(0, 0, self.estado_inicial, [])]  # (f(x), g(x), estado, caminho)
        visitados = set()
        nos_expandidos = 0
        
        while heap:
            _, custo_g, estado_atual, caminho = heapq.heappop(heap)
            estado_tupla = tuple(map(tuple, estado_atual))
            
            if estado_atual == self.estado_final:
                tempo_final = time.perf_counter()
                return caminho + [estado_atual], tempo_final - tempo_inicial, nos_expandidos, True
            
            if estado_tupla in visitados:
                continue
                
            visitados.add(estado_tupla)
            nos_expandidos += 1
            
            for proximo_estado in self.gerar_proximos_estados(estado_atual):
                if tuple(map(tuple, proximo_estado)) not in visitados:
                    g = custo_g + 1
                    h = self.calcular_distancia_manhattan(proximo_estado) + \
                        self.contar_pecas_fora_lugar(proximo_estado)
                    f = g + h
                    heapq.heappush(heap, (f, g, proximo_estado, caminho + [estado_atual]))
        
        return None, time.perf_counter() - tempo_inicial, nos_expandidos, False
