FROM node:lts
COPY package*.json /usr/src/app/
WORKDIR /usr/src/app
# If you are building your code for production
#RUN npm ci --only=production
RUN npm i
COPY . /usr/src/app
RUN npm run build
EXPOSE 8080
ENV PORT=8080
ENV STATUS_API_PATH="http://localhost:8000/update"    
ENV API_TOKEN_GITHUB=ghp_test123456475675
ENV MIN_FAUCET_ETH="1000"
ENV MIN_FAUCET_OCEAN="100000000000"
ENV C2D_ENVIRONMENTS="2"
ENV BLOCK_TOLERANCE="5"

# CRON JOB inteval in minutes
ENV INTERVAL="100"

# SMTP Settings for nodemailer email notifications  
ENV SMTP_HOST='smtp.gmail.com'
ENV SMTP_PORT='587'
ENV SMTP_USER='user@example.com'
ENV SMTP_PASS='TEST'

# Email where the notifications will be sent
ENV EMAIL='user@example.com'

ENV NETWORKS='[{"name":"mainnet", "chainId": "1", "rpcUrl": "https://network.infura.io/v3/123"}]'
    

CMD [ "npm", "run", "start" ]