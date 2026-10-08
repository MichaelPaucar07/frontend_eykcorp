# ---------- ETAPA 1: COMPILACIÓN (Node) ----------
FROM node:22-alpine AS build
WORKDIR /app

# DEPENDENCIAS (CAPA CACHEADA MIENTRAS NO CAMBIE package-lock.json)
COPY package.json package-lock.json ./
RUN npm ci

# BUILD DE PRODUCCIÓN (USA .env.production -> VITE_API_URL=/api)
COPY . .
RUN npm run build

# ---------- ETAPA 2: SERVIDOR WEB (Nginx) ----------
FROM nginx:1.27-alpine

# La imagen oficial reemplaza ${VARIABLES} de /etc/nginx/templates al arrancar
ENV BACKEND_URL=http://backend:8081
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
