# CRM Juegos: Arquitectura de Microservicios y Visión Artificial

Este proyecto es una plataforma interactiva de juegos que integra **Reconocimiento Facial**, **Detección de Emociones en tiempo real** y **Comunicación Sincrónica**, manteniendo una arquitectura desacoplada, segura y escalable.

## 🏗️ Arquitectura del Sistema

El sistema se basa en una arquitectura de microservicios donde Laravel actúa como el **Orquestador Central**, delegando tareas intensivas de computación a servicios especializados.

### Componentes Principales

1.  **Core Backend (Laravel 11):**
    * **Rol:** Núcleo de seguridad y lógica de negocio.
    * **Responsabilidades:** Autenticación (Breeze/Inertia), gestión de roles y permisos (Spatie), orquestación de APIs y almacenamiento de datos abstractos.
    * **Seguridad:** Todas las decisiones de acceso se toman aquí. El microservicio de Python nunca decide quién entra, solo provee datos de validación.

2.  **Microservicio de Visión Artificial (Python + Docker):**
    * **Tecnología:** Flask/FastAPI + DeepFace.
    * **Rol:** Procesamiento biométrico aislado.
    * **Flujo de Verificación:** Laravel envía la imagen mediante una API REST interna; el microservicio procesa y retorna el resultado de la comparación. El cliente (frontend) nunca tiene acceso directo a este servicio.

3.  **Real-Time Engine (Laravel Reverb):**
    * **Tecnología:** WebSockets nativos de Laravel.
    * **Rol:** Gestión de chats en vivo y eventos de juego sincronizados bajo protocolos de seguridad del sistema.

4.  **Frontend (React + Inertia.js):**
    * **Detección de Emociones:** Implementada en el cliente (lado del navegador) para proteger la privacidad del usuario. Solo se envían metadatos (ej. `{"emotion": "happy", "score": 0.9}`) a la API de Laravel, nunca imágenes de la cámara al servidor de base de datos.

---

## 🔒 Flujos de Seguridad y Privacidad

### Enrolamiento y Verificación Facial
* **Enrolamiento:** Durante el flujo autenticado, el usuario registra su imagen de referencia que Laravel almacena de forma segura para futuras comparaciones.
* **Verificación:** Laravel actúa como **Proxy Seguro**. Captura el frame del frontend, valida la sesión y lo redirige al microservicio de Python. Esto evita exponer la IP o puertos del microservicio al internet público.

### Privacidad de Datos
* **Aislamiento:** El microservicio de Python reside en un contenedor Docker separado dentro de una red privada.
* **Datos Abstractos:** La base de datos solo almacena "emociones" y estadísticas vinculadas a sesiones de juego, eliminando cualquier rastro de biometría una vez procesada la verificación.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
| :--- | :--- |
| **Backend** | Laravel 11 (PHP 8.3) |
| **Microservicio AI** | Python 3.x (DeepFace / OpenCV) |
| **Frontend** | React + TypeScript + Tailwind CSS |
| **Comunicación RT** | Laravel Reverb (WebSockets) |
| **Base de Datos** | PostgreSQL / MySQL |
| **Contenerización** | Docker + Docker Compose |

---

## 🚀 Instalación y Despliegue

### Requisitos Previos
* Docker y Docker Compose.
* Node.js & NPM.

### Pasos de configuración

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/tu-usuario/crm-juegos.git](https://github.com/tu-usuario/crm-juegos.git)
    cd crm-juegos
    ```

2.  **Configurar el entorno Laravel:**
    ```bash
    cp .env.example .env
    # Configura REVERB_HOST, REVERB_PORT (8081) y las claves de la App
    ```

3.  **Levantar la infraestructura con Docker:**
    ```bash
    docker-compose up -d
    ```

4.  **Instalar dependencias y ejecutar migraciones:**
    ```bash
    docker-compose exec app composer install
    docker-compose exec app php artisan key:generate
    docker-compose exec app php artisan migrate
    npm install && npm run dev
    ```

5.  **Iniciar Servidor de WebSockets:**
    ```bash
    docker-compose exec app php artisan reverb:start --host=0.0.0.0 --port=8081 --debug
    ```

---

## 📁 Estructura de Rutas

* `routes/web.php`: Navegación, renderizado de componentes Inertia y Chat (vía cookies).
* `routes/api.php`: Endpoints protegidos para sesiones de juego y almacenamiento de emociones.

## RabbitMQ - Arquitectura Orientada a Eventos
Flujo de eventos
```bash
Claude → MCP (publish_to_rabbitmq) → RabbitMQ → Consumer Python
```

## Estructura del Repo (eventos)
```bash
crm-juegos/
│
├── mcp-rabbitmq/
│   ├── server.py
│   └── requirements.txt
│
├── consumer-service/
│   ├── consumer.py
│   └── requirements.txt
│
└── .vscode/
    └── mcp.json

```

## Arrancar RabbitMQ
```bash
docker run -d --hostname rabbit --name rabbitmq \
  -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```
Panel de control:
http://localhost:15672
Usuario: guest  
Contraseña: guest

## Arrancar RabbitMQ
```bash
cd mcp-rabbitmq
pip install -r requirements.txt
python server.py
```

## Publicar un evento desde Claude Code
```bash
Usa la herramienta publish_to_rabbitmq con:
queue_name = "test"
message = {"hola": "mundo"}
```
<img width="1913" height="568" alt="Captura de pantalla 2026-04-26 174906" src="https://github.com/user-attachments/assets/fc8e4653-6131-461a-a30c-67b5c7e0a0c5" />



## Arrancar el consumidor Python
```bash
cd consumer-service
pip install -r requirements.txt
python consumer.py
```

Si aparece el siguiente código será correcto:
```bash
👂 Esperando mensajes en la cola 'test'...
📩 Mensaje recibido:
{
    "hola": "mundo"
}
```

<img width="1357" height="897" alt="Captura de pantalla 2026-04-26 174918" src="https://github.com/user-attachments/assets/d9a0cafa-104b-46e7-baa9-4c005633a946" />
