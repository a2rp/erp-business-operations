import { FiArrowDownRight, FiArrowRight, FiArrowUpRight, FiBox, FiCheckCircle, FiClock, FiPlus, FiShoppingCart, FiTrendingUp, FiTruck, FiAlertCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useApp } from "../../context/useApp.js";
import { money, orderTotal, publicAsset } from "../../data/seed.js";
import styles from "./styles.module.css";

const Overview = () => {
    const { items, orders, purchases, openDialog, receivePurchase } = useApp();
    const openOrders = orders.filter((order) => order.status !== "Shipped");
    const pendingValue = openOrders.reduce((total, order) => total + orderTotal(order), 0);
    const lowStock = items.filter((item) => item.stock <= item.reorder);
    const inbound = purchases.filter((purchase) => purchase.status !== "Received");
    const paidThisMonth = orders.filter((order) => order.invoiceStatus === "Paid").reduce((total, order) => total + orderTotal(order), 0);
    const stages = ["Processing", "Awaiting payment", "Ready to ship", "Shipped"];

    return <div className={styles.page}>
        <section className={styles.welcome}>
            <div className={styles.welcomeCopy}>
                <span className={styles.date}><FiClock aria-hidden="true" /> Operations desk · Saturday, October 10</span>
                <h1>Everything in motion.</h1>
                <p>Orders, stock, and purchasing in one clear view.</p>
                <button type="button" className={styles.welcomeButton} onClick={() => openDialog("order")}><FiPlus aria-hidden="true" /> Create sales order</button>
            </div>
            <div className={styles.welcomeImage} role="img" aria-label="Shipping boxes and label printer ready for fulfillment">
                <img src={publicAsset("assets/fulfillment-labels.jpg")} alt="Shipping boxes and a thermal label printer in a fulfillment area" />
                <div className={styles.imageNote}><FiTruck aria-hidden="true" /><span><strong>Fulfillment, connected</strong><small>From order to doorstep</small></span><FiArrowUpRight aria-hidden="true" /></div>
            </div>
        </section>

        <section className={styles.metrics} aria-label="Business metrics">
            <Metric icon={FiShoppingCart} label="Open sales orders" value={openOrders.length} detail={`${orders.length} orders in the workspace`} trend="Orders" to="/orders" />
            <Metric icon={FiTrendingUp} label="Open order value" value={money(pendingValue)} detail={`${orders.filter((order) => order.invoiceStatus === "Open").length} invoices to collect`} trend="Finance" to="/finance" />
            <Metric icon={FiAlertCircle} label="Items to reorder" value={lowStock.length} detail={lowStock.length ? `${lowStock[0].name} needs attention` : "Stock levels look healthy"} trend="Inventory" to="/inventory" warn={lowStock.length > 0} />
            <Metric icon={FiTruck} label="Inbound purchase orders" value={inbound.length} detail={`${inbound.reduce((sum, purchase) => sum + purchase.quantity, 0)} units expected`} trend="Procurement" to="/procurement" />
        </section>

        <section className={styles.workGrid}>
            <article className={styles.panel}>
                <div className={styles.panelHeading}><div><h2>Order flow</h2><p>Movement through the fulfillment cycle</p></div><Link to="/orders">All orders <FiArrowUpRight aria-hidden="true" /></Link></div>
                <div className={styles.flowTotal}><strong>{openOrders.length} <span>open orders</span></strong><span className={styles.flowValue}>{money(pendingValue)} in progress</span></div>
                <div className={styles.flowList}>{stages.map((stage) => {
                    const count = orders.filter((order) => order.status === stage).length;
                    const percent = orders.length ? Math.max(3, count / orders.length * 100) : 0;
                    return <div className={styles.flowRow} key={stage}><span>{stage}</span><div className={styles.track}><span className={styles[`stage${stage.replaceAll(" ", "")}`]} style={{ width: `${percent}%` }} /></div><strong>{count}</strong></div>;
                })}</div>
                <div className={styles.panelFoot}><span><i /> Live session data</span><Link to="/orders">Manage orders <FiArrowRight aria-hidden="true" /></Link></div>
            </article>

            <article className={`${styles.panel} ${styles.attention}`}>
                <div className={styles.panelHeading}><div><h2>Needs a look</h2><p>Keep the next handoff moving</p></div><span className={styles.attentionCount}>{lowStock.length + inbound.filter((purchase) => purchase.status === "Arriving today").length}</span></div>
                {lowStock.length === 0 && !inbound.length && <div className={styles.allClear}><FiCheckCircle aria-hidden="true" /><span>All caught up. Nothing needs attention right now.</span></div>}
                {lowStock.slice(0, 2).map((item) => <div className={styles.attentionRow} key={item.id}><span className={styles.attentionIcon}><FiBox aria-hidden="true" /></span><span><strong>{item.name}</strong><small>{item.stock} {item.unit} on hand · reorder at {item.reorder}</small></span><Link to="/inventory" aria-label={`View ${item.name} in inventory`}><FiArrowUpRight aria-hidden="true" /></Link></div>)}
                {inbound.filter((purchase) => purchase.status === "Arriving today").map((purchase) => <div className={styles.attentionRow} key={purchase.id}><span className={`${styles.attentionIcon} ${styles.truck}`}><FiTruck aria-hidden="true" /></span><span><strong>{purchase.vendor}</strong><small>{purchase.quantity} {purchase.itemName} · arriving today</small></span><button type="button" onClick={() => receivePurchase(purchase.id)} aria-label={`Receive purchase ${purchase.id}`}><FiArrowDownRight aria-hidden="true" /></button></div>)}
                <Link className={styles.attentionLink} to="/procurement">Review incoming stock <FiArrowRight aria-hidden="true" /></Link>
            </article>
        </section>

        <section className={styles.bottomGrid}>
            <article className={styles.quickPanel}>
                <div className={styles.panelHeading}><div><h2>Workspaces</h2><p>Move between connected operations</p></div></div>
                <div className={styles.workspaceGrid}>
                    <Workspace to="/orders" icon={FiShoppingCart} label="Sales orders" detail={`${openOrders.length} need fulfillment`} />
                    <Workspace to="/inventory" icon={FiBox} label="Inventory" detail={`${items.length} active SKUs`} />
                    <Workspace to="/procurement" icon={FiTruck} label="Procurement" detail={`${inbound.length} inbound POs`} />
                    <Workspace to="/finance" icon={FiTrendingUp} label="Finance" detail={`${money(paidThisMonth)} recorded paid`} />
                </div>
            </article>
            <article className={styles.imagePanel}>
                <img src={publicAsset("assets/warehouse-packaging.jpg")} alt="Boxes and packing supplies organized for warehouse fulfillment" />
                <div className={styles.imageOverlay}><span>Stockroom snapshot</span><strong>{items.reduce((sum, item) => sum + item.stock, 0).toLocaleString()} units tracked across {items.length} SKUs</strong><Link to="/inventory">Open inventory <FiArrowUpRight aria-hidden="true" /></Link></div>
            </article>
        </section>
    </div>;
};

const Metric = ({ icon: Icon, label, value, detail, trend, to, warn }) => <Link className={`${styles.metric} ${warn ? styles.metricWarn : ""}`} to={to}><span className={styles.metricIcon}><Icon aria-hidden="true" /></span><span className={styles.metricCopy}><span>{label}</span><strong>{value}</strong><small>{detail}</small></span><span className={styles.metricLink}>{trend}<FiArrowUpRight aria-hidden="true" /></span></Link>;
const Workspace = ({ to, icon: Icon, label, detail }) => <Link className={styles.workspaceLink} to={to}><span><Icon aria-hidden="true" /></span><strong>{label}</strong><small>{detail}</small><FiArrowUpRight className={styles.workspaceArrow} aria-hidden="true" /></Link>;

export default Overview;

