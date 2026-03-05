# DishPlan Backend

Backend da aplicação DishPlan desenvolvido com DRF e PostgreSQL

## Pré-requisitos

- Python 
- PostgreSQL 
- Git

## Estrutura do Projeto

``` text
backend/
├── dishplan/ 
│ ├── settings.py
│ ├── urls.py
│ ├── wsgi.py
│ └── asgi.py
│
├── apps/
│ ├── users/ # Autenticação e gerenciamento de usuários
│ ├── recipes/ # Receitas, ingredientes e relacionamentos
│ ├── weekly_plans/ # Planejamento semanal e refeições
│ └── shopping_lists/ # Listas de compras
│
├── docs/
│ └── database/
│ └── diagrama_der.png
│
├── manage.py
├── requirements.txt
├── .env.example
└── .gitignore
```

## Instalação 

### 1. Clone o repositório

```bash
    git clone [text](https://github.com/nicmacedo/DishPlan.git)
    cd backend
```

### 2. Crie e ative o ambiente virtual

**Windows**

```bash
    python -m venv venv
    venv\Scripts\activate
```

## 3. Configure o arquivo .env

Crie um arquivo `.env` na raiz do projeto:

``` env 
# Django
DEBUG=True
SECRET_KEY=sua-chave-secreta-aqui
ALLOWED_HOSTS=localhost,127.0.0.1

# PostgreSQL
DB_ENGINE=django.db.backends.postgresql
DB_NAME=dishplan_db
DB_USER=postgres
DB_PASSWORD=sua-senha-postgres
DB_HOST=localhost
DB_PORT=5432

```

**Nota:** para gerar uma `SECRET_KEY` segure, execute no Python:

``` python
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

### 4. Instale as dependências

```bash
pip install -r requirements.txt
```

### 5. Configure o PostgreSQL

Abra o PostgreSQL e crie um banco de dados

### 6. Execute as migrações

``` bash
     python manage.py migrate
```

### 7. Inicie o servidor

``` bash
     python manage.py runserver
```

A API estará disponível em `http://localhost:8000/`

