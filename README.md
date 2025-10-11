# Promptverse

Promptverse es una red social de prompts moderna construida con Next.js 14 (App Router) y preparada para desplegarse en un servidor Linux con MySQL. Incluye autenticación segura, panel de administración y una experiencia bilingüe (Español e Inglés).

## Características clave

- 📚 Feed social con resultado del prompt, comentarios en hilo y acciones sociales (likes, dislikes, guardar, favoritos, repost).
- 🌐 Internacionalización completa (ES/EN) con selector de banderas.
- 🔒 Seguridad empresarial: Argon2id, CSRF, rate limiting, RBAC (admin/user) y validaciones con Zod.
- 🛠️ Panel de administración para gestionar usuarios, secciones, agentes y métricas.
- 🧷 Seeding automático con usuario administrador (credenciales configurables por variables de entorno).
- 🎨 UI moderna con Tailwind CSS, componentes shadcn/ui y animaciones con Framer Motion.

## Tecnologías

- **Frontend**: Next.js 14 (App Router, SSR + RSC), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, i18next.
- **Backend**: Next.js API Routes, NextAuth, Prisma ORM.
- **Base de datos**: MySQL con claves UUIDv7 generadas desde la aplicación y migraciones Prisma.

## Configuración inicial

1. **Instala dependencias**

   ```bash
   npm install
   ```

2. **Configura variables de entorno**

   Copia `.env.example` a `.env` y ajusta los valores:

   ```bash
   cp .env.example .env
   ```

   - `DATABASE_URL`: cadena de conexión MySQL.
   - `NEXTAUTH_SECRET`: secreto para firmar sesiones.
   - `ADMIN_*`: credenciales para el usuario administrador inicial (no se muestran en la UI).

3. **Ejecuta migraciones y seed**

   ```bash
   npx prisma migrate deploy
   npm run prisma:seed
   ```

4. **Levanta el entorno de desarrollo**

   ```bash
   npm run dev
   ```

   La aplicación estará disponible en `http://localhost:3000`.

## Scripts disponibles

- `npm run dev` – servidor de desarrollo.
- `npm run build` – build de producción.
- `npm run start` – servidor de producción.
- `npm run prisma:generate` – genera el cliente Prisma.
- `npm run prisma:migrate` – aplica migraciones en producción.
- `npm run prisma:seed` – ejecuta el seeding (secciones, agentes, usuario admin).

## Estructura de directorios

```
src/
  app/           # Rutas App Router (frontend + API)
  components/    # Componentes UI y layouts
  lib/           # Utilidades, Prisma, i18n, rate limiting
  locales/       # Diccionarios ES/EN
  styles/        # Tailwind global CSS
prisma/
  schema.prisma  # Modelo de datos
  seed.ts        # Script de seeding
public/
  images/flags   # Iconos de selector de idioma
```

## Despliegue

1. Compila el proyecto: `npm run build`.
2. Ejecuta migraciones: `npm run prisma:migrate`.
3. Inicia el servidor en modo producción: `npm run start`.

Para despliegues con Docker, puedes extender el proyecto creando un `Dockerfile` y `docker-compose.yml` según tus necesidades (la estructura está preparada para ello).

## Instalación en un servidor Linux (paso a paso)

1. **Preparar el entorno**
   - Actualiza los paquetes: `sudo apt update && sudo apt upgrade -y`.
   - Instala dependencias básicas: `sudo apt install -y git curl build-essential`.
   - Instala Node.js 20 LTS (usando nvm o el instalador oficial) y comprueba la versión con `node -v`.
   - Instala pnpm o npm (este proyecto usa npm por defecto).

2. **Configurar MySQL**
   - Instala el servidor: `sudo apt install -y mysql-server`.
   - Asegura la instalación: `sudo mysql_secure_installation`.
   - Crea una base de datos y un usuario dedicados:

     ```sql
     CREATE DATABASE promptverse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
     CREATE USER 'promptverse'@'%' IDENTIFIED BY 'cambia-esta-contraseña';
     GRANT ALL PRIVILEGES ON promptverse.* TO 'promptverse'@'%';
     FLUSH PRIVILEGES;
     ```

3. **Clonar y preparar la aplicación**
   - Clona el repositorio: `git clone <tu-url> && cd topojson`.
   - Copia la configuración: `cp .env.example .env`.
   - Edita `.env` con la URL de la base de datos (`DATABASE_URL="mysql://promptverse:contraseña@localhost:3306/promptverse"`), `NEXTAUTH_SECRET` y las credenciales del administrador.
   - Instala dependencias: `npm install`.

4. **Construir y migrar**
   - Ejecuta las migraciones: `npx prisma migrate deploy`.
   - Rellena datos iniciales: `npm run prisma:seed`.
   - Genera el build de producción: `npm run build`.

5. **Ejecutar en producción**
   - Inicia la aplicación: `npm run start` (por defecto en el puerto 3000).
   - Opcional: usa un process manager como PM2 o configura un servicio systemd para mantener el proceso en segundo plano.

6. **Reverse proxy y HTTPS (opcional pero recomendado)**
   - Instala Nginx: `sudo apt install -y nginx`.
   - Configura un bloque de servidor que haga proxy a `http://127.0.0.1:3000`.
   - Habilita HTTPS con Let's Encrypt utilizando Certbot: `sudo certbot --nginx -d tu-dominio.com`.

7. **Actualizaciones**
   - Obtén los últimos cambios: `git pull`.
   - Repite los pasos de migraciones (`npx prisma migrate deploy`) y build (`npm run build`).
   - Reinicia el proceso (`pm2 restart <nombre>` o `systemctl restart promptverse`).

Con estos pasos tendrás Promptverse funcionando en un servidor Linux con MySQL y listo para recibir tráfico de producción.

## Licencia

Este proyecto se distribuye bajo la licencia MIT.
