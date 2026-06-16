# Módulo de Groups

## Visão Geral
O módulo de groups é responsável pelo gerenciamento de grupos (famílias ou communities de amigos) e seus membros. Permite que usuários criem grupos, convidem outros usuários para participar e definam papéis dentro do grupo (dono ou membro).

Este módulo é fundamental para o funcionamento dos outros módulos do DishPlan, pois muitos recursos (receitas, planejamentos, listas de compras) podem ser compartilhados dentro de um grupo.

## Componentes Principais

### Modelos (`models.py`)
- **Grupo**: Representa um grupo de usuários
  - `nome`: Nome do grupo (máximo 150 caracteres)
  - `created_at`: Timestamp de criação do grupo
  
- **GrupoMembro**: Associação entre usuários e grupos com definção de papel
  - `usuario`: Chave estrangeira para o modelo User (do app users)
  - `grupo`: Chave estrangeira para o modelo Grupo
  - `papel`: Papel do usuário no grupo (DONO ou MEMBRO)
    - DONO: Usuário que criou o grupo, tem privilégios completos
    - MEMBRO: Usuário comum do grupo
  - `created_at`: Timestamp quando o usuário foi adicionado ao grupo
  - Restrição única: Um usuário pode pertencer a um grupo apenas uma vez

### Serializadores (`serializers.py`)
- **GrupoSerializer**: Serializador para operações CRUD em grupos
  - Campos: id, nome, created_at, membros (lista), meu_papel
  - `membros`: Lista de membros do grupo com detalhes (usando GrupoMembroSerializer)
  - `meu_papel`: Campo calculado que retorna o papel do usuário atual no grupo
  
- **GrupoMembroSerializer**: Serializador para exibir membros de um grupo
  - Campos: id, email (do usuario), nome (do usuario), papel, created_at
  
- **AdicionarMembroSerializer**: Serializador para convidar novos membros por email
  - Campo: email (do usuário a ser convidado)
  - Validação: Verifica se o email corresponde a um usuário existente

### Views (`views.py`)
- **GrupoViewSet**: ViewSet que implements todas as operações CRUD para grupos
  - `list`: Retorna apenas os grupos dos quais o usuário autenticado é membro
  - `create`: Cria um novo grupo e adiciona o usuário criador como dono
  - `retrieve`: Retorna detalhes de um grupo específico (requer ser membro)
  - `update/partial_update`: Atualiza um grupo (requer ser dono)
  - `destroy`: Exclui um grupo (requer ser dono)
  
  Ações customizadas:
  - `adicionar_membro` (POST /grupos/{id}/membros/): Adiciona um membro ao grupo (apenas donos)
  - `remover_membro` (DELETE /grupos/{id}/membros/{membro_id}/): Remove um membro do grupo
    - Donos podem remover qualquer membro
    - Membros podem se remover do próprio grupo
    - Nenhum pode remover o dono (é necessário excluir o grupo)

### Permissões (`permissions.py`)
- **IsGroupMember**: Permite acesso apenas a membros do grupo
- **IsGroupOwner**: Permite acesso apenas ao dono do grupo
- **IsGroupMemberOrReadOnly**: Permite leitura a membros, escrita apenas a donos
- **IsOwnerOrGroupMember**: Mixin usado em outros módulos para objetos que podem ser pessoais ou de grupo

### URLs (`urls.py`)
- Utiliza DefaultRouter do DRF para gerar automaticamente as URLs padrão
- Endpoint principal: `/api/grupos/` (prefixado com `/api/` na URL principal do projeto)

## Funcionalidades

1. **Criação de Grupos**
   - Usuário autenticado pode criar um novo grupo
   - Ao criar, o usuário é automaticamente adicionado como dono do grupo

2. **Listagem de Grupos**
   - Usuário vê apenas os grupos dos quais é membro
   - Informações básicas do grupo e lista de membros

3. **Gerenciamento de Membros**
   - Donos podem adicionar novos membros por email
   - Donos podem remover qualquer membro do grupo
   - Membros podem se remover do grupo voluntariamente
   - Proteção contra remoção do dono (necessário excluir o grupo inteiro)

4. **Controle de Acesso**
   - Sistema robusto de permissões baseado em papéis (dono/membro)
   - Integração com outros módulos através do mixin `IsOwnerOrGroupMember`
   - Proteção de endpoints com verificações de pertencimento ao grupo

## Integração com Outros Módulos
O módulo de groups é utilizado por outros módulos através:
- Chave estrangeira `grupo` nos modelos de outros apps
- Mixin de permissão `IsOwnerOrGroupMember` para controle de acesso
- Funcionalidade de compartilhamento de recursos (receitas, planejamentos, listas) dentro de grupos

## API Endpoints

| Método | Endpoint | Descrição | Permissão Necessária |
|--------|----------|-----------|----------------------|
| GET | `/api/grupos/` | Listar grupos do usuário autenticado | Autenticado |
| POST | `/api/grupos/` | Criar novo grupo | Autenticado |
| GET | `/api/grupos/{id}/` | Detalhes de um grupo específico | Membro do grupo |
| PUT/PATCH | `/api/grupos/{id}/` | Atualizar grupo | Donos do grupo |
| DELETE | `/api/grupos/{id}/` | Excluir grupo | Donos do grupo |
| POST | `/api/grupos/{id}/membros/` | Adicionar membro ao grupo | Donos do grupo |
| DELETE | `/api/grupos/{id}/membros/{membro_id}/` | Remover membro do grupo | Donos ou o próprio membro |

## Relacionamentos
- Faz referência ao modelo User (app users) através de chave estrangeira
- É referência para os modelos de outros apps (recipes, planning, shopping) através de chave estrangeira `grupo`
- Utilizado pelo mixin de permissão `IsOwnerOrGroupMember` em múltiplos módulos