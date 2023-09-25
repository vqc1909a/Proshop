import {lazy, Suspense} from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import Header from "components/layouts/Header";
import Footer from "components/layouts/Footer";
import Loader from "components/Loader"
import {Container} from "react-bootstrap";

import ProtectedRoutePrivate from "./components/hocs/ProtectedRoutePrivate";
import ProtectedRoutePublic from "./components/hocs/ProtectedRoutePublic";
import ProtectedRouteAdmin from "components/hocs/ProtectedRouteAdmin.js";
import UserAdminScreen from "screens/admin/UserAdminScreen";
import SearchScreen from "screens/SearchScreen";

const HomeScreen =  lazy(() => import(/* webpackChunkName: "HomeScreen" */"screens/HomeScreen"));
const ProductScreen =  lazy(() => import(/* webpackChunkName: "ProductScreen" */"screens/ProductScreen"));
const CartScreen =  lazy(() => import(/* webpackChunkName: "CartScreen" */"screens/CartScreen"));
const LoginScreen =  lazy(() => import(/* webpackChunkName: "LoginScreen" */"screens/LoginScreen"));
const RegisterScreen =  lazy(() => import(/* webpackChunkName: "RegisterScreen" */"screens/RegisterScreen"));
const ProfileScreen =  lazy(() => import(/* webpackChunkName: "ProfileScreen" */"screens/ProfileScreen"));
const ChangePasswordScreen =  lazy(() => import(/* webpackChunkName: "ChangePasswordScreen" */"screens/ChangePasswordScreen"));
const OrderScreen =  lazy(() => import(/* webpackChunkName: "OrderScreen" */"screens/OrderScreen"));
const OrderAdminScreen =  lazy(() => import(/* webpackChunkName: "OrderAdminScreen" */"screens/admin/OrderAdminScreen"));
const ProductAdminScreen =  lazy(() => import(/* webpackChunkName: "OrderAdminScreen" */"screens/admin/ProductAdminScreen"));

//Puede haber mas suspense según sea necesario, no es como la aplicación en Typescript que solo me ejecutaba el Suspense mas cercano o sea el más profundo, pero aqui normal podemos tener el suspense para la pagina completa como primera jeecución y otro suspense para los componentes internos que se ejecutaran despues

const CheckoutScreen = lazy(() => import(/* webpackChunkName: "CheckoutScreen" */"screens/CheckoutScreen"))

//Componentes del Checkout Layout
const Shipping = lazy(() => import(/* webpackChunkName: "Shipping" */ "components/pages/checkout/Shipping"));
const Payment = lazy(() => import(/* webpackChunkName: "Payment" */ "components/pages/checkout/Payment"));
const PlaceOrder = lazy(() => import(/* webpackChunkName: "PlaceOrder" */ "components/pages/checkout/PlaceOrder"));

function App() {
    return (
        <>  
            <Header></Header>
            <main className="py-3">
                <Container>
                    <Routes>
                        <Route path="/" element={<HomeScreen></HomeScreen>}></Route>   
                        <Route path="/search/:keyword" element={<SearchScreen></SearchScreen>}></Route>                        

                        <Route path="/products/:slug" element={<ProductScreen></ProductScreen>}></Route>
                        <Route path="/cart" element={<CartScreen></CartScreen>}></Route>

                        <Route path="/auth" element={<ProtectedRoutePublic />}>
                            <Route path="login" element={<LoginScreen></LoginScreen>}></Route>
                            <Route path="register" element={<RegisterScreen></RegisterScreen>}></Route>
                        </Route>

                        <Route path="/" element={<ProtectedRoutePrivate redirectPath="/auth/login" />}>
                            <Route path="account/profile" element={<ProfileScreen></ProfileScreen>}></Route>
                            <Route path="account/profile/change-password" element={<ChangePasswordScreen></ChangePasswordScreen>}></Route>

                            <Route path="checkout" element={<CheckoutScreen></CheckoutScreen>}>
                                <Route path="shipping-address" element={
                                    <Suspense fallback={<Loader />}>
                                        <Shipping />
                                    </Suspense>}
                                ></Route>

                                <Route path="payment" element={
                                    <Suspense fallback={<Loader />}>
                                        <Payment/>
                                    </Suspense>}
                                ></Route>

                                <Route path="placeorder" element={
                                    <Suspense fallback={<Loader />}>
                                        <PlaceOrder />
                                    </Suspense>}
                                ></Route>

                                <Route path="*" element={
                                    <Suspense fallback={<Loader />}>
                                        <Navigate to="shipping-address" replace></Navigate>
                                    </Suspense>}
                                ></Route>
                            </Route>
                            <Route path="orders/:id" element={<OrderScreen></OrderScreen>}></Route>
                    
                        </Route>

                        {/* Configuración de rutas del Admin */}
                        <Route path="/" element={<ProtectedRouteAdmin redirectPath="/account/profile"/>}>
                            <Route path="admin/orders" element={<OrderAdminScreen></OrderAdminScreen>}></Route>
                            <Route path="admin/products" element={<ProductAdminScreen></ProductAdminScreen>}></Route>
                            <Route path="admin/users" element={<UserAdminScreen></UserAdminScreen>}></Route>
                        </Route>
                       
                        <Route path="*" element={<Navigate to={"/"} replace/>}></Route>
                    </Routes>
                </Container>
            </main>
            <Footer></Footer>
        </>
    );
}

export default App;
