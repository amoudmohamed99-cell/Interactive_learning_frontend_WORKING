FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Vite injects VITE_* env vars at BUILD time
ARG VITE_API_URL=https://interactivelearning-production.up.railway.app/api/v1
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
  
