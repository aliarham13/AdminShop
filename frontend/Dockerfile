FROM node:24-slim

WORKDIR /app

RUN corepack enable

# Install dependencies
COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm install

COPY . .

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]

