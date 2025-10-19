# Initial Spec Idea

## User's Initial Description
La feature que deseo crear es relacionada a la seccion de clientes, cuando se evalua el rol de user como "CLIENT"  se reenvia a una vista especifica, que es la vista de clientes, quiero que esta feature sea orientada a eso, clientes, la vista de clientes, primero empezando por cambiar los estilos al que ya esta presenta en todo el proyecto, por ejemplo las vistas de login, register, admin, etc.

Quiero que prestes suprema atencion a lo que es la data que se pinta, porque hasta ahora todo es dummy data, es decir, data estatica y quiero que ya se consuma de los endpoints de existe actualmente en @api/ , analiza todos los endpoints e identifica cuales usar, como usarlo y si hace falta crearlo siguiendo el esquema standar que esta en los demas endpooints/routes. 

Todos los endpoints son publicos, asi que no quiero que trabajes nada de autenticacion, lo que si quiero que hagas y no se hace, es que para algunas consultas necesitas enviar el id del user "sessionado" entonces quiero que posterior al login o register, la data que retorna las apis, se guarde en locaStorage y se lea esa info, en este caso el id del user y si hace falta algo mas, tambien estaria disponible.

Quiero que ademas a la hora de crear UI uses shadcn, usando el mcp que ya esta configurado en el proyecto, para los componentes.

Quiero que ademas haya un boton de logout el cual solo redireccione al login, y borre del localStorage los datos del user, la form ade evaluar la session sera definiendo si existe localStorage de user, si hay manda al dashboard del respectivo cliente o admin.
@(authenticated)/ 

## Metadata
- Date Created: 2025-10-19
- Spec Name: client-dashboard-view
- Spec Path: agent-os/specs/2025-10-19-client-dashboard-view
