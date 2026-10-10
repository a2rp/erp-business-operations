import { useMemo, useState } from "react";
import { FiDownload, FiCalendar, FiCheck, FiPackage, FiPlus, FiSearch, FiTrash2, FiTruck } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useApp } from "../../context/useApp.js";
import { money, publicAsset } from "../../data/seed.js";
import styles from "./styles.module.css";

const Procurement = () => {
    const { purchases, items, openDialog, receivePurchase, deletePurchase } = useApp();
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("All statuses");
    const filtered = useMemo(() => purchases.filter((purchase) => `${purchase.id} ${purchase.vendor} ${purchase.itemName}`.toLowerCase().includes(query.toLowerCase()) && (status === "All statuses" || purchase.status === status)), [purchases, query, status]);
    const inbound = purchases.filter((purchase) => purchase.status !== "Received");
    const inboundValue = inbound.reduce((sum, purchase) => sum + purchase.amount, 0);
    const arriving = inbound.filter((purchase) => purchase.status === "Arriving today");

    const removePurchase = (purchase) => openDialog("confirm", { title: `Remove ${purchase.id}?`, message: `This removes the ${purchase.vendor} purchase order for ${purchase.quantity} ${purchase.itemName}. ${purchase.status === "Received" ? "Received units remain in inventory." : "Stock is not changed."}`, confirmLabel: "Remove purchase order", onConfirm: () => deletePurchase(purchase.id) });

    return <div className={styles.page}>
        <div className={styles.heading}><div><div className={styles.breadcrumb}>Operations <span>/</span> Procurement</div><h1>Procurement</h1><p>Keep inbound stock aligned with reorder needs and supplier timelines.</p></div><button className={styles.primaryButton} type="button" onClick={() => openDialog("purchase")}><FiPlus aria-hidden="true" /> New purchase order</button></div>
        <section className={styles.inboundHero}><div className={styles.inboundCopy}><span className={styles.kicker}><FiTruck aria-hidden="true" /> Inbound planning</span><h2>Restock before the shelf is empty.</h2><p>Orders received here update inventory and the available quantity for sales.</p><div className={styles.inboundStats}><div><strong>{inbound.length}</strong><span>open deliveries</span></div><div><strong>{money(inboundValue)}</strong><span>committed spend</span></div><div><strong>{arriving.length}</strong><span>arriving today</span></div></div></div><div className={styles.inboundImage}><img src={publicAsset("assets/warehouse-packaging.jpg")} alt="Warehouse cartons and packing supplies prepared for receiving" /><span><FiPackage aria-hidden="true" /> Receiving updates stock automatically</span></div></section>
        {arriving.length > 0 && <section className={styles.arrivalNotice}><span><FiCalendar aria-hidden="true" /></span><div><strong>{arriving.length} delivery{arriving.length > 1 ? "ies" : ""} expected today</strong><small>{arriving.map((purchase) => purchase.vendor).join("  /  ")}</small></div><button type="button" onClick={() => setStatus("Arriving today")}>View arrivals</button></section>}
        <section className={styles.purchasePanel}>
            <div className={styles.panelHeading}><div><h2>Purchase orders</h2><p>Supplier commitments and receiving status</p></div><span className={styles.countPill}>{filtered.length} records</span></div>
            <div className={styles.toolbar}><div className={styles.search}><FiSearch aria-hidden="true" /><input aria-label="Search purchase orders" placeholder="Search supplier, PO, or item" value={query} onChange={(event) => setQuery(event.target.value)} />{query && <button type="button" aria-label="Clear search" onClick={() => setQuery("")}>&times;</button>}</div><label className={styles.statusFilter}><span>Status</span><select aria-label="Filter purchase orders by status" value={status} onChange={(event) => setStatus(event.target.value)}><option>All statuses</option><option>Ordered</option><option>In transit</option><option>Arriving today</option><option>Received</option></select></label></div>
            <div className={styles.tableWrap}><table><thead><tr><th>Purchase order</th><th>Supplier</th><th>Item</th><th>Expected</th><th>Quantity</th><th>Amount</th><th>Status</th><th>Receive</th><th><span className={styles.srOnly}>Remove</span></th></tr></thead><tbody>
                {filtered.map((purchase) => <tr key={purchase.id}><td><strong>{purchase.id}</strong><small>Placed {purchase.ordered}</small></td><td>{purchase.vendor}</td><td>{purchase.itemName}</td><td>{purchase.expected}</td><td>{purchase.quantity}</td><td className={styles.amount}>{money(purchase.amount)}</td><td><span className={`${styles.status} ${styles[purchase.status.replaceAll(" ", "")]}`}><i />{purchase.status}</span></td><td>{purchase.status === "Received" ? <span className={styles.received}><FiCheck aria-hidden="true" /> Received</span> : <button className={styles.receiveButton} type="button" onClick={() => receivePurchase(purchase.id)}><FiDownload aria-hidden="true" /> Receive</button>}</td><td><button className={styles.removeButton} type="button" aria-label={`Remove ${purchase.id}`} onClick={() => removePurchase(purchase)}><FiTrash2 aria-hidden="true" /></button></td></tr>)}
            </tbody></table></div>
            {filtered.length === 0 && <div className={styles.empty}><FiTruck aria-hidden="true" /><strong>No purchase orders match</strong><span>Change your search or status filter.</span><button type="button" onClick={() => { setQuery(""); setStatus("All statuses"); }}>Clear filters</button></div>}
            <div className={styles.supplierNote}><span><FiPackage aria-hidden="true" /></span><p><strong>{items.filter((item) => item.stock <= item.reorder).length} items are at their reorder point.</strong> Use inventory to see the exact stock gap and create a replenishment order.</p><Link to="/inventory">Review inventory</Link></div>
        </section>
    </div>;
};

export default Procurement;



