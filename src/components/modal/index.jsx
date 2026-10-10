import { useEffect, useMemo, useState } from "react";
import { FiBox, FiCalendar, FiDollarSign, FiHash, FiMail, FiPackage, FiShoppingCart, FiTruck, FiUser, FiX } from "react-icons/fi";
import { useApp } from "../../context/useApp.js";
import { money } from "../../data/seed.js";
import styles from "./styles.module.css";

const DialogContent = () => {
    const { dialog, closeDialog, items, orders, openDialog, addOrder, updateOrder, addItem, updateItem, addPurchase, adjustStock, recordPayment, notify } = useApp();
    const [error, setError] = useState("");
    const [adjustment, setAdjustment] = useState("5");
    const [reason, setReason] = useState("Cycle count");
    const data = dialog?.data || {};
    const order = orders.find((entry) => entry.id === data.order?.id) || data.order;
    const item = data.item;
    const purchase = data.purchase;

useEffect(() => {
        if (!dialog || dialog.type === "confirm") return undefined;
        const onKey = (event) => { if (event.key === "Escape") closeDialog(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [dialog, closeDialog]);

    const title = useMemo(() => ({
        order: order ? `Edit ${order.id}` : "Create sales order",
        item: item ? "Edit inventory item" : "Add inventory item",
        purchase: purchase ? `Edit ${purchase.id}` : "Create purchase order",
        stock: "Adjust on-hand stock",
        detail: order?.id || "Order details",
    }[dialog?.type]), [dialog?.type, order, item, purchase]);

    if (!dialog || dialog.type === "confirm") return null;

    const submit = (event) => {
        event.preventDefault();
        setError("");
        const values = Object.fromEntries(new FormData(event.currentTarget).entries());
        if (dialog.type === "order") {
            const selected = items.find((entry) => entry.id === values.itemId);
            values.itemName = selected?.name;
            const result = order ? updateOrder(order.id, values) : addOrder(values);
            if (result?.error) { setError(result.error); return; }
        } else if (dialog.type === "item") {
            values.image = item?.image || (values.category === "Shipping" ? "assets/fulfillment-labels.jpg" : "assets/warehouse-packaging.jpg");
            const result = item ? updateItem(item.id, values) : addItem(values);
            if (result?.error) { setError(result.error); return; }
        } else if (dialog.type === "purchase") {
            if (purchase) { setError("Purchase orders can be received or removed. Create a new order to change a request."); return; }
            const result = addPurchase(values);
            if (result?.error) { setError(result.error); return; }
        } else if (dialog.type === "stock") {
            const result = adjustStock(item.id, adjustment, reason);
            if (result?.error) { setError(result.error); return; }
        }
        closeDialog();
    };

    const updateStatus = (event) => { const result = updateOrder(order.id, { status: event.target.value }); if (result?.error) notify(result.error, "error"); };
    const total = order ? order.quantity * order.unitPrice : 0;

    return <div className={styles.backdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) closeDialog(); }}>
        <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="dialog-title">
            <div className={styles.dialogHeader}>
                <div><h2 id="dialog-title">{title}</h2><p>{dialog.type === "order" ? "Keep the customer, allocation, and expected amount in sync." : dialog.type === "item" ? "Maintain a clear count for the stock room." : dialog.type === "purchase" ? "Plan an inbound restock against your live inventory." : dialog.type === "stock" ? "Record a counted change and keep open allocations protected." : "Review the current order and its next step."}</p></div>
                <button className={styles.closeButton} type="button" onClick={closeDialog} aria-label="Close dialog"><FiX aria-hidden="true" /></button>
            </div>

            {dialog.type === "detail" && order && <div className={styles.detailBody}>
                <div className={styles.detailSummary}><span className={styles.orderNumber}>{order.id}</span><strong>{money(total)}</strong></div>
                <div className={styles.detailGrid}>
                    <div><span>Customer</span><strong>{order.customer}</strong><small>{order.email}</small></div>
                    <div><span>Item</span><strong>{order.itemName}</strong><small>{order.quantity} units at {money(order.unitPrice)}</small></div>
                    <div><span>Created</span><strong>{order.date}</strong></div>
                    <div><span>Expected by</span><strong>{order.due}</strong></div>
                    <label className={styles.field}><span>Order status</span><select value={order.status} onChange={updateStatus} disabled={order.status === "Shipped"}><option>Processing</option><option>Awaiting payment</option><option>Ready to ship</option><option>Shipped</option></select></label>
                </div>
                <div className={styles.detailActions}><button className={styles.secondaryButton} type="button" onClick={() => openDialog("order", { order })}>Edit order</button>{order.invoiceStatus === "Paid" ? <button className={styles.secondaryButton} type="button" disabled>Payment recorded</button> : <button className={styles.primaryButton} type="button" onClick={() => { recordPayment(order.id); closeDialog(); }}>Record payment</button>}</div>
            </div>}

            {dialog.type === "stock" && <form className={styles.form} onSubmit={submit}>
                <div className={styles.stockInfo}><FiBox aria-hidden="true" /><div><strong>{item?.name}</strong><span>Current on hand: {item?.stock} {item?.unit}</span></div></div>
                <label className={styles.field}><span>Quantity change</span><input type="number" required value={adjustment} onChange={(event) => setAdjustment(event.target.value)} /></label>
                <label className={styles.field}><span>Reason</span><select value={reason} onChange={(event) => setReason(event.target.value)}><option>Cycle count</option><option>Damaged stock</option><option>Found stock</option><option>Manual correction</option></select></label>
                <FormError message={error} />
                <div className={styles.formActions}><button type="button" className={styles.secondaryButton} onClick={closeDialog}>Cancel</button><button className={styles.primaryButton} type="submit">Save adjustment</button></div>
            </form>}

            {dialog.type === "order" && <form className={styles.form} onSubmit={submit}>
                <div className={styles.twoColumns}>
                    <label className={styles.field}><span><FiUser aria-hidden="true" /> Customer name</span><input name="customer" required minLength="2" defaultValue={order?.customer || ""} placeholder="e.g. Northline Supply" /></label>
                    <label className={styles.field}><span><FiMail aria-hidden="true" /> Customer email</span><input name="email" type="email" required defaultValue={order?.email || ""} placeholder="buyer@company.com" /></label>
                    <label className={styles.field}><span><FiBox aria-hidden="true" /> Item</span><select name="itemId" defaultValue={order?.itemId || items[0]?.id} required disabled={order?.status === "Shipped"}>{items.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}</select></label>
                    <label className={styles.field}><span><FiHash aria-hidden="true" /> Quantity</span><input name="quantity" type="number" min="1" required defaultValue={order?.quantity || 12} disabled={order?.status === "Shipped"} /></label>
                    <label className={styles.field}><span><FiDollarSign aria-hidden="true" /> Unit price</span><input name="unitPrice" type="number" min="0.01" step="0.01" required defaultValue={order?.unitPrice || 12} /></label>
                    <label className={styles.field}><span><FiCalendar aria-hidden="true" /> Expected date</span><input name="due" type="date" required defaultValue={order?.due || "2026-10-13"} /></label>
                </div>
                <FormError message={error} />
                <div className={styles.formActions}><button type="button" className={styles.secondaryButton} onClick={closeDialog}>Cancel</button><button className={styles.primaryButton} type="submit">{order ? "Save changes" : "Create order"}</button></div>
            </form>}

            {dialog.type === "item" && <form className={styles.form} onSubmit={submit}>
                <div className={styles.twoColumns}>
                    <label className={styles.field}><span><FiBox aria-hidden="true" /> Item name</span><input name="name" required defaultValue={item?.name || ""} placeholder="Recycled mailer" /></label>
                    <label className={styles.field}><span><FiHash aria-hidden="true" /> SKU</span><input name="sku" required defaultValue={item?.sku || ""} placeholder="PKG-108" /></label>
                    <label className={styles.field}><span>Category</span><select name="category" defaultValue={item?.category || "Packaging"}><option>Packaging</option><option>Shipping</option><option>Equipment</option><option>Supplies</option></select></label>
                    <label className={styles.field}><span>Unit</span><select name="unit" defaultValue={item?.unit || "units"}><option>units</option><option>pcs</option><option>rolls</option><option>bags</option><option>cases</option></select></label>
                    <label className={styles.field}><span>On hand</span><input name="stock" type="number" min="0" required defaultValue={item?.stock ?? 0} /></label>
                    <label className={styles.field}><span>Reorder at</span><input name="reorder" type="number" min="0" required defaultValue={item?.reorder ?? 20} /></label>
                    <label className={styles.field}><span>Unit cost</span><input name="cost" type="number" min="0" step="0.01" required defaultValue={item?.cost ?? 1} /></label>
                </div>
                <FormError message={error} />
                <div className={styles.formActions}><button type="button" className={styles.secondaryButton} onClick={closeDialog}>Cancel</button><button className={styles.primaryButton} type="submit">{item ? "Save item" : "Add item"}</button></div>
            </form>}

            {dialog.type === "purchase" && <form className={styles.form} onSubmit={submit}>
                <div className={styles.twoColumns}>
                    <label className={styles.field}><span><FiTruck aria-hidden="true" /> Vendor</span><input name="vendor" required defaultValue={purchase?.vendor || ""} placeholder="Supplier company" /></label>
                    <label className={styles.field}><span><FiPackage aria-hidden="true" /> Item</span><select name="itemId" defaultValue={purchase?.itemId || items[0]?.id}>{items.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}</select></label>
                    <label className={styles.field}><span>Quantity</span><input name="quantity" type="number" min="1" required defaultValue={purchase?.quantity || 80} /></label>
                    <label className={styles.field}><span><FiCalendar aria-hidden="true" /> Expected date</span><input name="expected" type="date" required defaultValue={purchase?.expected || "2026-10-15"} /></label>
                </div>
                {purchase && <p className={styles.inlineNotice}>Supplier orders are not editable after placement. Receive this delivery from its row when it arrives.</p>}
                <FormError message={error} />
                <div className={styles.formActions}><button type="button" className={styles.secondaryButton} onClick={closeDialog}>Cancel</button><button className={styles.primaryButton} type="submit"><FiShoppingCart aria-hidden="true" /> Place purchase order</button></div>
            </form>}
        </section>
    </div>;
};

const FormError = ({ message }) => message ? <p className={styles.formError} role="alert">{message}</p> : null;

const DialogLayer = () => {
    const { dialog } = useApp();
    if (!dialog || dialog.type === "confirm") return null;
    const key = `${dialog.type}-${dialog.data?.order?.id || dialog.data?.item?.id || dialog.data?.purchase?.id || "new"}`;
    return <DialogContent key={key} />;
};

export default DialogLayer;










