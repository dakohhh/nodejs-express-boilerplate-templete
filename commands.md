<!-- To generate private key -->
openssl genrsa -out private_key.pem 2048

<!-- To generate public key -->
openssl rsa -pubout -in private_key.pem -out puclic_key.pem