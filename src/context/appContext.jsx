import { useCallback, useState } from "react";
import AppContext from "./context.js";
import { initialItems, initialOrders, initialPurchases } from "../data/seed.js";

const makeId = (prefix) =>
    `${prefix}-${Date.now().toString().slice(-6)}-${Math.random().toString(36).slice(2, 5)}`;
const today = () => new Date().toISOString().slice(0, 10);

export const AppProvider = ({ children }) => {
    const [items, setItems] = useState(initialItems);
    const [orders, setOrders] = useState(initialOrders);
    const [purchases, setPurchases] = useState(initialPurchases);
    const [toasts, setToasts] = useState([]);
    const [dialog, setDialog] = useState(null);

    const notify = (message, type = "success") => {
        const id = makeId("notice");
        setToasts((current) => [...current, { id, message, type }]);
    };
    const closeDialog = useCallback(() => setDialog(null), []);
    const openDialog = useCallback(
        (type, data = {}) => setDialog({ type, data }),
        [],
    );
    const availableQuantity = (itemId, ignoreOrderId = "") => {
        const item = items.find((entry) => entry.id === itemId);
        const committed = orders
            .filter(
                (order) =>
                    order.itemId === itemId &&
                    order.id !== ignoreOrderId &&
                    order.status !== "Shipped",
            )
            .reduce((sum, order) => sum + Number(order.quantity), 0);
        return Math.max(0, (item?.stock || 0) - committed);
    };
    const addOrder = (values) => {
        const item = items.find((entry) => entry.id === values.itemId);
        if (!item)
            return {
                error: "Add an inventory item before creating a sales order.",
            };
        const quantity = Number(values.quantity);
        const available = availableQuantity(values.itemId);
        if (quantity > available)
            return {
                error: `Only ${available} units are available to allocate.`,
            };
        const order = {
            ...values,
            id: makeId("SO"),
            itemName: item.name,
            date: today(),
            due: values.due || today(),
            status: "Processing",
            invoiceStatus: "Open",
            quantity,
            unitPrice: Number(values.unitPrice),
        };
        setOrders((current) => [order, ...current]);
        notify(`${order.id} created and ${order.quantity} units allocated.`);
        return { order };
    };
    const updateOrder = (id, values) => {
        const current = orders.find((order) => order.id === id);
        if (!current) return { error: "This order is no longer available." };
        const itemId = values.itemId || current.itemId;
        const item = items.find((entry) => entry.id === itemId);
        if (!item) return { error: "Choose an item that exists in inventory." };
        const quantity = Number(values.quantity ?? current.quantity);
        if (
            current.status !== "Shipped" &&
            values.status !== "Shipped" &&
            quantity > availableQuantity(itemId, id)
        ) {
            return {
                error: `Only ${availableQuantity(itemId, id)} units are available to allocate.`,
            };
        }
        if (values.status === "Shipped" && current.status !== "Shipped") {
            const available = availableQuantity(current.itemId, current.id);
            if (current.quantity > available)
                return {
                    error: `Only ${available} units are free to ship. Resolve other allocations first.`,
                };
            setItems((list) =>
                list.map((entry) =>
                    entry.id === current.itemId
                        ? { ...entry, stock: entry.stock - current.quantity }
                        : entry,
                ),
            );
        }
        setOrders((list) =>
            list.map((order) =>
                order.id === id
                    ? {
                          ...order,
                          ...values,
                          itemId,
                          itemName: item.name,
                          quantity,
                      }
                    : order,
            ),
        );
        notify(`${id} updated.`);
        return { ok: true };
    };
    const deleteOrder = (id) => {
        const order = orders.find((entry) => entry.id === id);
        if (!order) return;
        setOrders((current) => current.filter((entry) => entry.id !== id));
        notify(
            order.status === "Shipped"
                ? `${id} removed. Shipped stock remains deducted.`
                : `${id} removed and its stock allocation released.`,
            "info",
        );
    };
    const addItem = (values) => {
        if (
            items.some(
                (item) =>
                    item.sku.toLowerCase() === values.sku.trim().toLowerCase(),
            )
        )
            return { error: "That SKU is already in the inventory catalog." };
        const item = {
            ...values,
            id: makeId("itm"),
            sku: values.sku.trim(),
            name: values.name.trim(),
            stock: Number(values.stock),
            reorder: Number(values.reorder),
            cost: Number(values.cost),
            unit: values.unit || "units",
        };
        setItems((current) => [item, ...current]);
        notify(`${item.name} added to inventory.`);
        return { ok: true };
    };
    const updateItem = (id, values) => {
        const current = items.find((entry) => entry.id === id);
        if (
            items.some(
                (entry) =>
                    entry.id !== id &&
                    entry.sku.toLowerCase() === values.sku.trim().toLowerCase(),
            )
        )
            return { error: "That SKU is already assigned to another item." };
        const reserved = current.stock - availableQuantity(id);
        if (Number(values.stock) < reserved)
            return {
                error: `Stock cannot be lower than ${reserved} units already allocated to open orders.`,
            };
        setItems((list) =>
            list.map((entry) =>
                entry.id === id
                    ? {
                          ...entry,
                          ...values,
                          sku: values.sku.trim(),
                          name: values.name.trim(),
                          stock: Number(values.stock),
                          reorder: Number(values.reorder),
                          cost: Number(values.cost),
                      }
                    : entry,
            ),
        );
        notify(`${values.name} updated.`);
        return { ok: true };
    };
    const adjustStock = (id, adjustment, reason) => {
        const item = items.find((entry) => entry.id === id);
        const next = item.stock + Number(adjustment);
        const reserved = item.stock - availableQuantity(id);
        if (next < reserved || next < 0)
            return {
                error: `Stock cannot be lower than ${reserved} units already allocated to open orders.`,
            };
        setItems((current) =>
            current.map((entry) =>
                entry.id === id ? { ...entry, stock: next } : entry,
            ),
        );
        notify(
            `${item.name} adjusted by ${Number(adjustment) > 0 ? "+" : ""}${adjustment} units. ${reason ? `Reason: ${reason}.` : ""}`,
            "info",
        );
        return { ok: true };
    };
    const deleteItem = (id) => {
        const item = items.find((entry) => entry.id === id);
        if (!item) return;
        if (
            orders.some(
                (order) => order.itemId === id && order.status !== "Shipped",
            )
        ) {
            notify(
                `${item.name} is allocated to open orders and cannot be removed.`,
                "error",
            );
            return;
        }
        setItems((current) => current.filter((entry) => entry.id !== id));
        notify(`${item.name} removed from inventory.`, "info");
    };
    const addPurchase = (values) => {
        const item = items.find((entry) => entry.id === values.itemId);
        if (!item) return { error: "Choose an item that exists in inventory." };
        const quantity = Number(values.quantity);
        const purchase = {
            ...values,
            id: makeId("PO"),
            vendor: values.vendor.trim(),
            itemName: item.name,
            quantity,
            amount: quantity * Number(item.cost),
            ordered: today(),
            expected: values.expected || today(),
            status: "Ordered",
        };
        setPurchases((current) => [purchase, ...current]);
        notify(`${purchase.id} placed with ${purchase.vendor}.`);
        return { ok: true };
    };
    const receivePurchase = (id) => {
        const purchase = purchases.find((entry) => entry.id === id);
        if (!purchase || purchase.status === "Received") return;
        if (!items.some((item) => item.id === purchase.itemId)) {
            notify(
                `The inventory item for ${id} no longer exists. Add it back before receiving this order.`,
                "error",
            );
            return;
        }
        setItems((current) =>
            current.map((item) =>
                item.id === purchase.itemId
                    ? { ...item, stock: item.stock + purchase.quantity }
                    : item,
            ),
        );
        setPurchases((current) =>
            current.map((entry) =>
                entry.id === id ? { ...entry, status: "Received" } : entry,
            ),
        );
        notify(
            `${purchase.quantity} ${purchase.itemName} received into stock.`,
        );
    };
    const deletePurchase = (id) => {
        setPurchases((current) =>
            current.filter((purchase) => purchase.id !== id),
        );
        notify(`${id} removed from procurement.`, "info");
    };
    const recordPayment = (id) => {
        const order = orders.find((entry) => entry.id === id);
        if (!order || order.invoiceStatus === "Paid") return;
        setOrders((current) =>
            current.map((entry) =>
                entry.id === id ? { ...entry, invoiceStatus: "Paid" } : entry,
            ),
        );
        notify(
            `Payment for ${id} recorded for $${(order.quantity * order.unitPrice).toLocaleString()}.`,
        );
    };

    const value = {
        items,
        orders,
        purchases,
        toasts,
        setToasts,
        dialog,
        openDialog,
        closeDialog,
        notify,
        availableQuantity,
        addOrder,
        updateOrder,
        deleteOrder,
        addItem,
        updateItem,
        adjustStock,
        deleteItem,
        addPurchase,
        receivePurchase,
        deletePurchase,
        recordPayment,
    };
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
