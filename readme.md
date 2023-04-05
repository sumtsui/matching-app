## Development

### Start the project

```
# use correct node version
nvm use

# start DB and backend
cd ./server
npm ci
docker compose up -d
dev/reload-db
cd ./client
npm ci
npm run start

```

### DB migration

如对 model 进行了修改，需要跑以下命令让 typeorm 根据 model 的改动生成新的 db migration 文件

```
# generate migration file
docker exec api npm run typeorm -- migration:generate ./src/migrations/sync -d ./src/data-source.ts -p

# run migrations
# migration文件生成后，需要跑以下命令，typeorm会自动把未执行过的migration都执行
docker exec api npx typeorm-ts-node-commonjs migration:run -d ./src/data-source.ts
```

### URL

[postgres adminer](http://localhost:8080/?pgsql=db&username=postgres&db=matching_app&ns=public)

[api](http://localhost:4000)

[frontend](http://localhost:3000/matching-event/36cffe10-3f93-40f3-96be-26cb42399955)

### VS Code extensions

Install VS Code extension:

1. ESLint - to show lint messages on the fly
2. Prettier - to format code on save

```json
// .vscode/settings.json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  }
}
```

## Production

```
# try production docker compose in local
## stop dev containers if they are running to prevent port conflicts
docker compose stop
docker compose -f docker-compose.prod.yml -p matching-app-prod up -d

# db migration
## enter production api container
docker compose -f docker-compose.prod.yml -p matching-app-prod exec api sh
node_modules/typeorm/cli.js migration:run -d dist/data-source.js
```
