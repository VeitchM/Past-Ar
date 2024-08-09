# Pastech: Mobile App

<h1>🇬🇧 English</h1>

A mobile app that provides support to the "Pasturometer", a piece of hardware that measures grass height. Pastech Mobile allows an easily and elegant way to visualize this data and calcute statistics from it.
  
<h2>📖 Features</h2>
  <ul>
    <li>Measurements reception and persistence from pasturometer via BLE</li>
    <li>Calibrations creation, editing & deletion</li>
    <li>Paddock map visualization</li>
    <li>Measurements, Paddocks & Calibrations sync with cloud</li>
    <li>Show and filter measurements geographically over paddocks</li>
    <li>Paddock sectorization</li>
  </ul>


<h2>📷 Screenshots</h2>
<div>
  <img src="https://github.com/VeitchM/Past-Ar/blob/main/assets/Capturas/Home.jpg" width="250"/>
  <img src="https://github.com/VeitchM/Past-Ar/blob/main/assets/Capturas/Calibrations.jpg" width="250"/>
  <img src="https://github.com/VeitchM/Past-Ar/blob/main/assets/Capturas/Calibrations-2.png" width="250"/>
</div>
<div>
  <img src="https://github.com/VeitchM/Past-Ar/blob/main/assets/Capturas/Paddocks.jpg" width="250"/>
  <img src="https://github.com/VeitchM/Past-Ar/blob/main/assets/Capturas/Statistics.jpg" width="250"/>
  <img src="https://github.com/VeitchM/Past-Ar/blob/main/assets/Capturas/UserLogin.jpg?" width="250"/>
</div>

<h2>🖥️ Techs</h2>
  
  Powered by Expo,React-Native, Typescript, Redux & SQLite. Package manager: npm. It can be built into an Android or iOS application.

<h2>✔️ Releases</h2>

  There will not be any compiled version of the app in the near future. You can download the source code and compile it yourself.
  
<h2>🪄 Getting Started</h2>

  ☑️ First step is to download the source code, via 'git clone' or dowloading the source code from 'Releases' (May consider forking previously).
    
    git clone https://github.com/VeitchM/Past-Ar
  
  ☑️ Next step is to install <b>npm</b> and its dependencies (inside your Past-Ar folder):
  
  ~~~ bash
  https://nodejs.org/en
  ~~~
  ~~~ bash
  npm install
  ~~~
  
  ☑️ To resolve Expo dependencies errors:
  
  ~~~ bash
  npx expo install --fix
  ~~~
  
  ☑️ Make sure you have JDK (for Java 11) installed and JAVA_HOME setted correctly. For Android is required to install Android SDK and Android Studio to run over an Emulator. For iOS is require xCode to build even if using another IDE.

<h2>🏃 Running the code</h2>

  To run on Android execute this command in the console:
  ~~~ bash
  npm run android
  ~~~
  
  To run on iOS execute this command in the console:
  
  ~~~ bash
  npm run ios
  ~~~
  
  To run Expo dev menu execute the following (may need to execute any of the previous commands before this one):
  
  ~~~ bash
  npx expo start
  ~~~

<h2>⚙️ Configurations</h2>

  Edit the <code>config.json</code> file to set the <b>Server URL</b>, you can also set the default <b>plate width</b> and <b>device brand</b> (used to filter while searching for devices).
  
  Finally, if everything is ok you can now build your project with Expo EAS. Do not forget to change EAS's projectId in <code>app.json</code>.

<br>
🐛 Feel free to report any bug you find! 🐛

<hr>

<h1>🇪🇸 Spanish</h1>
  Aplicación móvil que da soporte al "Pasturometro" un dispositivo que permite medir la altura del pasto. Pastech Mobile permite una forma fácil y elegante de visualizar estos datos y obtener estadisticas a partir de ellos.
  
<h2>📖 Características</h2>
  <ul>
    <li>Recepción y persistencia de Mediciones del Pasturometro a través de BLE</li>
    <li>Creación, edición y eliminación de Calibraciones</li>
    <li>Visualización de Potreros en el mapa</li>
    <li>Sincronización en la nube de Mediciones, Potreros y Calibraciones</li>
    <li>Mostrar y filtrar mediciones geograficamente encima de los potreros</li>
    <li>Sectorización de Potreros</li>
  </ul>


<h2>📷 Capturas</h2>
<div>
  <img src="https://github.com/VeitchM/Past-Ar/blob/main/assets/Capturas/Home.jpg" width="250"/>
  <img src="https://github.com/VeitchM/Past-Ar/blob/main/assets/Capturas/Calibrations.jpg" width="250"/>
  <img src="https://github.com/VeitchM/Past-Ar/blob/main/assets/Capturas/Calibrations-2.png" width="250"/>
</div>
<div>
  <img src="https://github.com/VeitchM/Past-Ar/blob/main/assets/Capturas/Paddocks.jpg" width="250"/>
  <img src="https://github.com/VeitchM/Past-Ar/blob/main/assets/Capturas/Statistics.jpg" width="250"/>
  <img src="https://github.com/VeitchM/Past-Ar/blob/main/assets/Capturas/UserLogin.jpg?" width="250"/>
</div>

<h2>⚙️ Tecnologías</h2>
  
  Utiliza Expo, React-Native, Typescript, Redux y SQLite. Gestor de paquetes: npm. Se pueden crear versiones para Android y iOS.

<h2>✔️ Releases</h2>

  No habrá ninguna versión compilada en el futuro próximo. Se puede descargar el código fuente y compilarlo uno mismo.
  
<h2>🪄 ¿Cómo empezar?</h2>
  ☑️ El primer paso es descargar el código fuente, medainte 'git clone' o descargandolo en la sección 'Releases' (Considere realizar un fork previo a este paso).
  
    git clone https://github.com/VeitchM/Past-Ar
  
  ☑️ El siguiente paso es instalar <b>npm</b> e instalar sus dependencias (dentro de la carpeta Past-Ar):
  
  ~~~ bash
  https://nodejs.org/en
  ~~~
  ~~~ bash
  npm install
  ~~~
  
  ☑️ Para resolver algunos errores de dependencias de Expo:
  
  ~~~ bash
  npx expo install --fix
  ~~~
  
  ☑️ Asegurate de tener instalado JDK (para Java 11) and el JAVA_HOME seteado correctamente. Para Android se necesita Android SDK y Android Studio para ejecutar en un Emulador. Para iOS se necesita xCode para generara una build incluso usando otro IDE.

<h2>🏃 Ejecutar el código</h2>

  Para ejecutar en Android escribir en la consola el comando:
  ~~~ bash
  npm run android
  ~~~
  
  Para ejecutar en iOS escribir en la consola el comando:
  
  ~~~ bash
  npm run ios
  ~~~
  
  Para ejecutar el menu de desarrollo de Expo escribir lo siguiente (puede ser necesario ejecutar los comando previos antes que este):
  
  ~~~ bash
  npx expo start
  ~~~

<h2>⚙️ Configuraciones</h2>

  Editar el archivo <code>config.json</code> para configurar la <b>URL del Servidor</b>, además puedes configurar el <b>ancho del plato</b> y la <b>marca del dispositivo</b> (utilizado para filtrar durante la busqueda de dispositivos).
      
  Finalmente, si todo funciona bien se puede generar una build con Expo EAS. No olvidarse de cambiar el projectId de EAS en <code>app.json</code>.

<br>
🐛 ¡Sientete libre de reportar cualquier bug! 🐛
