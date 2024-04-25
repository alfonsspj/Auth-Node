1. Intalación de dependencias `npm i`
2. Crear el archivo `.env` con las variables que se encuentran en `.env.template`
3. Crear la carpeta `postgres_data` en la raiz del proyecto
4. Levantar la base de datos en docker `docker-compose up -d postgres`
5. Ver contenedores Activos -- Validar -- verificar que se levanto `docker-compose ps`
    ```bash
    NAME                                IMAGE               COMMAND                  SERVICE             CREATED
    STATUS              PORTS
    dpage/pgadmin4      "/entrypoint.sh"         pgadmin             53 minutes ago  
    Up 8 seconds        443/tcp, 0.0.0.0:5050->80/tcp
   postgres:13         "docker-entrypoint.s…"   postgres            About an hour ago   Up 18 seconds       0.0.0.0:5432->5432/tcp
   
6. Nos muestra dos puertos; uno que corre postgres con el puerto 5432 y el otro puerto 5050 para el navegador.
7. Levantar el gestor gráfico de base de datos: pg-admin `docker-compose up -d pgadmin`
8. `docker ps`
   ```bash
   CONTAINER ID   IMAGE            COMMAND                  CREATED             STATUS          PORTS                           NAMES   
    c12d78a21803   dpage/pgadmin4   "/entrypoint.sh"         About an hour ago   Up 26 minutes   443/tcp, 0.0.0.0:5050->80/tcp   curso-nodejs-auth-main-pgadmin-1
    ee059972ccc6   postgres:13      "docker-entrypoint.s…"   About an hour ago   Up 26 minutes   0.0.0.0:5432->5432/tcp          curso-nodejs-auth-main-postgres-1
9. `docker inspect <id_del_contenedor>`, ej `docker inspect ee059972ccc6` luego nos aparece ` "IPAddress": "172.22.0.2" ` entre otras cosas. 
9.  abrir pgadmin en el navegador `localhost:5050`, logear con las credenciales que figuran en `docker-compose.yml`, las cuales son: `admin@mail.com : root`
10. Correr la migración `npm run migrations:run`
11. 