Clase #3: Tienda en línea: instalación del proyecto 3/20 🔧
 

Continuando con el proyecto: 📂
 

GitHub: ⬇️
 

Entramos a la página de GitHub donde está el proyecto , en la pestaña verde donde dice Code, damos click y aparece el enlace que vamos a necesitar para clonar el proyecto desde consola copiamos esa dirección. Abrimos la terminal y nos situamos en la carpeta donde queremos que esté el proyecto, y después de git clone, se pega la dirección copiada de GitHub:
git clone https://github.com/platzi/curso-nodejs-auth.git my-store-auth

 

Damos ENTER, se descarga todo el repositorio. Una vez clonado el repositorio, entramos a la carpeta del proyecto: cd my-store-data
Instalamos las independencias con: npm i  
Terminal y VSC: 💻
 

Abrimos el proyecto VSC con: code .
Abrimos el archivo .env y comprobamos que tenga la variable de entorno:

PORT=3000
DATABASE_URL=postgres://nico:admin123@localhost:5432/my_store
 

También comprobamos que exista la carpeta postgres_data si no está la creamos.
Vamos a la terminal y levantamos la Base de Datos con Docker, ejecutamos: docker-compose up -d postgres Debe salir:

Starting my-store-auth_postgres_1 ... done
 

Luego se levanta el gestor de gráfico pgAdmin ejecutando: docker-compose up -d pgadmin Debe salir:

Starting my-store-auth_pgadmin_1 ... done
 

Para saber si realmente está corriendo docker (inspecciona que cosas están corriendo), ejecutamos: docker-compose ps
Nos muestra dos puertos; uno que corre postgres con el puerto 5432 y el otro puerto 5050 para el navegador.  
pgAdmin: ☁️
 

Vamos al navegador y colocamos en la dirección: localhost:5050
Aparece la interfaz de pgAdmin, ingresamos las credenciales que tenemos en el archivo docker-compose.yml: user: admin@mail.com y para el password: root  
Para poder ver la Base de Datos en pgAdmin, debemos realizar lo siguiente:
Con las credenciales entramos al dashboard del servidor, seleccionamos en el panel izquierdo a Servers, luego en el menú superior, le damos en Object, en el menú seleccionamos Register, luego en Server, nos sale un cuadro, colocamos el título: MyStore, luego en la pestaña de Connection se debe colocar la ip del servidor.
Para conocer la ip, vamos a la terminal y ejecutamos: docker ps
En el recuadro, aparece el id del contenedor, justo antes que dice postgres13, luego ejecutamos: docker inspect id_del_contenedor.
Una vez ejecutado el docker inspect, sale la información y nos aparece la ip, en mi caso salió: "IPAddress": "172.18.0.2". Ésta la colocamos en el cuadro en pgAdmin que dice host name: 172.18.0.2, en Maintenance database: my_store, en Username: nico, en el Password: admin123, activamos la casilla de Save Password, luego le damos en el botón Save.  
En la terminal corremos la migración con: npm run migrations:run
Recargamos la página de pgAdmin y en el panel izquierdo, debe salir la pestaña de Servers, al desplegar dandole click, sale la pestaña de MyStore, al dar click, se despliega y aparece Databases, al dar click, se selecciona my_store, dentro de Schemas > public > Tables deben aparecer las tablas de la base de datos como categories, customers, orders, order_products, products y users.  
Insomnia: 💾
 

Vamos a la terminal para levantar nuestro proyecto y corremos: npm run dev
No debe haber errores y debe estar trabajando en el puerto 3000: Mi port 3000
Vamos a Insomnia, vamos al método GET de categories y en la dirección consultamos: http://localhost:3000/api/v1/categories
En el lado derecho debe salir 200 OK con un array vacío porque no se ha creado aún categorías. Para crear una categoría, vamos al método POST, en la dirección enviamos: http://localhost:3000/api/v1/categories Y en el JSON:

{
	"name": "Category 1",
	"image": "http: //placeimg.com/640/480"
}
  En la salida debe estar el código 200 Created


{
	"createdAt": "2023-01-18T02:54:54.341Z",
	"id": 1,
	"name": "Category 1",
	"image": "http: //placeimg.com/640/480"
}
  Si consultamos el GET de categories, debe salir la categoría recién creada.   En Insomnia podemos configurar las variables de entorno para distintos formatos, por ejemplo desarrollo y producción, en el panel izquierdo, le damos donde sale No Enviroment y luego en Manage Enviroments, dentro agregamos con el símbolo de más “+” que sale en el panel izquierdo de Sub Enviroments, editamos el nombre del nuevo Enviroment (el título al centro del cuadro) y colocamos Dev, en las líneas de código se agrega:


{
	"API_URL": "http: //localhost:3000"
}
  Del lado derecho, arriba, se puede fijar un color, en éste caso seleccionamos el azul.   Agregamos otro Enviroment para producción, lo llamamos Prod y agregamos las líneas de código:


{
	"API_URL": "https: //api.escuelajs.co"
}
  El color que se le asignó fue el rojo.   Le damos en el botón Done que está en la esquina inferior derecha.   Cuando volvemos de nuevo donde salen las carpetas de categories, etc, podemos elegir en No Enviroment: tanto Dev o Prod, para que funcione por ejemplo en GET de categories, la dirección que teníamos: http://localhost:3000/api/v1/categories la cambiamos por: _.API_URL /api/v1/categories   De modo que _.API_URL sustituirá la dirección de acuerdo a Dev para localhost y Prod para la api de la web.   Para comprobar que todo marcha bien, hacemos consulta tanto en desarrollo como en producción.  

Final de la clase: ⌛️
  Para matar el proceso del run dev, en la terminal presionamos las teclas: CTRL + C