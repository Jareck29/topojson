# Paperboy: Neo Courier

"Paperboy: Neo Courier" es un juego de acción y aventuras para Android inspirado en el clásico Paperboy, desarrollado con Unity. El proyecto incluye misiones diarias, minijuegos temáticos, batallas dinámicas e historia narrativa, con soporte completo de localización en Español e Inglés.

## Características principales / Key Features
- **Misiones diarias** que rotan automáticamente y ofrecen recompensas variables.
- **Minijuegos** que amplían la jugabilidad clásica con retos de equilibrio, precisión y velocidad.
- **Batallas** contra dron-repartidores rivales y antagonistas corporativos, con habilidades especiales y mejoras.
- **Historia ramificada** que evoluciona con las decisiones del jugador.
- **Localización** dinámica (Español / Inglés) a través de archivos JSON en `Assets/Resources/Localization`.
- **Guardado en la nube** y progresión con sistema de reputación del vecindario.

## Estructura del proyecto
```
UnityPaperboy/
├── Assets/
│   ├── Resources/
│   │   └── Localization/       # Archivos JSON para textos en ES/EN
│   └── Scripts/
│       ├── Gameplay/           # Lógica de misiones, minijuegos y batallas
│       ├── Managers/           # Gestión de escenas, progresión y localización
│       └── Story/              # Sistema narrativo y diálogos
└── README.md
```

## Configuración rápida en Unity
1. Abra Unity Hub y cree un nuevo proyecto **3D URP (Android)**.
2. Copie el contenido de esta carpeta dentro de la carpeta del proyecto Unity.
3. Instale los paquetes necesarios: `TextMeshPro`, `Input System`, `Addressables` (opcional).
4. Configure `Player Settings` para Android (mínimo API 24) y ajuste la orientación a paisaje.
5. Añada las escenas principales: `MainMenu`, `CityRoute`, `BattleArena`, `MiniGameHub`, `StoryEvent`.
6. Asigne los scripts provistos a GameObjects en las escenas correspondientes.

## Sistemas incluidos
- **Gestor de localización** conmutado dinámicamente entre Español e Inglés.
- **Administrador de misiones diarias** con generación aleatoria y seguimiento de progreso.
- **Controlador de minijuegos** que instancia prefabs específicos en un contenedor.
- **Sistema de batallas** por turnos con eventos para actualizar la UI.
- **Directorio narrativo** con soporte para decisiones ramificadas y diálogos localizados.
- **Gestor de progreso** para guardar reputación y monedas en almacenamiento persistente.

## Próximos pasos sugeridos
- Integrar assets visuales y de audio.
- Implementar navegación por UI con `Unity Localization` package si se desea soporte avanzado.
- Añadir integración con servicios de guardado en la nube (Google Play Games Services).

¡Disfruta construyendo Paperboy: Neo Courier!
