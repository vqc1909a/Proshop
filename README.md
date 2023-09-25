# Comandos del package.json

* Para crear todo este proyecto, primero creas tu carpeta general y dentro crearas el proyecto frontend con el comando "npx create-react-app frontend"
* El archivo .gitignore que sea crea dentro del frontend lo mueves hacia fuera, hacia la carpeta general y en la carpeta frontend eliminas el archivo .git para dejar de ahcer seguimiento a esa carpeta frontend con el comando "rm -rf .git", de esta manera ya no tendremos que hacer seguimiento a la carpeta frontend sino a toda la carpeta en general
* Luego te dirgies a tu carpeta general y ejecutas el comando "git init" para trackear la carpeta frontend y la carpeta backend que crearemos
* Y si quiero ignorar algo dentro de la carpeta frontend puedes hacerlo desde el .gitignore de la carpeta principal o crear otro .gitignore en la carpeta frontend que es lo recomendable
* Luego cualquier paquete que instales dentro de la carpeta general servirá para cualquiera de las carpetas frontend o backend y el node_modules de la carpeta frontend solo servira para esa carpeta nada más, asi que puedes reutuilizar algun paquete general en tu proeycto frontend y no instalarlo otra vez en esa carpeta frontend, asi es como buscan los paquete de forma jerarquica de un proyecto, sino lo encuentra en ese proyecto va subiendo en busca de otros node_modules de carpetas superiores
* De esta manera trabajas de forma mas facil tu sdos proyectos de react y el otro de node y además al final hacemos que todas la apliocación se sirva en un solo puerto, además que en modo desarrollo  y en producción ambas aplicaciones compartan el mismo host o seaw en desarrollo gracias al proxy es como si compartieran el mismo host y en producción por el build y servido en el mismo express funciona en un solo servidor


* El --prefix es para primero ir a esa carpeta y luego ejcutar el comando que le antecede => Ej: **npm start --prefix frontend**
* En la últimas versiones de node de 15 para arriba puedes poner en el package json de node lo siguiente: "type": "module" => debajo de main, y podrás manejar todas las importaciones como si fuera react