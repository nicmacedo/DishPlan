# Módulo de Recipes

## Visão Geral
O módulo de recipes é responsável pelo gerenciamento de receitas culinárias, incluindo ingredientes, modos de preparo e compartilhamento. Permite que usuários criem, vinculem ingredientes, compartilhem receitas com grupos e mantenham um repositório pessoal ou colaborativo de receitas.

Este módulo é o coração do DishPlan, pois fornece o conteúdo que alimenta os planos semanais e listas de compras.

## Componentes Principais

### Modelos (`models.py`)
- **Ingrediente**: Catálogo global de ingredientes com categorias para filtragem
  - `nome`: Nome do ingrediente (único)
  - `categoria`: Categoria do ingrediente (carnes, hortifruti, laticínios, grãos e cereais, temperos, bebidas, padaria, enlatados, congelados, doces, outros)
  
- **Receita**: Receita criada por um usuário, opcionalmente vinculada a um grupo
  - `criador`: Usuário que criou a receita
  - `grupo`: Grupo ao qual a receita pertence (opcional)
    - Quando NULL: receita pessoal do usuário
    - Quando preenchida: receita vinculada ao grupo
  - `titulo`: Nome da receita
  - `descricao`: Descrição da receita
  - `modo_preparo`: Instruções de preparo
  - `dificuldade`: Nível de dificuldade (fácil, médio, difícil)
  - `tempo_preparo`: Tempo de preparo em minutos
  - `porcoes`: Número de porções que a rende
  - `imagem`: Imagem da receita armazenada como data URI base64 (máximo 5 MB antes da codificação)
  - `is_publica`: Indica se a receita é pública (visível para todos os usuários)
  - `created_at`: Timestamp de criação
  - `updated_at`: Timestamp de última atualização
  - Relacionamento many-to-many com Ingrediente através do modelo `IngredienteReceita`
  
- **IngredienteReceita**: Tabela intermediária que liga ingredientes a receitas com quantidade e unidade
  - `receita`: Receita à qual o ingrediente pertenece
  - `ingrediente`: Ingrediente utilizado
  - `quantidade`: Quantidade necessária (float)
  - `unidade`: Unidade de medida (ex: xícara, grama, unidade, colher de sopa)
  - Constraint única: Não pode haver duplicação de ingrediente na mesma receita
  
- **CompartilhamentoReceita**: Permite compartilhar uma receita pessoal com um grupo específico
  - `receita`: Receita sendo compartilhada
  - `grupo`: Grupo com o qual a receita está sendo compartilhada
  - `data_compartilhamento`: Timestamp do compartilhamento
  - Constraint única: Uma receita só pode ser compartilhada uma vez com o mesmo grupo

### Serializadores (`serializers.py`)
- **IngredienteSerializer**: Serializador simples para ingredientes (id, nome, categoria)
- **IngredienteReceitaSerializer**: Serializador para exibir ingredientes de uma receita (inclui nome e categoria do ingrediente)
- **IngredienteReceitaWriteSerializer**: Serializador para escrita de ingredientes (sem campos de leitura anexados)
- **ReceitaListSerializer**: Serializador leve para listagem de receitas
  - Campos: id, titulo, descricao, dificuldade, tempo_preparo, porcoes, criador_nome, grupo (resumido), total_ingredientes, has_imagem, is_publica, created_at
- **ReceitaDetailSerializer**: Serializador completo para detalhe/criação/edicao de receitas
  - Campos de leitura: id, titulo, descricao, modo_preparo, dificuldade, tempo_preparo, porcoes, criador_nome, grupo, grupo_detail (detalhes do grupo), ingredientes_receita (lista detalhada), imagem (data URI base64), is_publica, created_at, updated_at
  - Campos de escrita: imagem_upload (arquivo de imagem que é convertido para base64), ingredientes_data (lista de ingredientes para criar/atualizar)
  - Validação: Verifica se o usuário é membro do grupo ao atribuir um grupo à receita
  - Métodos create/update: Lida com a criação/atualização de ingredientes associados
- **CompartilhamentoReceitaSerializer**: Serializador para compartilhamentos de receita
  - Campos: id, receita, receita_titulo, grupo, grupo_nome, data_compartilhamento
  - Validação: Apenas o criador da receita pode compartilhá-la; o usuário deve ser membro do grupo destino

### Views (`views.py`)
- **IngredienteViewSet**: ViewSet para CRUD de ingredientes
  - Qualquer usuário autenticado pode listar e criar ingredientes
  - Apenas administrators podem excluir ingredientes (proteção do catálogo global)
  - Busca por nome, filtragem por categoria
  
- **ReceitaViewSet**: ViewSet para CRUD de receitas
  - `list`: Retorna receitas pessoais + receitas de grupos do usuário + receitas compartilhadas com grupos do usuário + receitas públicas (seed)
  - `create`: Atribui automaticamente o usuário autenticado como criador
  - `update/destroy`: Apenas o criador ou membro do grupo vinculado pode modificar/excluir
  - Filtros: dificuldade, grupo
  - Busca: titulo, descricao
  
- **CompartilhamentoReceitaViewSet**: ViewSet para CRUD de compartilhamentos de receita
  - Apenas o criador da receita pode criar/remover compartilhamentos
  - Listagem: apenas compartilhamentos onde o usuário é criador da receita
  - Validação na remoção: impede que não-criadores removam compartilhamentos

### Integração com Permissões
- Utiliza o mixin `IsOwnerOrGroupMember` do app groups para controle de acesso em receitas
- Receitas pessoais: só o criador pode acessar (exceto se tornadas públicas)
- Receitas de grupo: qualquer membro do grupo pode acessar
- Receitas compartilhadas: membros do grupo destino podem acessar
- Receitas públicas: qualquer usuário autenticado pode acessar (do seed inicial)

## Funcionalidades

1. **Gerenciamento de Ingredientes**
   - Catálogo global de ingredientes com categorização
   - Busca por nome e filtragem por categoria
   - Proteção contra exclusão arbitrária (apenas admins)

2. **Criação e Edição de Receitas**
   - Usuários podem criar receitas pessoais ou vinculadas a grupos
   - Suporte a instruções detalhadas de preparo
   - Marcação de dificuldade, tempo de preparo e número de porções
   - Upload de imagens (convertidas automaticamente para base64 para armazenamento no banco)
   - Associação flexível de ingredientes com quantidades e unidades
   - Validação de pertencimento ao grupo ao atribuir uma receita a um grupo

3. **Compartilhamento de Receitas**
   - Criadores de receitas podem compartilhá-las com grupos dos quais são membros
   - Membros do grupo destino podem visualizar e usar a receita compartilhada
   - Sistema evita compartilhamento duplicado da mesma receita com o mesmo grupo
   - Apenas o criador pode remover compartilhamentos

4. **Descoberta de Receitas**
   - Receitas pessoais do usuário
   - Receitas de grupos dos quais o usuário é membro
   - Receitas compartilhadas com grupos do usuário
   - Receitas públicas do seed inicial (disponíveis para todos)

5. **Integração com Planejamento**
   - Receitas podem ser associadas aos planos semanais através do módulo planning
   - Sistema de filtragem e busca para facilitar a seleção em planos

## Integração com Outros Módulos
- **Apps.users**: Relaciona-se através dos campos `criador` e validação de acesso
- **Apps.groups**: 
  - Relaciona-se através dos campos `grupo` em Receita e CompartilhamentoReceita
  - Utiliza o mixin de permissão `IsOwnerOrGroupMember` para controle de acesso
  - Utiliza `GrupoMembro` para verificar pertencimento a grupos
- **Apps.planning**: Relaciona-se através da model `Refeicao` que tem chave estrangeira para `Receita`

## API Endpoints

| Método | Endpoint | Descrição | Permissão Necessária |
|--------|----------|-----------|----------------------|
| GET | `/api/ingredientes/` | Listar ingredientes | Autenticado |
| POST | `/api/ingredientes/` | Criar novo ingrediente | Autenticado |
| GET | `/api/ingredientes/{id}/` | Detalhes de um ingrediente | Autenticado |
| PUT/PATCH | `/api/ingredientes/{id}/` | Atualizar ingrediente | Autenticado |
| DELETE | `/api/ingredientes/{id}/` | Excluir ingrediente | Apenas administrators |
| GET | `/api/receitas/` | Listar receitas acessíveis | Autenticado |
| POST | `/api/receitas/` | Criar nova receita | Autenticado |
| GET | `/api/receitas/{id}/` | Detalhes de uma receita | Acesso à receita (ver regras abaixo) |
| PUT/PATCH | `/api/receitas/{id}/` | Atualizar receita | Criador ou membro do grupo vinculado |
| DELETE | `/api/receitas/{id}/` | Excluir receita | Criador ou membro do grupo vinculado |
| GET | `/api/compartilhamentos/` | Listar compartilhamentos onde o usuário é criador | Autenticado |
| POST | `/api/compartilhamentos/` | Compartilhar receita com grupo | Criador da receita + membro do grupo destino |
| GET | `/api/compartilhamentos/{id}/` | Detalhes de um compartilhamento | Criador da receita |
| DELETE | `/api/compartilhamentos/{id}/` | Remover compartilhamento | Apenas criador da receita |

**Filtros disponíveis para receitas:**
- `dificuldade`: facil, medio, dificil
- `grupo`: ID do grupo (null para receitas pessoais)

**Busca disponível para receitas:**
- `search`: Busca em titulo e descricao

**Regras de acesso para receitas:**
Uma receita é acessível se:
1. O usuário for o criador da receita
2. O receita estiver vinculada a um grupo do qual o usuário seja membro
3. A receita estiver compartilhada com um grupo do qual o usuário seja membro
4. A receita for marqueada como pública (is_publica = True)

**Upload de Imagens:**
- Endpoints que aceitam upload de imagem: POST/PATCH `/api/receitas/{id}/` com campo `imagem_upload`
- Imagens são automaticamente convertidas para data URI base64 para armazenamento
- Tamanho máximo: 5 MB antes da codificação base64
- Formatos suportados: Qualquer formato suportado pela Pillow (JPEG, PNG, GIF, etc.)