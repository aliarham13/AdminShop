FROM node:24-slim

WORKDIR /app

RUN corepack enable

# Install dependencies
COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm install

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]

