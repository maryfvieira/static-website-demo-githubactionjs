FROM node:20

# Instala o AWS CLI v2 (opcional para debug)
RUN apt-get update && apt-get install -y unzip curl && \
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && ./aws/install && rm -rf awscliv2.zip aws

# Cria diretório de trabalho
WORKDIR /app

# Copia package.json e lockfile (se existir)
COPY package.json package-lock.json* ./

# Copia o script de deploy
COPY deployment.js ./

# Instala dependências
RUN npm install --production

# Define ponto de entrada
ENTRYPOINT ["node", "/app/deployment.js"]
