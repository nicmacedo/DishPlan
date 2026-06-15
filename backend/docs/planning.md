# Módulo de Planning

## Visão Geral
O módulo de planning é responsável pelo planejamento semanal de refeições. Permite que usuários criem planos semanais pessoais ou compartilhados com grupos, e associem receitas a específicos dias da semana e tipos de refeição (café da manhã, almoço, lanche, jantar, ceia).

Este módulo é central para a proposta do DishPlan, pois permite organizar a alimentação semanal de forma colaborativa dentro de grupos familiares ou de amigos.

## Componentes Principais

### Modelos (`models.py`)
- **PlanoSemanal**: Representa um plano de refeições para uma semana específica
  - `criador`: Usuário que criou o plano (chave estrangeira para User)
  - `grupo`: Grupo ao qual o plano pertence (opcional, chave estrangeira para Grupo)
    - Quando NULL: plano pessoal do usuário
    - Quando preenchido: plano compartilhado com o grupo
  - `semana_referencia`: Data da segunda-feira da semana que o plano referencia
  - `created_at`: Timestamp de criação
  - `updated_at`: Timestamp de última atualização
  - Constraints de unicidade:
    - Um usuário pode ter apenas um plano pessoal por semana de referência
    - Um grupo pode ter apenas um plano por semana de referência
  
- **Refeicao**: Associação entre um plano semanal, uma receita, um dia da semana e um tipo de refeição
  - `plano_semanal`: Plano ao qual a refeição pertenece
  - `receita`: Receita a ser preparada (chave estrangeira para Receita do app recipes)
  - `dia_da_semana`: Dia da semana (segunda-feira a domingo)
  - `tipo_refeicao`: Tipo de refeição (café da manhã, almoço, lanche, jantar, ceia)
  - Constraint de unicidade: Não pode haver duas refeições iguais (mesmo plano, mesmo dia, mesmo tipo, mesma receita)

### Serializadores (`serializers.py`)
- **RefeicaoSerializer**: Serializador para exibir refeições
  - Campos: id, plano_semanal, receita, receita_detail (detalhes da receita), dia_da_semana, tipo_refeicao
  - Inclui validação para verificar se o usuário tem acesso ao plano
  
- **RefeicaoWriteSerializer**: Serializador simplificado para criação inline de refeições
  
- **PlanoSemanalListSerializer**: Serializador para listagem de planos
  - Campos: id, semana_referencia, criador_nome, grupo (resumido), total_refeicoes, updated_at
  
- **PlanoSemanalDetailSerializer**: Serializador para detalhes de um plano
  - Campos: id, semana_referencia, criador_nome, grupo, grupo_detail (detalhes do grupo), refeicoes (lista detalhada), created_at, updated_at
  - Inclui validação para verificar se o usuário é membro do grupo ao atribuir um grupo ao plano

### Views (`views.py`)
- **PlanoSemanalViewSet**: ViewSet para CRUD de planos semanais
  - `list`: Retorna planos pessoais do usuário + planos de grupos dos quais o usuário é membro
  - `create`: Cria novo plano atribuindo o usuário autenticado como criador
  - Filtros disponíveis: semana_referencia, grupo
  - Ordenação disponível: semana_referencia, updated_at
  
- **RefeicaoViewSet**: ViewSet para CRUD de refeições
  - Filtros disponíveis: plano_semanal, dia_da_semana, tipo_refeicao
  - Validação automática de acesso ao plano ao criar/atualizar refeições

### Integração com Permissões
- Utiliza o mixin `IsOwnerOrGroupMember` do app groups para controle de acesso
- Planos pessoais: só o criador pode acessar
- Planos de grupo: qualquer membro do grupo pode acessar (conforme definição em `IsOwnerOrGroupMember`)

## Funcionalidades

1. **Criação de Planos Semanais**
   - Usuário pode criar planos pessoais (sem grupo atribuído)
   - Usuário pode criar planos para grupos dos quais é membro
   - Validação para evitar duplicação de plano pessoal/grupo para a mesma semana

2. **Visualização de Planos**
   - Listagem de todos os planos acessíveis ao usuário (pessoais + de grupos)
   - Detalhes completos do plano com todas as refeições associadas
   - Informações resumidas em listagens (criador, grupo, total de refeições)

3. **Gerenciamento de Refeições**
   - Associação de receitas a dias específicos da semana e tipos de refeição
   - Prevenção de duplicação de refeições no mesmo slot (dia/tipo)
   - Filtragem por plano, dia da semana e tipo de refeição
   - Validação de acesso ao plano antes de permitir modificações

4. **Compartilhamento Colaborativo**
   - Planos podem ser compartilhados com grupos inteiros
   - Qualquer membro do grupo pode ver e editar o plano compartilhado
   - Mantém privacidade para planos pessoais

## Integração com Outros Módulos
- **Apps.users**: Relaciona-se através do campo `criador` (chave estrangeira para User)
- **Apps.groups**: Relaciona-se através do campo `grupo` (chave estrangeira para Grupo) e utiliza o mixin de permissão `IsOwnerOrGroupMember`
- **Apps.recipes**: Relaciona-se através da model `Refeicao` que tem chave estrangeira para `Receita`

## API Endpoints

| Método | Endpoint | Descrição | Permissão Necessária |
|--------|----------|-----------|----------------------|
| GET | `/api/planos/` | Listar planos semanais acessíveis | Autenticado |
| POST | `/api/planos/` | Criar novo plano semanal | Autenticado |
| GET | `/api/planos/{id}/` | Detalhes de um plano específico | Acesso ao plano (pessoal ou grupo) |
| PUT/PATCH | `/api/planos/{id}/` | Atualizar plano | Donos do plano (criador ou dono do grupo) |
| DELETE | `/api/planos/{id}/` | Excluir plano | Donos do plano (criador ou dono do grupo) |
| GET | `/api/refeicoes/` | Listar refeições (com filtros) | Acesso aos planos relacionados |
| POST | `/api/refeicoes/` | Criar nova refeição | Acesso ao plano destino |
| GET | `/api/refeicoes/{id}/` | Detalhes de uma refeição | Acesso ao plano associado |
| PUT/PATCH | `/api/refeicoes/{id}/` | Atualizar refeição | Acesso ao plano associado |
| DELETE | `/api/refeicoes/{id}/` | Excluir refeição | Acesso ao plano associado |

**Filtros disponíveis para refeições:**
- `plano_semanal`: ID do plano
- `dia_da_semana`: segundo, terca, quarta, quinta, sexta, sabado, domingo
- `tipo_refeicao`: cafe, almoco, lanche, jantar, ceia

**Filtros disponíveis para planos:**
- `semana_referencia`: Data (YYYY-MM-DD)
- `grupo`: ID do grupo (null para planos pessoais)