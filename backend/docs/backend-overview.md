# Visão Geral do Backend DishPlan

## Descrição Geral
O backend do DishPlan é uma API RESTful desenvolvida com Django e Django REST Framework (DRF) que fornece toda a lógica de negócio e gerenciamento de dados para a aplicação DishPlan - um sistema de planejamento de refeições, gerenciamento de receitas e listas de compras colaborativo.

O sistema segue uma arquitetura modular com aplicativos Django bem definidos, cada um responsável por um domínio específico de funcionalidade, promovendo coesão e baixo acoplamento entre os componentes.

## Tecnologias Utilizadas
- **Django 5.2.12**: Framework web principal
- **Django REST Framework 3.16.1**: Para construção da API REST
- **djangorestframework-simplejwt 5.3.1**: Autenticação JWT com suporte a refresh tokens
- **django-allauth 0.63.3**: Autenticação, registro e contas sociais (Google OAuth)
- **dj-rest-auth 7.0.1**: Integração entre DRF e allauth para endpoints de autenticação
- **PostgreSQL**: Banco de dados relacional (via psycopg[binary])
- **Python-decouple**: Gestão de variáveis de ambiente
- **django-cors-headers**: Suporte a CORS para frontend
- **django-filter**: Filtragem avançada em listas
- **drf-spectacular 0.28.0**: Geração automática de documentação OpenAPI/Swagger
- **Pillow 11.0.0**: Processamento de imagens
- **Gunicorn 23.0.0**: Servidor WSGI para produção
- **Whitenoise 6.8.2**: Servir arquivos estáticos em produção

## Estrutura Modular

O backend está organizado em seis aplicativos Django principais, cada um com responsabilidade bem definida:

### 1. Users (Autenticação e Usuários)
- **Responsabilidade**: Gerenciamento de usuários, autenticação e integração com provedores externos
- **Modelo Principal**: `User` (customizado, usando email como username)
- **Funcionalidades-Chave**:
  - Registro de usuários com validação de email único
  - Autenticação tradicional (email/senha)
  - Autenticação via Google OAuth
  - Gerenciamento de sessão com JWT (access token: 15min, refresh token: 7d)
  - Perfis de usuário com nome e data de nascimento
  - Integração completa com Django Admin
- **Documentação Detalhada**: [users.md](users.md)

### 2. Groups (Grupos e Colaboração)
- **Responsabilidade**: Gerenciamento de grupos de usuários (famílias, comunidades) e seus membros
- **Modelos Principais**: `Grupo`, `GrupoMembro`
- **Funcionalidades-Chave**:
  - Criação de grupos com o usuário criador como dono
  - Convite de membros por email
  - Papéis definidos: Dono (controle total) e Membro (uso normal)
  - Compartilhamento de recursos entre membros do grupo
  - Sistema de permissões robusto baseado em papéis
  - Mixin de permissão reutilizável (`IsOwnerOrGroupMember`) para outros módulos
- **Documentação Detalhada**: [groups.md](groups.md)

### 3. Recipes (Receitas e Ingredientes)
- **Responsabilidade**: Gerenciamento de receitas culinárias, ingredientes e compartilhamento
- **Modelos Principais**: `Ingrediente`, `Receita`, `IngredienteReceita`, `CompartilhamentoReceita`
- **Funcionalidades-Chave**:
  - Catálogo global de ingredientes com categorização (10 categorias)
  - Receitas com título, descrição, modo de preparo, dificuldade, tempo, porções
  - Upload e armazenamento eficiente de imagens como data URI base64
  - Associação many-to-many entre receitas e ingredientes com quantidades
  - Compartilhamento seletivo de receitas pessoais com grupos
  - Receitas públicas do seed inicial (disponíveis para todos os usuários)
  - Busca por título/descrição e filtragem por categoria/dificuldade
- **Documentação Detalhada**: [recipes.md](recipes.md)

### 4. Planning (Planejamento Semanal)
- **Responsabilidade**: Planejamento de refeições semanais pessoais ou em grupo
- **Modelos Principais**: `PlanoSemanal`, `Refeicao`
- **Funcionalidades-Chave**:
  - Planos semanais vinculados a uma semana específica (segunda-reference date)
  - Planos podem ser pessoais ou compartilhados com grupos
  - Refeições mapeiam receitas para dias da semana e tipos (café, almoço, lanche, jantar, ceia)
  - Evita duplicação de refeições no mesmo slot (dia/tipo/receita)
  - Integração direta com listas de compras (uma lista por plano)
  - Filtragem por semana de referência e grupo
- **Documentação Detalhada**: [planning.md](planning.md)

### 5. Shopping (Listas de Compras)
- **Responsabilidade**: Geração e gestão de listas de compras
- **Modelos Principais**: `ListaCompra`, `ItemCompra`
- **Funcionalidades-Chave**:
  - Listas vinculadas a planos semanais (relação um-para-um)
  - Geração automática de listas a partir de planos semanais
  - Agregação inteligente de ingredientes por quantidade e unidade
  - Preservação de itens manuais durante regeneração automática
  - Itens vinculados a ingredientes do catálogo ou avulsos (nome_manual)
  - Marcação de itens como comprado com toggle otimizado
  - Cálculo automático de progresso (% de itens comprados)
  - Ordenação inteligente (pendentes primeiro, depois comprados)
- **Documentação Detalhada**: [shopping.md](shopping.md)

## Fluxo de Dados e Integração
O sistema foi projetado para suportar um fluxo de trabalho típico do usuário:

1. **Autenticação**: Usuário faz login via email/senha ou Google OAuth
2. **Grupos**: Usuário cria ou se junta a grupos (família, amigos)
3. **Receitas**: Usuário explora receitas públicas, cria suas próprias ou recebe compartilhamentos de grupos
4. **Planejamento**: Usuário cria plano semanal associando receitas a dias e tipos de refeição
5. **Compras**: Sistema gera automaticamente lista de compras baseada no plano
6. **Execução**: Usuário marca itens como comprados durante as compras
7. **Ciclo**: Processo se repete para a próxima semana

### Integração Entre Módulos
- **Users ↔ Todos**: Toda entidade que pertence a um usuário tem FK para o modelo User
- **Groups ↔ Recipes/Planning/Shopping**: 
  - FK para Grupo em Receita, PlanoSemanal, ListaCompra
  - Uso do mixin `IsOwnerOrGroupMember` para controle de acesso
  - Verificação de pertencimento via GrupoMembro
- **Recipes ↔ Planning**: 
  - Refeicao tem FK para Receita
  - Planning consome o catálogo de receitas para planejamento
- **Planning ↔ Shopping**: 
  - ListaCompra tem FK um-para-um para PlanoSemanal
  - Service `gerar_lista_compras` converte planos em listas
- **Shopping ↔ Recipes**: 
  - ItemCompra tem FK opcional para Ingrediente
  - Geração automática busca ingredientes das receitas do plano

## Autenticação e Segurança
- **Autenticação Primária**: JWT via cookies (httpOnly configurável)
  - Access token: 15 minutos (curto para segurança)
  - Refresh token: 7 dias com rotação e blacklist
  - Cookies configuráveis: Secure, SameSite, HttpOnly
- **Autenticação Secondary**: Django Allauth para registro e social login
- **Proteção CSRF**: Cookies CSRF com configuração de SameSite
- **Validação de Entrada**: Todos os serializadores validam dados de entrada
- **Proteção de Rotas**: 
  - Endpoints de leitura frequentemente acessíveis a membros
  - Endpoints de escrita geralmente restritos a donos/criadores
  - Uso extensivo de classes de permissão customizadas
- **Segurança de Dados**:
  - Senhas armazenadas com hash seguro do Django
  - Imagens redimensionadas e validadas durante upload
  - Prevenção de injeção através do ORM do Django
  - Cabeçalhos de segurança configuráveis (via settings)

## Documentação da API
- **Interface Swagger**: Disponível em `/api/docs/` quando DEBUG=True
- **Interface Redoc**: Disponível em `/api/redoc/` quando DEBUG=True
- **Schema OpenAPI**: Disponível em `/api/schema/` (formato JSON)
- **Geração Automática**: Via drf-spectacular baseado nos serializers e views

## Configuração e Deploy
- **Variáveis de Ambiente**: Gerenciadas tramite python-decouple (.env file)
- **Banco de Dados**: Suporta PostgreSQL (produzido) e SQLite (desenvolvimento)
- **Variáveis Essenciais**:
  - `SECRET_KEY`: Chave secreta do Django
  - `DEBUG`: Modo de desenvolvimento/True ou produção/False
  - `DB_*`: Configuração do PostgreSQL
  - `GOOGLE_OAUTH_*`: Credenciais para login social
  - `CORS_ALLOWED_ORIGINS`: Origens permitidas para frontend
  - `CSRF_TRUSTED_ORIGINS`: Origens confiáveis para CSRF
- **Containerização**: Totalmente Dockerizado com docker-compose
  - Serviços: PostgreSQL, Web (Django), Adminer (banco de dados GUI)
  - Volume persistente para dados do PostgreSQL
  - Espera por banco pronto antes de aplicar migrations
  - Variáveis de ambiente compartilhadas via .env
- **Gerenciamento de Dependências**: requirements.txt fixo para reproduzibilidade

## Considerações de Arquitetura
- **Modularidade Alta**: Cada app tem responsabilidade única e bem definida
- **Baixo Acoplamento**: Comunicação principalmente através de chaves estrangeiras e signals quando necessário
- **Escalabilidade**: Design pronto para crescimento (ex: separação futura de serviços)
- **Manutenibilidade**: Código organizado, comentado e seguindo convenções Django/DRF
- **Testabilidade**: Estrutura que facilita escrita de testes unitários e de integração
- **Internacionalização**: Configuração para português do Brasil (pt-br) e fuso horário de São Paulo

## Próximos Passos e Melhorias Possíveis
1. **Cobertura de Testes**: Implementação abrangente de testes unitários e de integração
2. **Cache**: Introdução de caching para consultas frequentes (ex: listas de ingredientes)
3. **WebSockets**: Para atualização em tempo real em interfaces colaborativas
4. **Optimização de Consultas**: Uso mais agressivo de select_related/prefetch_related onde necessário
5. **Pagination Customizada**: Melhorias na paginação para grandes conjuntos de dados
6. **Webhooks**: Para integração com serviços externos (ex: nutricionistas, mercados)
7. **Analytics**: Coleta de dados de uso para melhorias de produto
8. **Internacionalização Completa**: Suporte a múltiplos idiomas além do português
9. **Deploy em Cloud**: Adaptabilidade para plataformas como AWS, GCP ou Azure
10. **API Versionamento**: Suporte a múltiplas versões da API para evolução segura

## Conclusão
O backend do DishPlan representa uma base sólida e bem arquitetada para um aplicativo de planejamento de refeições colaborativo. Sua modularidade, atenção à segurança, integração cuidadosa entre componentes e aderência às melhores práticas do Django e DRF o tornam fácil de manter, estender e escalar. A separação clara de responsabilidades entre os módulos permite desenvolvimento independente e facilita a compreensão do sistema como um todo.