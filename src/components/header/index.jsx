import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FiBox, FiBriefcase, FiGithub, FiChevronDown, FiGrid, FiLayers, FiPlus, FiShoppingCart, FiTruck } from "react-icons/fi";
import { useApp } from "../../context/useApp.js";
import styles from "./styles.module.css";

const links = [
    { to: "/", label: "Overview", icon: FiGrid, end: true },
    { to: "/orders", label: "Orders", icon: FiShoppingCart },
    { to: "/inventory", label: "Inventory", icon: FiBox },
    { to: "/procurement", label: "Procurement", icon: FiTruck },
    { to: "/finance", label: "Finance", icon: FiBriefcase },
];

const Header = () => {
    const { openDialog } = useApp();
    const [hiddenPath, setHiddenPath] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [menu, setMenu] = useState(false);
    const createRef = useRef(null);
    const location = useLocation();
    const visible = hiddenPath !== location.pathname;

    useEffect(() => {
        let previous = window.scrollY;
        let ticking = false;
        const update = () => {
            const current = window.scrollY;
            if (current < 24 || current < previous - 5) setHiddenPath("");
            else if (current > previous + 5) setHiddenPath(location.pathname);
            previous = current;
            ticking = false;
        };
        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(update);
                ticking = true;
            }
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [location.pathname]);

    useEffect(() => {
        const closeOnOutside = (event) => { if (!createRef.current?.contains(event.target)) setMenu(false); };
        const closeOnEscape = (event) => { if (event.key === "Escape") setMenu(false); };
        document.addEventListener("pointerdown", closeOnOutside);
        window.addEventListener("keydown", closeOnEscape);
        return () => { document.removeEventListener("pointerdown", closeOnOutside); window.removeEventListener("keydown", closeOnEscape); };
    }, []);

    const openCreate = (type) => {
        setMenu(false);
        openDialog(type);
    };

    return <header className={`${styles.header} ${visible ? "" : styles.hidden}`}>
        <div className={styles.headerInner}>
            <NavLink to="/" className={styles.brand} aria-label="Ledgerly overview" onClick={() => setMenuOpen(false)}>
                <span className={styles.brandMark}><FiLayers aria-hidden="true" /></span>
                <span>ledgerly<span className={styles.brandDot}>.</span></span>
            </NavLink>
            <button className={styles.mobileToggle} type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label={menuOpen ? "Close navigation" : "Open navigation"}><FiChevronDown aria-hidden="true" /></button>
            <nav className={`${styles.navigation} ${menuOpen ? styles.navigationOpen : ""}`} aria-label="Main navigation">
                {links.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} onClick={() => setMenuOpen(false)} className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ""}`}><Icon aria-hidden="true" /><span>{label}</span></NavLink>)}
            </nav>
            <div className={styles.headerActions}>
                <div className={styles.createWrap} ref={createRef}>
                    <button className={styles.createButton} type="button" onClick={() => setMenu((open) => !open)} aria-expanded={menu} aria-haspopup="menu"><FiPlus aria-hidden="true" /><span>New</span><FiChevronDown aria-hidden="true" /></button>
                    {menu && <div className={styles.createMenu} role="menu">
                        <button type="button" role="menuitem" onClick={() => openCreate("order")}><FiShoppingCart aria-hidden="true" /> Sales order</button>
                        <button type="button" role="menuitem" onClick={() => openCreate("purchase")}><FiTruck aria-hidden="true" /> Purchase order</button>
                        <button type="button" role="menuitem" onClick={() => openCreate("item")}><FiBox aria-hidden="true" /> Inventory item</button>
                    </div>}
                </div>
                <a className={styles.repository} href="https://github.com/a2rp/erp-business-operations" target="_blank" rel="noreferrer"><FiGithub aria-hidden="true" /><span>Repository</span></a>
            </div>
        </div>
    </header>;
};

export default Header;


