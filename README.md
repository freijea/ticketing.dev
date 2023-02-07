# Setup novos serviços
Copiar os arquivos no root directory do serviço de auth
Alterar todas as referências ao serviço de auth no novo serviço
rodar npm install
checar os erros remanescents
docker build -t jsfreitas/newservice .
docker push jsfreitas/newservice 

# Configurar os arquivos infra/k8s
depl.yaml
update skaffold file, copiando o modelo de auth
mongo.depl.yaml

# Test
Run commands on each service directory npm install --save-dev @types/jest @types/supertest jest ts-jest supertest mongodb-memory-server

# Best Practices on API Rest
https://www.alura.com.br/artigos/rest-principios-e-boas-praticas?gclid=Cj0KCQiA37KbBhDgARIsAIzce17CKNB3KzbPfdw40jST93o_bxDQElY5TdU-5T7UeN4pqjlxrGtnYNwaApz4EALw_wcB

Fazer teste