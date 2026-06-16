# Módulo de Shopping

## Visão Geral
O módulo de shopping é responsável pela geração e gestão de listas de compras. Permite que usuários criem listas de compras manualmente ou as gerem automaticamente a partir de planos semanais, marcem itens como comprados e acompanhem o progresso de suas compras.

Este módulo fecha o ciclo do DishPlan, conectando o planejamento de refeições com a execução prática de adquirir os ingredientes necessários.

## Componentes Principais

### Modelos (`models.py`)
- **ListaCompra**: Representa uma lista de compras vinculada a um plano semanal e opcionalmente a um grupo
  - `criador`: Usuário que criou a lista
  - `grupo`: Grupo ao qual a lista pertence (opcional)
    - Quando NULL: lista pessoal do usuário
    - Quando preenchida: lista vinculada ao grupo
  - `plano_semanal`: Relação um-para-um com o plano semanal que deu origem à lista
  - `data`: Data de criação da lista
  - `created_at`: Timestamp de criação
  - `updated_at`: Timestamp de última atualização
  - Propriedade `progresso_total`: Calcula o percentual de itens comprados na lista
  
- **ItemCompra**: Item individual da lista de compras
  - `lista_compra`: Lista à qual o item pertenece
  - `ingrediente`: Ingrediente da receita (opcional, chave estrangeira para Ingrediente do app recipes)
    - Quando preenchido: item vinculado a um ingrediente do catálogo
    - Quando NULL: item avulso (usando `nome_manual`)
  - `nome_manual`: Nome para itens avulsos (não vinculados a ingrediente)
  - `quantidade`: Quantidade necessária
  - `unidade`: Unidade de medida
  - `comprado`: Flag indicando se o item foi comprado
  - Propriedade `nome_display`: Retorna o nome do ingrediente ou o nome manual para exibição

### Serializadores (`serializers.py`)
- **ItemCompraSerializer**: Serializador para exibir itens de compra
  - Campos: id, lista_compra, ingrediente, ingrediente_nome, ingrediente_categoria, nome_manual, nome_display, quantidade, unidade, comprado
  - Campos calculados: nome_display, ingrediente_nome, ingrediente_categoria
  
- **ItemCompraToggleSerializer**: Serializador mínimo para toggle da flag comprado (otimizado para debounce)
  
- **ListaCompraListSerializer**: Serializador para listagem de listas de compras
  - Campos: id, data, criador_nome, grupo (resumido), plano_semanal, progresso_total, total_itens, updated_at
  
- **ListaCompraDetailSerializer**: Serializador para detalhes de uma lista de compras
  - Campos: id, data, criador_nome, grupo, grupo_detail (detalhes do grupo), plano_semanal, progresso_total, itens (lista detalhada), created_at, updated_at
  - Campos apenas-leitura: id, data, created_at, updated_at, criador_nome

### Views (`views.py`)
- **ListaCompraViewSet**: ViewSet para CRUD de listas de compras
  - `list`: Retorna listas pessoais + listas de grupos do usuário
  - `create`: Cria nova lista (normalmente via ação customizada de geração)
  - `update/destroy`: Apenas o criador ou membro do grupo vinculado pode modificar/excluir
  - Filtros: plano_semanal, grupo
  - Ação customizada:
    - `gerar_a_partir_do_plano` (POST /listas/gerar/): Gera lista automaticamente a partir de um plano semanal
      - Recebe ID do plano semanal no corpo da requisição
      - Verifica acesso ao plano (pessoal ou grupo)
      - Cria ou reutiliza a lista associada ao plano
      - Remove itens gerados automaticamente anteriores (preserva itens manuais)
      - Calcula ingredientes necessários baseado nas refeições do plano
      - Agrega quantidades por ingrediente/unidade
      - Cria os itens de compra em lote
  
- **ItemCompraViewSet**: ViewSet para CRUD de itens de compra
  - `list`: Retorna itens das listas acessíveis ao usuário
  - Filtros: lista_compra, comprado
  - Ação customizada:
    - `toggle_comprado` (PATCH /itens/{id}/toggle/): Alterna a flag comprado de um item
      - Otimizado para atualizar apenas o campo necessário
      - Ideal para uso em interfaces com debounce (ex: checkboxes)

### Services (`services.py`)
- **gerar_lista_compras()**: Função responsável pela geração automática de listas de compras
  - Recebe um objeto PlanoSemanal como parâmetro
  - Busca ou cria a ListaCompra associada ao plano
  - Remove itens gerados anteriormente (preservando itens manuais)
  - Coleta todas as receitas das refeições do plano
  - Busca todos os ingredientes dessas receitas
  - Agrega quantidades por (ingrediente, unidade) - padronizando unidades para evitar duplicação
  - Cria os ItemCompra em lote usando bulk_create para eficiência
  - Retorna a ListaCompra criada/atualizada

### Integração com Permissões
- Utiliza o mixin `IsOwnerOrGroupMember` do app groups para controle de acesso
- Listas pessoais: só o criador pode acessar
- Listas de grupo: qualquer membro do grupo pode acessar
- A geração automática verifica acesso ao plano semanal antes de prosseguir

## Funcionalidades

1. **Geração Automática de Listas de Compras**
   - Baseada em planos semanais existentes
   - Inspeciona todas as refeições do plano
   - Busca os ingredientes de cada receita associada
   - Soma as quantidades por ingrediente e unidade
   - Padroniza unidades para evitar duplicação (ex: "kg" e "Kg")
   - Preserva itens manuais adicionados pelo usuário
   - Remove e regenera apenas itens vinculados a ingredientes

2. **Gerenciamento Manual de Listas**
   - Usuários podem criar listas vazias e adicionar itens manualmente
   - Suporte a itens avulsos (não vinculados ao catálogo de ingredientes)
   - Possibilidade de editar quantidades, unidades e marcar como comprado

3. **Acompanhamento de Progresso**
   - Cálculo automático do percentual de conclusão da lista
   - Ordenação inteligente: itens não comprados primeiro, depois os comprados
   - Indicação visual clara de status (✓ para comprado, ○ para pendente)

4. **Integração com Planejamento**
   - Cada plano semanal pode ter exatamente uma lista de compras associada
   - Relação um-para-um entre PlanoSemanal e ListaCompra
   - Lista herda criador e grupo do plano semanal de origem
   - Regeneração segura: ao gerar novamente, itens manuais são preservados

5. **Colaboração em Grupo**
   - Listas podem ser pessoais ou compartilhadas com grupos
   - Membros do grupo podem visualizar e editar listas compartilhadas
   - Funcionalidade de toggle permite atualização em tempo real em interfaces colaborativas

## Integração com Outros Módulos
- **Apps.users**: Relaciona-se através dos campos `criador` em ListaCompra e ItemCompra (indiretamente via ListaCompra)
- **Apps.groups**: 
  - Relaciona-se através dos campos `grupo` em ListaCompra
  - Utiliza o mixin de permissão `IsOwnerOrGroupMember` para controle de acesso
  - Utiliza `GrupoMembro` para verificar pertencimento a grupos na geração e acesso
- **Apps.recipes**: 
  - Relaciona-se através do campo `ingrediente` em ItemCompra (chave estrangeira para Ingrediente)
  - Utiliza o catálogo global de ingredientes para sugestões e padronização
- **Apps.planning**:
  - Relaciona-se através do campo `plano_semanal` em ListaCompra (relação um-para-um)
  - A geração automática consome dados do PlanoSemanal e suas Refeicao associadas
  - Utiliza o serviço `gerar_lista_compras` para converter planos em listas de compras

## API Endpoints

| Método | Endpoint | Descrição | Permissão Necessária |
|--------|----------|-----------|----------------------|
| GET | `/api/listas/` | Listar listas de compras acessíveis | Autenticado |
| POST | `/api/listas/` | Criar nova lista de compras | Autenticado |
| GET | `/api/listas/{id}/` | Detalhes de uma lista específica | Acesso à lista (pessoal ou grupo) |
| PUT/PATCH | `/api/listas/{id}/` | Atualizar lista | Donos da lista (criador ou dono do grupo) |
| DELETE | `/api/listas/{id}/` | Excluir lista | Donos da lista (criador ou dono do grupo) |
| GET | `/api/itens/` | Listar itens de compra (com filtros) | Acesso às listas relacionadas |
| POST | `/api/itens/` | Criar novo item de compra | Acesso à lista destino |
| GET | `/api/itens/{id}/` | Detalhes de um item específico | Acesso à lista associada |
| PUT/PATCH | `/api/itens/{id}/` | Atualizar item | Acesso à lista associada |
| DELETE | `/api/itens/{id}/` | Excluir item | Acesso à lista associada |
| POST | `/api/listas/gerar/` | Gerar lista a partir de plano semanal | Acesso ao plano semanal |
| PATCH | `/api/itens/{id}/toggle/` | Alternar status comprado de um item | Acesso à lista associada |

**Filtros disponíveis para listas:**
- `plano_semanal`: ID do plano semanal associado
- `grupo`: ID do grupo (null para listas pessoais)

**Filtros disponíveis para itens:**
- `lista_compra`: ID da lista de compras
- `comprado`: true/false para filtrar por status de compra

**Ações customizadas:**
- `POST /api/listas/gerar/`: Gera lista automaticamente a partir de um plano semanal
  - Corpo: `{ "plano_semanal": <id> }`
  - Retorna: ListaCompraDetailSerializer da lista criada/atualizada
  
- `PATCH /api/itens/{id}/toggle/`: Alterna o status comprado de um item
  - Nenhum corpo necessário
  - Retorna: ItemCompraToggleSerializer do item atualizado