import { useMemo, useState } from "react";
import { FiDownload, FiCheckCircle, FiClock, FiDollarSign, FiEye, FiSearch, FiTrendingUp } from "react-icons/fi";
import { useApp } from "../../context/useApp.js";
import { money, orderTotal } from "../../data/seed.js";
import styles from "./styles.module.css";

const Finance = () => {
    const { orders, recordPayment, openDialog } = useApp();
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("All invoices");
    const [sort, setSort] = useState("newest");
    const invoices = useMemo(() => orders.map((order) => ({ ...order, invoiceId: `INV-${order.id.slice(-4)}`, total: orderTotal(order) })).filter((invoice) => `${invoice.invoiceId} ${invoice.id} ${invoice.customer}`.toLowerCase().includes(query.toLowerCase()) && (status === "All invoices" || invoice.invoiceStatus === status)).sort((a, b) => sort === "newest" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)), [orders, query, status, sort]);
    const outstanding = orders.filter((order) => order.invoiceStatus !== "Paid");
    const dueTotal = outstanding.reduce((sum, order) => sum + orderTotal(order), 0);
    const paidTotal = orders.filter((order) => order.invoiceStatus === "Paid").reduce((sum, order) => sum + orderTotal(order), 0);

    const exportInvoices = () => {
        const rows = [["Invoice", "Sales order", "Customer", "Issue date", "Due date", "Amount", "Status"], ...invoices.map((invoice) => [invoice.invoiceId, invoice.id, invoice.customer, invoice.date, invoice.due, invoice.total, invoice.invoiceStatus])];
        const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
        const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
        const anchor = document.createElement("a"); anchor.href = url; anchor.download = "ledgerly-invoices.csv"; anchor.click(); URL.revokeObjectURL(url);
    };

    return <div className={styles.page}>
        <div className={styles.heading}><div><div className={styles.breadcrumb}>Operations <span>/</span> Finance</div><h1>Receivables</h1><p>Review invoices linked to sales orders and record demo payments.</p></div><button className={styles.exportButton} type="button" onClick={exportInvoices}><FiDownload aria-hidden="true" /> Export invoices</button></div>
        <section className={styles.summary}>
            <Summary icon={FiDollarSign} label="Outstanding" value={money(dueTotal)} detail={`${outstanding.length} invoices awaiting payment`} />
            <Summary icon={FiCheckCircle} label="Recorded payments" value={money(paidTotal)} detail={`${orders.filter((order) => order.invoiceStatus === "Paid").length} marked paid this session`} />
            <Summary icon={FiClock} label="Due today or overdue" value={outstanding.filter((order) => order.due <= "2026-10-10").length} detail="Needs a follow-up" warn />
        </section>
        <section className={styles.cashCard}><div className={styles.cashIcon}><FiTrendingUp aria-hidden="true" /></div><div><span>Order-to-cash view</span><strong>Invoices follow the order.</strong><p>Every sales order creates a matching invoice in this demo. Payments update the shared status here and on the order details.</p></div><div className={styles.cashLegend}><span><i /> Open</span><span><i /> Paid</span></div></section>
        <section className={styles.invoicePanel}>
            <div className={styles.panelHeading}><div><h2>Invoices</h2><p>Demo ledger for customer receivables</p></div><span className={styles.countPill}>{invoices.length} invoices</span></div>
            <div className={styles.toolbar}><div className={styles.search}><FiSearch aria-hidden="true" /><input aria-label="Search invoices" placeholder="Search invoice, order, or customer" value={query} onChange={(event) => setQuery(event.target.value)} />{query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search">&times;</button>}</div><label><span>Status</span><select aria-label="Filter invoices" value={status} onChange={(event) => setStatus(event.target.value)}><option>All invoices</option><option>Open</option><option>Paid</option></select></label><label><span>Sort</span><select aria-label="Sort invoices" value={sort} onChange={(event) => setSort(event.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></label></div>
            <div className={styles.tableWrap}><table><thead><tr><th>Invoice</th><th>Customer</th><th>Sales order</th><th>Issue date</th><th>Due date</th><th>Amount due</th><th>Status</th><th>Actions</th></tr></thead><tbody>
                {invoices.map((invoice) => <tr key={invoice.id}><td><strong>{invoice.invoiceId}</strong><small>Created with order</small></td><td>{invoice.customer}</td><td><button className={styles.orderLink} type="button" onClick={() => openDialog("detail", { order: invoice })}>{invoice.id}<FiEye aria-hidden="true" /></button></td><td>{invoice.date}</td><td>{invoice.due}</td><td className={styles.amount}>{money(invoice.total)}</td><td><span className={`${styles.invoiceStatus} ${invoice.invoiceStatus === "Paid" ? styles.paid : ""}`}><i />{invoice.invoiceStatus}</span></td><td>{invoice.invoiceStatus === "Paid" ? <span className={styles.recorded}><FiCheckCircle aria-hidden="true" /> Recorded</span> : <button className={styles.recordButton} type="button" onClick={() => recordPayment(invoice.id)}>Record payment</button>}</td></tr>)}
            </tbody></table></div>
            {invoices.length === 0 && <div className={styles.empty}><FiDollarSign aria-hidden="true" /><strong>No matching invoices</strong><span>Adjust your search or status filter.</span><button type="button" onClick={() => { setQuery(""); setStatus("All invoices"); }}>Clear filters</button></div>}
            <div className={styles.disclaimer}><span>Session-only demo</span><p>Payment actions update the frontend ledger only. No payment is processed or sent to an accounting service.</p></div>
        </section>
    </div>;
};

const Summary = ({ icon: Icon, label, value, detail, warn }) => <div className={warn ? styles.summaryWarn : ""}><span><Icon aria-hidden="true" /></span><small>{label}</small><strong>{value}</strong><p>{detail}</p></div>;

export default Finance;


