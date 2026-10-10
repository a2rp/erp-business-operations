import { useMemo, useState } from "react";
import { FiDownload, FiEdit2, FiEye, FiFilter, FiPlus, FiSearch, FiShoppingCart, FiTrash2, FiTrendingUp } from "react-icons/fi";
import { useApp } from "../../context/useApp.js";
import { money, orderTotal } from "../../data/seed.js";
import styles from "./styles.module.css";

const statuses = ["All statuses", "Processing", "Awaiting payment", "Ready to ship", "Shipped"];
const Orders = () => {
    const { orders, openDialog, updateOrder, deleteOrder, notify } = useApp();
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All statuses");
    const [sort, setSort] = useState("newest");
    const filtered = useMemo(() => orders.filter((order) => {
        const match = `${order.id} ${order.customer} ${order.itemName}`.toLowerCase().includes(query.toLowerCase());
        return match && (statusFilter === "All statuses" || order.status === statusFilter);
    }).sort((a, b) => sort === "newest" ? b.date.localeCompare(a.date) || b.id.localeCompare(a.id) : a.date.localeCompare(b.date)), [orders, query, statusFilter, sort]);
    const openValue = orders.filter((order) => order.status !== "Shipped").reduce((sum, order) => sum + orderTotal(order), 0);

    const removeOrder = (order) => openDialog("confirm", { title: `Remove ${order.id}?`, message: `This removes the sales order for ${order.customer} and releases its open stock allocation. The action cannot be undone.`, confirmLabel: "Remove order", onConfirm: () => deleteOrder(order.id) });
    const exportOrders = () => {
        const rows = [["Order", "Customer", "Email", "Item", "Quantity", "Total", "Status", "Date"], ...filtered.map((order) => [order.id, order.customer, order.email, order.itemName, order.quantity, orderTotal(order), order.status, order.date])];
        const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
        const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
        const anchor = document.createElement("a"); anchor.href = url; anchor.download = "ledgerly-sales-orders.csv"; anchor.click(); URL.revokeObjectURL(url);
    };

    return <div className={styles.page}>
        <div className={styles.heading}><div><div className={styles.breadcrumb}>Operations <span>/</span> Orders</div><h1>Sales orders</h1><p>Track customer demand from allocation through fulfillment.</p></div><div className={styles.headingActions}><button className={styles.outlineButton} type="button" onClick={exportOrders}><FiDownload aria-hidden="true" /> Export CSV</button><button className={styles.primaryButton} type="button" onClick={() => openDialog("order")}><FiPlus aria-hidden="true" /> New order</button></div></div>
        <section className={styles.summary}>
            <div><span className={styles.summaryIcon}><FiShoppingCart aria-hidden="true" /></span><span><small>Open orders</small><strong>{orders.filter((order) => order.status !== "Shipped").length}</strong></span></div>
            <div><span className={styles.summaryIcon}><FiTrendingUp aria-hidden="true" /></span><span><small>Open order value</small><strong>{money(openValue)}</strong></span></div>
            <div><span className={styles.summaryIcon}><FiFilter aria-hidden="true" /></span><span><small>Ready to ship</small><strong>{orders.filter((order) => order.status === "Ready to ship").length}</strong></span></div>
        </section>
        <section className={styles.tablePanel}>
            <div className={styles.toolbar}><div className={styles.search}><FiSearch aria-hidden="true" /><input aria-label="Search sales orders" placeholder="Search orders, customers, items" value={query} onChange={(event) => setQuery(event.target.value)} />{query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search">×</button>}</div><label className={styles.filter}><span>Status</span><select aria-label="Filter sales orders by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label><label className={styles.filter}><span>Sort</span><select aria-label="Sort sales orders" value={sort} onChange={(event) => setSort(event.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></label><span className={styles.resultCount}>{filtered.length} orders</span></div>
            <div className={styles.tableWrap}><table><thead><tr><th>Order</th><th>Customer</th><th>Line item</th><th>Created</th><th>Total</th><th>Order status</th><th><span className={styles.srOnly}>Actions</span></th></tr></thead><tbody>
                {filtered.map((order) => <tr key={order.id}>
                    <td><button className={styles.orderButton} type="button" onClick={() => openDialog("detail", { order })}>{order.id}<small>{order.quantity} units</small></button></td>
                    <td><strong>{order.customer}</strong><small>{order.email}</small></td>
                    <td><span>{order.itemName}</span></td><td>{order.date}</td><td className={styles.amount}>{money(orderTotal(order))}</td>
                    <td><label className={styles.statusSelect}><span className={`${styles.statusDot} ${styles[order.status.replaceAll(" ", "")]}`} /><select value={order.status} disabled={order.status === "Shipped"} aria-label={`Change status for ${order.id}`} onChange={(event) => { const result = updateOrder(order.id, { status: event.target.value }); if (result?.error) notify(result.error, "error"); }}><option>Processing</option><option>Awaiting payment</option><option>Ready to ship</option><option>Shipped</option></select></label></td>
                    <td><div className={styles.rowActions}><button type="button" aria-label={`View ${order.id}`} onClick={() => openDialog("detail", { order })}><FiEye aria-hidden="true" /></button><button type="button" aria-label={`Edit ${order.id}`} onClick={() => openDialog("order", { order })}><FiEdit2 aria-hidden="true" /></button><button className={styles.deleteAction} type="button" aria-label={`Remove ${order.id}`} onClick={() => removeOrder(order)}><FiTrash2 aria-hidden="true" /></button></div></td>
                </tr>)}
            </tbody></table></div>
            {filtered.length === 0 && <div className={styles.empty}><FiShoppingCart aria-hidden="true" /><strong>No matching orders</strong><span>Try another search or clear the status filter.</span><button type="button" onClick={() => { setQuery(""); setStatusFilter("All statuses"); }}>Clear filters</button></div>}
            <div className={styles.tableFoot}><span>Order changes update the shared operations view for this session.</span><span>Showing {filtered.length} of {orders.length}</span></div>
        </section>
    </div>;
};

export default Orders;


