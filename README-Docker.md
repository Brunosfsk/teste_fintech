# Docker Setup - Fintech Microfrontends

Este projeto inclui configuração completa do Docker para containerização da aplicação React/Vite.

## Arquivos Docker

- **Dockerfile**: Build de produção otimizado com multi-stage
- **Dockerfile.dev**: Build de desenvolvimento com hot reload
- **docker-compose.yml**: Orquestração dos containers
- **nginx.conf**: Configuração do Nginx para SPA
- **.dockerignore**: Otimização do contexto de build

## Como usar

### Produção

```bash
# Build e execução da aplicação em produção
docker-compose up --build fintech-app

# Ou em background
docker-compose up -d --build fintech-app
```

A aplicação estará disponível em: `http://localhost:3000`

### Desenvolvimento

```bash
# Build e execução em modo desenvolvimento
docker-compose --profile dev up --build fintech-dev

# Ou em background
docker-compose --profile dev up -d --build fintech-dev
```

A aplicação estará disponível em: `http://localhost:5173` com hot reload

### Comandos úteis

```bash
# Parar todos os containers
docker-compose down

# Parar e remover volumes
docker-compose down -v

# Ver logs
docker-compose logs fintech-app

# Rebuild sem cache
docker-compose build --no-cache

# Validar configuração
docker-compose config
```

## Características

### Dockerfile (Produção)
- **Multi-stage build** para otimização
- **Node.js 18 Alpine** para build
- **Nginx Alpine** para servir arquivos estáticos
- **Configuração SPA** para React Router
- **Compressão gzip** habilitada
- **Headers de segurança** configurados

### Dockerfile.dev (Desenvolvimento)
- **Hot reload** com Vite
- **Volume mounting** para desenvolvimento
- **Porta 5173** exposta
- **Todas as dependências** instaladas

### Docker Compose
- **Rede isolada** para os containers
- **Health checks** configurados
- **Restart policies** definidas
- **Profiles** para separar dev/prod
- **Volumes** para persistência

## Requisitos

- Docker 20.10+
- Docker Compose 2.0+

## Portas

- **Produção**: 3000 → 80 (Nginx)
- **Desenvolvimento**: 5173 → 5173 (Vite)

## Variáveis de Ambiente

- `NODE_ENV`: production/development
- `VITE_HOST`: 0.0.0.0 (para desenvolvimento)