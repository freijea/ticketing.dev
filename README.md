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

# Git create a new branch
git checkout -b dev
git push origin dev
git checkout dev (change to an existing branch)

# to connect to Digital Ocean
doctl auth init

# to run a kubernet cluster
doctl kubernetes cluster kubeconfig save <the same name of the cluster in Digital Ocean>

doctl kubernetes cluster kubeconfig save ticketing

# to run the kubernetes cluster locally
kubectl config view
kubectl config use-context docker-desktop