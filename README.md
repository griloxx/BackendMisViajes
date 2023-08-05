README

En este proyecto hemos creado una API para crear una base de datos para una página en la que se podrán introducir Viajes recomendados. Y se llama
Viajes recomendados.

DESCRIPCIÓN

Implementar una API que permita gestionar un portal donde los usuarios puedan publicar
recomendaciones de viaje de sitios o experiencias poco conocidas.

Las consultar y registros en la API se han dividido en dos tipos:

- Las anónimas, esto se refiere a todos los usuarios no registrados, y que podrán hacer lo siguiente:

●Buscar recomendaciones por lugar, categoría; donde al realizar la búsqueda tendrá dos tipos de respuesta, una en la que coincidan ambas peticiones, si hubiera alguna entrada que cumpla esa condición, o bien que cumpla una de las peticiones, en el caso de lugar no será necerasio que escriba el nombre completo del lugar si hay algún tipo de coincidencia, tendrá resultado, además las peticiones de busqueda de recomendaciones se mostrarán de manera descendente según fecha y de tres en tres.

●Poder ordenar los resultados de búsqueda por votos, las peticiones de busqueda tienen la opción de poder aparecer por el número de votaciones obtenidas, aparecerán primero las más votadas.

●Ver detalle de una recomendación, el usuario no registrado puede ver cualquier recomendación y como hemos visto antes buscar por lugar y categoría en orden de fecha o por los más votados.

●Login (con email y password), al ususario anónimo se le da la opción de poder logearse introduciendo email y contraseña, en el caso de estar registrado, sino lo estuviera se le ofrecerá la oportunidad de poder registrarse.

●Registro (nombre, email y password), los ususarios anónimos pueden registrarse en la aplicación y deberá introducir un nombre, un email(válido) y una password.

- En el caso de usuarios ya registrados podrán realizar además de todas las tareas de los usuarios anónimos, excepto la de volver a registrarse, las tareas siguientes:

●Publicar recomendaciones (título, categoría, lugar, entradilla, texto, foto), en la publicación de recomendaciones, estará obligado a introducir un título, una categoría, el lugar, el texto donde tendrá que realizar los comentarios que desee sobre dicha recomendación, y al menos una foto, estos campos son todos obligatorios, al realizar una publicación de forma automática se generará la entradilla(fecha de entrada), y un id, para identificar dicha entrada.

●Votar recomendaciones de otros usuarios, el usuario registrado podrá votar las recomendaciones de otros usuarios, esos votos iran redireccionados a la base de datos a través de la id que lo identifica.

Además de todo esto, que era lo que se nos pedía como trabajo obligatorio, hemos realizado otras operaciones que implementan lo que los usuarios regirtrados pueden llegar a hacer:

○Gestión del perfil (con posibilidad de añadir a los campos de registro una foto de perfil), hemos creado la opción en la que el usuario registrado puede realizar modificaciones en su perfil, tales como: la contraseña, y además podrá añadir/cambiar la foto para crear su avatar.

○Borrar sus recomendaciones, el usuario registrado tiene la opción de poder borrar las entradas de recomendaciones que haya realizado en cualquier momento.

○Publicar comentarios en las recomendaciones, además podrá publicar comentarios en las entradas de recomendaciones, para ampliar información o bien para comentar cualquier cosa acerca de la misma.

LOS ENDPOINTS UTILIZADOS SON LOS SIGUIENTES:

Listar entradas:

- Listar entradas ordenando o no por votos, buscar por lugar y/o categoría con opción de ordenar por votos y consultar una entrada por Id:

  - GET /entradas : Para listar entradas.
  - GET /entradas/consulta : Para buscar entradas por lugar y/o categoría.
  - GET /entradas/:id : Consulta por id de entrada de recomendación.

Login, registro, validar registro y modificar perfil:

- Login, registro, validar registro y modificar perfil con opción de cambiar la contraseña y la foto de perfil:

  - POST /usuarios/registro : Para crear un nuevo usuario.
  - GET /usuarios/validación/:codigoRegistro : Para validar el registro.
  - POST /usuarios/login : Para realizar el login (loguearse).
  - PUT /usuarios/perfil : Para modificar el perfil del usuario registrado.

Entradas de viajes:

- Crear entradas, Insertar comentarios en las entradas, votar entradas y opcion de borrar una entrada:

  - POST /entradas/crearentrada : Para crear nuevas entradas de recomendaciones.
  - POST /entradas/comentar : Para realizar comentarios sobre las entradas de las recomendaciones.
  - POST /entradas/votar : Para realizar las votaciones sobre las recomendaciones de viaje.
  - DEL /entradas/borrar : Para borrar las entradas de alguna recomendación de viaje, sólo puede borrarla un usuario registrado.
