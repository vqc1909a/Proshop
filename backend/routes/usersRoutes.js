import express from "express";
import * as USERS_CONTROLLER from "../controllers/usersController.js";
import * as USERS_VALIDATORS from "../validators/usersValidators.js";

import * as MIDDLEWARES from "../middlewares/index.js";

const Router = express();

// La elección depende de tus necesidades específicas y de cómo desees gestionar la seguridad y el acceso en tu sitio web. En WordPress, la opción de tener varios administradores con acceso a todo es común porque es más sencilla y puede ser adecuada para sitios web más pequeños o donde se confía plenamente en los administradores.

// Sin embargo, en sitios web más grandes o donde la gestión de roles y la seguridad son de mayor preocupación, es más común utilizar la primera opción con un superadministrador y administradores con permisos más limitados. Esto permite una gestión más precisa y controlada de los usuarios y los datos del sitio.

// En sitios web de comercio electrónico a gran escala, como Saga Falabella o Tiendas Claro, la práctica común es implementar una estructura de administración de usuarios y roles que combine elementos de ambas opciones: tener un superadministrador con acceso a todo y varios administradores con acceso a áreas específicas. Esta estructura permite un equilibrio entre la gestión centralizada y la seguridad, al mismo tiempo que se facilita la colaboración y la eficiencia en la gestión del sitio.

// A continuación, te presento una estructura típica que podría utilizarse en un sitio de comercio electrónico a gran escala:

// Superadministrador (Superuser):

// Tiene acceso completo a todas las áreas del sitio web.
// Puede realizar cambios globales en la configuración, productos, precios y políticas.
// Gestiona roles y permisos de otros administradores.
// Supervisa la seguridad y el cumplimiento normativo.
// Administradores de Categoría/Productos:

// Cada administrador se encarga de una categoría o un conjunto específico de productos.
// Tienen acceso para agregar, modificar y eliminar productos en su área designada.
// Pueden ajustar precios y disponibilidad de productos dentro de su categoría.
// Se encargan de la gestión de contenido relacionado con sus productos.
// Administradores de Ventas/Clientes:

// Gestionan pedidos, clientes y ventas.
// Pueden atender consultas y problemas de clientes.
// Supervisan el proceso de envío y entrega de productos.
// Administradores de Marketing/Promociones:

// Controlan las campañas de marketing, promociones y publicidad.
// Pueden realizar cambios en la página de inicio, banners promocionales y contenido relacionado con promociones.
// Administradores de Seguridad y TI:

// Se encargan de la seguridad del sitio, incluyendo la detección y respuesta a amenazas.
// Gestionan las actualizaciones de software y la infraestructura técnica.
// Soporte Técnico:

// Proporciona asistencia técnica a los usuarios y soluciona problemas técnicos.
// Puede realizar acciones de resolución de problemas en cuentas de usuarios cuando sea necesario.
// Esta estructura permite que diferentes equipos se enfoquen en áreas específicas del negocio y reduce el riesgo de errores accidentales. También facilita la colaboración y la eficiencia, ya que cada administrador tiene un conjunto de responsabilidades claras.

Router.route("/admin").get(MIDDLEWARES.verifyAuthentication, MIDDLEWARES.adminMiddleware, USERS_CONTROLLER.getUsers);
Router.route("/admin").post(MIDDLEWARES.verifyAuthentication, MIDDLEWARES.adminMiddleware, USERS_CONTROLLER.createUser);
Router.route("/admin/:id").get(MIDDLEWARES.verifyAuthentication, MIDDLEWARES.adminMiddleware, USERS_CONTROLLER.getUserById);
Router.route("/admin/:id").put(MIDDLEWARES.verifyAuthentication, MIDDLEWARES.adminMiddleware, USERS_CONTROLLER.updateUser);
Router.route("/admin/:id").delete(MIDDLEWARES.verifyAuthentication, MIDDLEWARES.adminMiddleware, USERS_CONTROLLER.deleteUser);


export default Router;
