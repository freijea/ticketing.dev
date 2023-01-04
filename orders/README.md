Set up inicial do serviço

1) Instalar as dependências:
npm i

2) Construir imagem do serviço
docker build -t jsfreitas/orders .
docker push jsfreitas/orders

3) Criar os arquivos Kubernetes depl e database-srv
cd infra

4) Atualizar o skaffold.yaml
Incluir o serviço no skaffold.yaml

5) Rotas ingress 
Configurar as rotas no Ingress Service