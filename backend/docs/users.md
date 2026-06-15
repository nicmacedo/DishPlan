# Módulo de Users

## Visão Geral
O módulo de users é responsável pela autenticação, gerenciamento de usuários e integração com provedores externos de autenticação (como Google OAuth). É baseado no modelo de usuário customizado do Django que estende `AbstractBaseUser` e `PermissionsMixin`.

## Componentes Principais

### Modelos (`models.py`)
- **User**: Modelo customizado de usuário que utiliza email como campo de identificação única (`USERNAME_FIELD = "email"`)
  - Campos:
    - `email`: Email único do usuário (usado como username)
    - `nome`: Nome completo do usuário
    - `data_nascimento`: Data de nascimento (opcional)
    - `google_sub`: ID único do usuário no Google (para OAuth)
    - `is_active`: Status de ativação da conta
    - `is_staff`: Indica se o usuário pode acessar o admin
    - `created_at`: Timestamp de criação
    - `updated_at`: Timestamp de última atualização
  - Relacionamentos herdados do Django:
    - `groups`: Grupos de permissões
    - `user_permissions`: Permissões específicas
  - Managers:
    - `objects`: Instância de `UserManager`

### Gerenciadores (`managers.py`)
- **UserManager**: Gerenciador customizado para o modelo User
  - Métodos:
    - `create_user()`: Cria usuários regulares
    - `create_superuser()`: Cria superusuários com permissões totais
    - `_create_user()`: Método interno auxiliar

### Serializadores (`serializers.py`)
- **UserSerializer**: Serializador para leitura/atualização de dados de usuário
  - Campos: id, email, nome, data_nascimento
  - Campos somente-leitura: id, email
  
- **RegisterSerializer**: Serializador para registro de novos usuários
  - Campos: email, nome, data_nascimento, password
  - Validação de email único
  - Cria automaticamente um objeto `EmailAddress` do allauth após o registro

### Views (`views.py`)
- **CsrfTokenView**: Fornece token CSRF para proteção de formulários
- **RegisterView**: Endpoint para registro de novos usuários (público)
- **GoogleLoginView**: Endpoint para autenticação via Google OAuth
  - Utiliza adapters customizados para compatibilidade entre dj-rest-auth e allauth
  - Inclui uma classe `FixedOAuth2Client` para resolver conflitos de versão

### URLs (`urls.py`)
- `/api/auth/csrf/` - Obter token CSRF
- `/api/auth/register/` - Registro de novos usuários
- `/api/auth/social/google/` - Autenticação via Google OAuth
- `/api/auth/` - Inclui URLs padrão do dj_rest_auth (login, logout, password reset, etc.)

### Admin (`admin.py`)
- **UserAdmin**: Configuração do modelo User no Django Admin
  - Listagem: email, nome, is_staff, is_active, created_at
  - Filtros: is_staff, is_superuser, is_active
  - Campos de busca: email, nome
  - Campos somente-leitura: created_at, updated_at, last_login
  - Fieldsets organizados em: Dados pessoais, Permissões, Datas

### Adapters (`adapters.py`)
- **SocialAccountAdapter**: Adapter customizado para social account (Google OAuth)
  - Preenche automaticamente o campo `nome` do usuário baseado nos dados do perfil do Google
  - Se não houver nome disponível, usa parte do email ou combina first_name/last_name

### Configuração do App (`apps.py`)
- **UsersConfig**: Configuração do aplicativo Django
  - name: "apps.users"
  - label: "users"
  - verbose_name: "Usuarios"

## Configurações Importantes (settings.py)

### Autenticação
- `AUTH_USER_MODEL = "users.User"`: Define o modelo de usuário customizado
- `AUTHENTICATION_BACKENDS`: 
  - ModelBackend padrão do Django
  - AuthenticationBackend do allauth
- `REST_AUTH`: Configuração do dj-rest-auth com JWT
  - Utiliza cookies para armazenamento de tokens
  - Serializer de usuário detalhe: `apps.users.serializers.UserSerializer`
  - Serializer de registro: `apps.users.serializers.RegisterSerializer`

### Contas (allauth)
- `ACCOUNT_EMAIL_REQUIRED = True`: Email é obrigatório
- `ACCOUNT_USERNAME_REQUIRED = False`: Não utiliza username
- `ACCOUNT_AUTHENTICATION_METHOD = "email"`: Autenticação via email
- `ACCOUNT_EMAIL_VERIFICATION = "none"`: Não verifica email por padrão (para desenvolvimento)

### Social Accounts (Google OAuth)
- `SOCIALACCOUNT_ADAPTER = "apps.users.adapters.SocialAccountAdapter"`
- Configuração do provider Google com SCOPE para profile e email

## Funcionalidades

1. **Registro de Usuários**
   - Endpoint público `/api/auth/register/`
   - Validação de email único
   - Criação automática de registro EmailAddress no allauth

2. **Autenticação**
   - Login tradicional via email/senha (dj_rest_auth)
   - Login via Google OAuth (`/api/auth/social/google/`)
   - Refresh de tokens JWT
   - Logout e blacklisting de tokens

3. **Gestão de Sessão**
   - Token CSRF obrigatório para operações que modificam estado
   - Cookies HttpOnly para tokens de refresh (configurável)
   - Controle de sessão via dj-rest-auth

4. **Integração com Admin Django**
   - Interface completa para gerenciamento de usuários
   - Filtros, busca e ordenação por data de criação

5. **Permissões e Grupos**
   - Sistema completo de permissões do Django
   - Suporte a grupos de usuários
   - Campos is_staff e is_superuser para controle de acesso

## Dependências
- Django 5.2+
- djangorestframework 3.16+
- dj-rest-auth 7.0.1
- django-allauth 0.63.3
- djangorestframework-simplejwt 5.3.1
- python-decouple para gestão de variáveis de ambiente

## API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/auth/csrf/` | Obter token CSRF |
| POST | `/api/auth/register/` | Registrar novo usuário |
| POST | `/api/auth/login/` | Login tradicional (dj_rest_auth) |
| POST | `/api/auth/logout/` | Logout (dj_rest_auth) |
| POST | `/api/auth/password/reset/` | Reset de senha (dj_rest_auth) |
| POST | `/api/auth/social/google/` | Login via Google OAuth |
| GET/PUT/PATCH | `/api/auth/user/` | Detalhes/atualização do usuário logado (dj_rest_auth) |
| POST | `/api/auth/password/change/` | Alteração de senha (dj_rest_auth) |

## Segurança
- Senhas armazenadas usando hash seguro do Django
- Proteção CSRF para todos os endpoints que modificam estado
- Validação de entrada em todos os serializadores
- Tokens JWT com expiração curta (15 minutos) e refresh tokens (7 dias)
- Blacklist de tokens após refresh para prevenção de replay
- Configuração segura de cookies (HttpOnly, SameSite, Secure em produção)

## Observações
- O modelo de usuário não utiliza username, relying exclusivamente em email para autenticação
- Integração plena com django-allauth para suporte a múltiplos provedores de autenticação social
- O campo `google_sub` permite vincular contas do Google OAuth manter identificação única
- Timestamps automáticos para rastreamento de criação e atualização
- Ordenação padrão por data de criação (mais recentes primeiro)