# 🌿 SIG Web San Fernando de Apure

Plataforma web interactiva para la identificación y evaluación de espacios con infraestructura verde en San Fernando de Apure, Venezuela. Permite a ciudadanos visualizar puntos en un mapa, responder cuestionarios y generar un ranking en tiempo real; mientras que administradores pueden gestionar los sitios, fotos y preguntas.

---

## 🚀 Tecnologías

- **Frontend**: React (Vite), Tailwind CSS, Leaflet (OpenStreetMap)
- **Backend / DB**: Supabase (PostgreSQL, Storage, Realtime)
- **Despliegue**: Vercel / Netlify (configurar variables de entorno)

---

## 📁 Estructura del proyecto
src/
├── components/ # Componentes reutilizables (Mapa, Sidebar, Formularios...)
├── contexts/ # Contexto de administrador y cliente Supabase
├── lib/ # Cliente Supabase
├── pages/ # Vistas principales (Home, Ranking, Admin)
└── ...

---

## ⚙️ Configuración inicial

### 1. Clona el repositorio e instala dependencias

```bash
git clone https://github.com/tuusuario/sig-web-san-fernando.git
cd sig-web-san-fernando
npm install
```

### 2. Crea un proyecto en Supabase
Ve a supabase.com y crea un nuevo proyecto.

En el SQL Editor, ejecuta el script database.sql (incluido en la raíz) para crear las tablas necesarias.

En Storage, crea un bucket llamado site-photos y márcalo como público.

Copia la URL y la clave anónima (anon key) del proyecto.

### 3. Configura las variables de entorno
Crea un archivo .env en la raíz con:


```text
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

### 4. Inicia el servidor de desarrollo


```bash
npm run dev
```
La aplicación estará disponible en http://localhost:5173.

### 🔐 Acceso como administrador
- Panel de administración: /admin
- Credenciales por defecto:
- Usuario: admin
- Contraseña: 1234

Desde el panel podrás agregar/editar puntos en el mapa, subir fotos y definir las preguntas del cuestionario.

### 🗺️ Funcionalidades principales
- Mapa interactivo con puntos rojos (sin infraestructura verde) y verdes (con infraestructura).
- Panel deslizante con fotos, datos del sitio y cuestionario de 3 preguntas.
- Pregunta 3 con imágenes asociadas a cada opción.
- Ranking en tiempo real según respuestas de los usuarios.
- Persistencia de datos en Supabase (PostgreSQL + Storage).

## 📄 Licencia
MIT © Angel Velazque
