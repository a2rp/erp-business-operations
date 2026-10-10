import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Loading from "./components/loading/index.jsx";

const Overview = lazy(() => import("./pages/overview/index.jsx"));
const Orders = lazy(() => import("./pages/orders/index.jsx"));
const Inventory = lazy(() => import("./pages/inventory/index.jsx"));
const Procurement = lazy(() => import("./pages/procurement/index.jsx"));
const Finance = lazy(() => import("./pages/finance/index.jsx"));
const NotFound = lazy(() => import("./pages/notFound/index.jsx"));

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [pathname]);
    return null;
};

const AppRoutes = () => {
    const { pathname } = useLocation();
    return (
        <>
            <ScrollToTop />
            <Suspense key={pathname} fallback={<Loading />}>
                <Routes>
                    <Route path="/" element={<Overview />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/procurement" element={<Procurement />} />
                    <Route path="/finance" element={<Finance />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </>
    );
};

export default AppRoutes;
