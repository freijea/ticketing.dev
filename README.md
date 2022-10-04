# ticketing.dev

1. First, generate a key file used for self-signed certificate generation with the command below. The command will create a private key as a file called key.pem.

openssl genrsa -out key.pem

2. Next, generate a certificate service request (CSR) with the command below. You’ll need a CSR to provide all of the input necessary to create the actual certificate.

openssl req -new -key key.pem -out csr.pem

3. Finally, generate your certificate by providing the private key created to sign it with the public key created in step two with an expiry date of 9,999 days. This command below will create a certificate called cert.pem.

openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem

NO EXCEL CTRL + L em LOCALIZAR CTRL + J e em seguida substituir tudo

openssl req -x509 -sha256 -days 356 -nodes -newkey rsa:2048 -subj "/CN=ticketing.dev/C=BR/L=Sao Paulo" -keyout rootCA.key -out rootCA.crt 

openssl req -new -key server.key -out server.csr

openssl x509 -req -in server.csr -CA rootCA.crt -CAkey rootCA.key -CAcreateserial -out server.crt -days 365 -sha256 -extfile cert.conf

Create self-signed certificate
openssl req -x509 -newkey rsa:4096 -sha256 -nodes -keyout tls.key -out tls.crt -subj "/CN=ticketing.dev" -days 365

Create kubernetes secret with those keys
kubectl create secret tls ingress-local-tls --cert=tls.crt --key=tls.key

kubectl wait --namespace ingress-nginx --for=condition=ready pod --selector=app.kubernetes.io/component=controller --timeout=90s