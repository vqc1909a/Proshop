import React, {Suspense} from "react";
import ReactDOM from "react-dom";
import "./bootstrap.min.css";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "redux/store";

// Se espera que los desarrolladores que se integran con PayPal agreguen el JS SDK <script> a un sitio web y luego representen componentes como los botones de PayPal después de que se cargue el script. Esta arquitectura funciona muy bien para sitios web simples, pero puede resultar desafiante al crear aplicaciones de una sola página.

// react-paypal-js proporciona una solución a los desarrolladores para abstraer las complejidades relacionadas con la carga del SDK de JS. Aplica las mejores prácticas de forma predeterminada para que los compradores obtengan la mejor experiencia de usuario posible.

//Componente del SDK Paypal
// * PayPalButtons
// * PayPalMarks
// * PayPalMessages
// * PayPalHostedFields
// * BraintreePayPalButtons
import {PayPalScriptProvider} from "@paypal/react-paypal-js";
import Fallback from "components/layouts/Fallback";

// const initialOptions = {
//     clientId: "test",
//     currency: "USD",
//     intent: "capture",
// };

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			{/*
      
      This prop is set to false by default since we usually know all the sdk script params upfront and want to load the script right away so components like <PayPalButtons /> render immediately.

      This prop can be set to true to prevent loading the JS SDK script when the PayPalScriptProvider renders. Use deferLoading={true} initially and then dispatch an action later on in the app's life cycle to load the sdk script.
      
      Cuando estableces deferLoading={true}, estás indicando que el script de PayPal no se cargará inmediatamente cuando el componente PayPalScriptProvider se monte en el árbol de componentes. En cambio, el script se cargará de manera diferida en el momento en que sea necesario, es decir, cuando algún otro componente de tu aplicación requiera el uso de funcionalidades de PayPal que dependan del script.

      Esto puede ser útil para optimizar el rendimiento de tu aplicación, ya que el script de PayPal es un recurso externo y puede afectar el tiempo de carga inicial. Al diferir su carga hasta que sea necesario, puedes evitar una carga innecesaria si no se utiliza la funcionalidad de PayPal en todas las partes de tu aplicación. */}
			<PayPalScriptProvider deferLoading={true} options={{}}>
				<Suspense fallback={<Fallback />}>
					<BrowserRouter>
						<App />
					</BrowserRouter>
				</Suspense>
			</PayPalScriptProvider>
		</Provider>
	</React.StrictMode>,
	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
