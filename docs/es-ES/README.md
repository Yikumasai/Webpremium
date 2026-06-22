<div align="center">
  
# ![](../../icons/icon48.png) Webpremium - Precargador de Enlaces

</div>

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MPL--2.0-green.svg)
![Chrome](https://img.shields.io/badge/Chrome-Extension-orange.svg)

**Experiencia de Navegación con Cero Latencia | Precarga Inteligente | Cambio Fluido**

[Características](#-características) • [Instalación](#-instalación) • [Uso](#-uso) • [Cómo Funciona](#️-cómo-funciona) • [Preguntas Frecuentes](#-preguntas-frecuentes)

</div>

---
<p align="center">
  <a href="../en-US/README.md"><img alt="README in English" src="https://img.shields.io/badge/English-d9d9d9"></a>
  <a href="../zh-TW/README.md"><img alt="繁體中文文件" src="https://img.shields.io/badge/繁體中文-d9d9d9"></a>
  <a href="../../README.md"><img alt="简体中文文件" src="https://img.shields.io/badge/简体中文-d9d9d9"></a>
  <a href="../ja-JP/README.md"><img alt="日本語のREADME" src="https://img.shields.io/badge/日本語-d9d9d9"></a>
  <a href="../es-ES/README.md"><img alt="README en Español" src="https://img.shields.io/badge/Español-d9d9d9"></a>
  <a href="../fr-FR/README.md"><img alt="README en Français" src="https://img.shields.io/badge/Français-d9d9d9"></a>
  <a href="../ko-KR/README.md"><img alt="README in Korean" src="https://img.shields.io/badge/한국어-d9d9d9"></a>
  <a href="../ar-SA/README.md"><img alt="README بالعربية" src="https://img.shields.io/badge/العربية-d9d9d9"></a>
  <a href="../tr-TR/README.md"><img alt="Türkçe README" src="https://img.shields.io/badge/Türkçe-d9d9d9"></a>
  <a href="../vi-VN/README.md"><img alt="README Tiếng Việt" src="https://img.shields.io/badge/Ti%E1%BA%BFng%20Vi%E1%BB%87t-d9d9d9"></a>
  <a href="../de-DE/README.md"><img alt="README in Deutsch" src="https://img.shields.io/badge/German-d9d9d9"></a>
  <a href="../bn-BD/README.md"><img alt="README in বাংলা" src="https://img.shields.io/badge/বাংলা-d9d9d9"></a>
</p>

## 📖 Introducción

Webpremium es una extensión revolucionaria de Chrome que logra una experiencia de navegación web con **cero latencia** mediante tecnología de precarga inteligente. Cuando pasas el cursor sobre un enlace, la extensión abre la página de antemano en una ventana de precarga en segundo plano. Cuando realmente haces clic en el enlace, la pestaña precargada se mueve sin problemas a la ventana principal, sin que sientas ningún tiempo de espera.

### ✨ Características Principales

- 🎯 **Experiencia de Cero Latencia** - Precarga al pasar el cursor, abre al hacer clic
- 🪟 **Tecnología de Ventana de Precarga** - Precarga en ventana independiente, sin interferir con la ventana principal
- 🔄 **Gestión Inteligente de Pestañas** - Detecta automáticamente y salta a pestañas ya abiertas
- 📊 **Estadísticas en Tiempo Real** - Rastrea el efecto de precarga y el tiempo ahorrado
- 🎨 **Interfaz Moderna** - Soporte de modo oscuro, interfaz limpia y hermosa
- ⚙️ **Altamente Personalizable** - Opciones de configuración ricas para satisfacer necesidades personalizadas

---

## 🎯 Características

### Funciones Principales

#### 1. Precarga Inteligente
- **Activación por Hover** - Precarga automática al pasar el cursor sobre enlaces
- **Tiempo de Retraso Ajustable** - Soporta configuración de retraso de hover de 0-1000ms
- **Predicción de Enlaces Cercanos** - Identifica inteligentemente enlaces cercanos al cursor y los precarga
- **Control de Cantidad de Precarga** - Configura el número máximo de precargas simultáneas (1-10)

#### 2. Modos de Precarga
- **Modo Ventana de Precarga (Recomendado)** - Precarga en ventana minimizada independiente, carga completa de página, sin interferir con la ventana principal
- **Modo Precarga iframe** - Método de precarga ligero, buena compatibilidad

#### 3. Gestión Inteligente de Pestañas
- **Detección de Pestañas Duplicadas** - Detecta automáticamente pestañas con la misma URL
- **Salto Automático** - Al hacer clic en enlaces ya abiertos, salta automáticamente a la pestaña existente
- **Movimiento Fluido** - Las pestañas precargadas se mueven sin problemas a la ventana principal
- **Optimización de Memoria** - Reduce pestañas duplicadas, disminuye el uso de memoria

#### 4. Conciencia de Red
- **Detección Inteligente** - Detecta automáticamente el estado de la red
- **Estrategia Adaptativa** - Reduce automáticamente la precarga en redes lentas
- **Ahorro de Datos** - Evita desperdiciar datos en entornos de red débil

#### 5. Indicador Visual
- **Visualización de Estado de Precarga** - Muestra un punto pequeño junto al enlace indicando el estado de precarga
- **Animación de Carga** - Punto naranja indica carga en progreso
- **Marca de Carga Completa** - Punto verde indica precarga completada

#### 6. Gestión de Reglas de Sitios
- **Reglas Personalizadas** - Habilita o deshabilita la precarga para sitios específicos
- **Control a Nivel de Dominio** - Control de precarga preciso por dominio
- **Menú Contextual** - Cambia rápidamente el estado de precarga del sitio actual

#### 7. Estadísticas y Análisis
- **Número de Precargas** - Registra el número total de precargas
- **Estadísticas de Tasa de Aciertos** - Calcula la tasa de utilización efectiva de precarga
- **Tiempo Ahorrado** - Estadísticas del tiempo total ahorrado
- **Duración de Sesión** - Muestra la duración de uso de la sesión actual

### Atajos de Teclado

- `Alt + P` - Activar/desactivar rápidamente la función de precarga
- `Alt + C` - Limpiar toda la caché de precarga

### Menú Contextual

- **Precargar este enlace** - Precarga manualmente el enlace seleccionado
- **Habilitar/Deshabilitar precarga en este sitio** - Cambia rápidamente el estado de precarga del sitio actual

---

## 📦 Instalación

### Método 1: Instalación en Modo Desarrollador

1. **Descargar código fuente**
   Descargar desde la página de [releases](https://github.com/Yikumasai/Webpremium/releases)
   
   o
   
   ```bash
   git clone https://github.com/Yikumasai/webpremium.git
   ```

2. **Abrir página de extensiones de Chrome**
   - Ingresa `chrome://extensions/` en la barra de direcciones
   - O haz clic en menú → Más herramientas → Extensiones

3. **Habilitar modo desarrollador**
   - Activa el interruptor "Modo de desarrollador" en la esquina superior derecha

4. **Cargar extensión**
   - Haz clic en "Cargar extensión sin empaquetar"
   - Selecciona la carpeta `webpremium` descargada

5. **Completar instalación**
   - El icono de la extensión aparecerá en la barra de herramientas del navegador
   - Haz clic en el icono para abrir el panel de configuración

### Método 2: Chrome Web Store
> Próximamente

---

## 🎮 Uso

### Uso Básico

1. **Habilitar extensión**
   - La extensión está habilitada por defecto después de la instalación
   - Haz clic en el icono de la barra de herramientas para ver el estado

2. **Experimentar la precarga**
   - Pasa el cursor sobre cualquier enlace
   - Espera el tiempo de retraso configurado (100ms por defecto)
   - Aparecerá un punto verde junto al enlace indicando precarga completa
   - Haz clic en el enlace para abrirlo instantáneamente

3. **Ver estadísticas**
   - Haz clic en el icono de la extensión
   - Cambia a la pestaña "Estadísticas"
   - Ver el efecto de precarga y el tiempo ahorrado

### Configuración Avanzada

#### Ajustar Retraso de Hover
- Abrir panel de configuración
- Arrastra el control deslizante "Retraso de hover"
- Valor recomendado: 100-300ms

#### Configurar Número de Precargas
- Abrir panel de configuración
- Arrastra el control deslizante "Número máximo de precargas"
- Valor recomendado: 3-5

#### Seleccionar Modo de Precarga
- **Modo Ventana de Precarga**: Precarga completa, mejor experiencia (recomendado)
- **Modo iframe**: Ligero, buena compatibilidad

#### Gestión de Reglas de Sitios
1. Cambiar a la pestaña "Reglas de sitios"
2. Hacer clic en el botón "Agregar regla"
3. Ingresar dominio (ej: example.com)
4. Configurar estado habilitado o deshabilitado

---

## ⚙️ Cómo Funciona

### Flujo de Precarga

```
Usuario pasa cursor sobre enlace
    ↓
Esperar tiempo de retraso
    ↓
Verificar estado de red
    ↓
Verificar reglas de sitio
    ↓
Crear ventana de precarga
    ↓
Abrir pestaña en ventana de precarga
    ↓
Minimizar ventana de precarga
    ↓
Usuario hace clic en enlace
    ↓
Mover pestaña a ventana principal
    ↓
Activar pestaña
    ↓
¡Completado!
```

### Arquitectura Técnica

- **Content Script** - Escucha eventos de enlaces de página, activa precarga
- **Background Service Worker** - Gestiona ventana de precarga y pestañas
- **Popup UI** - Proporciona interfaz de configuración e información estadística
- **Chrome Storage API** - Persiste configuración y datos estadísticos

### Tecnología de Ventana de Precarga

La extensión utiliza una ventana de precarga independiente para precargar páginas:

1. Crea una ventana pequeña de tipo normal
2. Minimiza inmediatamente esa ventana
3. Crea pestaña de precarga en la ventana
4. Cuando el usuario hace clic, mueve la pestaña a la ventana principal
5. Activa la pestaña y enfoca la ventana principal

Ventajas de este método:
- ✅ Precarga completa de página (incluyendo JavaScript, CSS, imágenes, etc.)
- ✅ La ventana principal no se ve afectada en absoluto
- ✅ Las pestañas se pueden mover sin problemas
- ✅ Soporta todos los sitios y páginas complejas

---

## 🔧 Opciones de Configuración

| Opción | Descripción | Valor Predeterminado | Valor Recomendado |
|------|------|--------|--------|
| Habilitar precarga | Interruptor principal | Activado | Activado |
| Retraso de hover | Tiempo después del hover para activar precarga | 100ms | 100-300ms |
| Número máximo de precargas | Cantidad máxima de precargas simultáneas | 5 | 3-5 |
| Modo de precarga | Método de precarga | Ventana de precarga | Ventana de precarga |
| Conciencia de red | Ajustar según estado de red | Activado | Activado |
| Mostrar indicador | Mostrar punto de estado de precarga | Activado | Activado |

---

## ❓ Preguntas Frecuentes

### P: ¿La precarga consume muchos datos?
R: La extensión detecta inteligentemente el estado de la red y reduce automáticamente la precarga en redes lentas. También puedes controlar el consumo de datos ajustando el "Número máximo de precargas".

### P: ¿La precarga afecta el rendimiento del navegador?
R: La precarga utiliza una ventana independiente, por lo que el impacto en el rendimiento de la ventana principal es mínimo. Además, la extensión limpia automáticamente el contenido de precarga caducado.

### P: ¿Por qué falla la precarga en algunos sitios?
R: Algunos sitios pueden tener mecanismos de protección. Puedes deshabilitar la precarga para estos sitios en "Reglas de sitios".

### P: ¿Cómo sé si un enlace ha sido precargado?
R: Después de habilitar "Mostrar indicador", aparecerá un punto verde junto a los enlaces precargados.

### P: ¿Se mostrará la ventana de precarga?
R: No. La ventana de precarga se minimiza inmediatamente y no afecta en absoluto tu experiencia de navegación.

### P: ¿Puedo deshabilitar la precarga para sitios específicos?
R: Sí. Agrega reglas de dominio en la pestaña "Reglas de sitios", o haz clic derecho en la página y selecciona "Habilitar/Deshabilitar precarga en este sitio".

---

## 🚀 Historial de Versiones

### v2.0.0 (Versión Actual)
- ✨ Nueva tecnología de ventana de precarga
- ✨ Gestión inteligente de pestañas
- ✨ Sistema de reglas de sitios
- ✨ Funciones de estadísticas y análisis
- ✨ Optimización de conciencia de red
- ✨ Indicador visual
- ✨ Soporte de modo oscuro
- ✨ Soporte de atajos de teclado
- ✨ Integración de menú contextual

### v1.4.6
- 🔧 Detección de pestañas duplicadas
- 🔧 Función de salto automático

---

## 🤝 Contribución

¡Se aceptan Issues y Pull Requests!

---

## 📄 Licencia

Mozilla Public License Version 2.0

Este proyecto adopta la licencia MPL-2.0. Para más detalles, consulta el archivo [LICENSE](../../LICENSE).

---

## 💬 Comentarios y Soporte

- 🐛 [Reportar Bug](https://github.com/Yikumasai/webpremium/issues)
- 💡 [Sugerencias de Funciones](https://github.com/Yikumasai/webpremium/issues)
- 📧 Email: likanglin2001@qq.com

---

## 🌟 Agradecimientos

¡Gracias a todos los usuarios que usan y apoyan Webpremium!

Si este proyecto te ayuda, ¡danos una ⭐️ Star!

---

<div align="center">

**Navegación más rápida, mejor experiencia**

Made with ❤️ by Webpremium

</div>


