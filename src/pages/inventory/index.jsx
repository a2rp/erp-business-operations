import { useMemo, useState } from "react";
import {
    FiAlertCircle,
    FiLayers,
    FiBox,
    FiEdit2,
    FiFilter,
    FiPlus,
    FiSearch,
    FiTrash2,
    FiTrendingDown,
} from "react-icons/fi";
import { useApp } from "../../context/useApp.js";
import { money, publicAsset } from "../../data/seed.js";
import styles from "./styles.module.css";

const Inventory = () => {
    const { items, orders, availableQuantity, openDialog, deleteItem } =
        useApp();
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("All categories");
    const [lowOnly, setLowOnly] = useState(false);
    const lowItems = items.filter((item) => item.stock <= item.reorder);
    const committed = orders
        .filter((order) => order.status !== "Shipped")
        .reduce((total, order) => total + order.quantity, 0);
    const filtered = useMemo(
        () =>
            items.filter((item) => {
                const matches = `${item.name} ${item.sku} ${item.category}`
                    .toLowerCase()
                    .includes(query.toLowerCase());
                return (
                    matches &&
                    (category === "All categories" ||
                        item.category === category) &&
                    (!lowOnly || item.stock <= item.reorder)
                );
            }),
        [items, query, category, lowOnly],
    );

    const removeItem = (item) =>
        openDialog("confirm", {
            title: `Remove ${item.name}?`,
            message:
                "This removes the item from the catalog. Items allocated to open orders cannot be removed. The action cannot be undone.",
            confirmLabel: "Remove item",
            onConfirm: () => deleteItem(item.id),
        });
    const exportInventory = () => {
        const rows = [
            [
                "SKU",
                "Item",
                "Category",
                "On hand",
                "Allocated",
                "Available",
                "Reorder point",
                "Unit cost",
            ],
            ...filtered.map((item) => [
                item.sku,
                item.name,
                item.category,
                item.stock,
                item.stock - availableQuantity(item.id),
                availableQuantity(item.id),
                item.reorder,
                item.cost,
            ]),
        ];
        const csv = rows
            .map((row) =>
                row
                    .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
                    .join(","),
            )
            .join("\n");
        const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "ledgerly-inventory.csv";
        anchor.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className={styles.page}>
            <div className={styles.heading}>
                <div>
                    <div className={styles.breadcrumb}>
                        Operations <span>/</span> Inventory
                    </div>
                    <h1>Inventory control</h1>
                    <p>
                        See what is on hand, what is allocated, and what needs a
                        reorder.
                    </p>
                </div>
                <div className={styles.headingActions}>
                    <button
                        className={styles.outlineButton}
                        type="button"
                        onClick={exportInventory}
                    >
                        <FiLayers aria-hidden="true" /> Export stock
                    </button>
                    <button
                        className={styles.primaryButton}
                        type="button"
                        onClick={() => openDialog("item")}
                    >
                        <FiPlus aria-hidden="true" /> Add item
                    </button>
                </div>
            </div>
            <div className={styles.summary}>
                <Summary
                    label="Active SKUs"
                    value={items.length}
                    icon={FiBox}
                />
                <Summary
                    label="Units on hand"
                    value={items
                        .reduce((sum, item) => sum + item.stock, 0)
                        .toLocaleString()}
                    icon={FiLayers}
                />
                <Summary
                    label="Allocated to orders"
                    value={committed.toLocaleString()}
                    icon={FiFilter}
                />
                <Summary
                    label="At reorder point"
                    value={lowItems.length}
                    icon={FiAlertCircle}
                    warn={lowItems.length > 0}
                />
            </div>
            <section className={styles.inventoryPanel}>
                <div className={styles.toolbar}>
                    <div className={styles.search}>
                        <FiSearch aria-hidden="true" />
                        <input
                            aria-label="Search inventory"
                            placeholder="Search SKU, item, or category"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                        />
                        {query && (
                            <button
                                type="button"
                                onClick={() => setQuery("")}
                                aria-label="Clear search"
                            >
                                &times;
                            </button>
                        )}
                    </div>
                    <label className={styles.category}>
                        <span>Category</span>
                        <select
                            aria-label="Filter inventory by category"
                            value={category}
                            onChange={(event) =>
                                setCategory(event.target.value)
                            }
                        >
                            <option>All categories</option>
                            <option>Packaging</option>
                            <option>Shipping</option>
                            <option>Equipment</option>
                            <option>Supplies</option>
                        </select>
                    </label>
                    <button
                        className={`${styles.lowToggle} ${lowOnly ? styles.lowActive : ""}`}
                        type="button"
                        aria-pressed={lowOnly}
                        onClick={() => setLowOnly((value) => !value)}
                    >
                        <FiTrendingDown aria-hidden="true" /> Low stock only{" "}
                        <span>{lowItems.length}</span>
                    </button>
                    <span className={styles.resultCount}>
                        {filtered.length} products
                    </span>
                </div>
                <div className={styles.productGrid}>
                    {filtered.map((item) => {
                        const available = availableQuantity(item.id);
                        const allocated = item.stock - available;
                        const low = item.stock <= item.reorder;
                        return (
                            <article
                                className={`${styles.product} ${low ? styles.productLow : ""}`}
                                key={item.id}
                            >
                                <div className={styles.productTop}>
                                    {item.image ? (
                                        <img
                                            src={publicAsset(item.image)}
                                            alt={`${item.name} in stock`}
                                        />
                                    ) : (
                                        <span className={styles.productIcon}>
                                            <FiBox aria-hidden="true" />
                                        </span>
                                    )}
                                    <span
                                        className={`${styles.stockBadge} ${low ? styles.stockWarning : ""}`}
                                    >
                                        {low ? "Reorder" : "In stock"}
                                    </span>
                                </div>
                                <div className={styles.productBody}>
                                    <span className={styles.sku}>
                                        {item.sku} / {item.category}
                                    </span>
                                    <h2>{item.name}</h2>
                                    <div className={styles.stockNumbers}>
                                        <div>
                                            <small>On hand</small>
                                            <strong>
                                                {item.stock}{" "}
                                                <small>{item.unit}</small>
                                            </strong>
                                        </div>
                                        <div>
                                            <small>Available</small>
                                            <strong>
                                                {available}{" "}
                                                <small>{item.unit}</small>
                                            </strong>
                                        </div>
                                        <div>
                                            <small>Unit cost</small>
                                            <strong>{money(item.cost)}</strong>
                                        </div>
                                    </div>
                                    <div className={styles.progress}>
                                        <span
                                            style={{
                                                width: `${Math.min(100, (item.stock / Math.max(item.reorder * 2, 1)) * 100)}%`,
                                            }}
                                        />
                                    </div>
                                    <div className={styles.reorderLine}>
                                        <span>{allocated} allocated</span>
                                        <span>Reorder at {item.reorder}</span>
                                    </div>
                                    {low && (
                                        <div className={styles.lowMessage}>
                                            <FiAlertCircle aria-hidden="true" />{" "}
                                            Below reorder point by{" "}
                                            {item.reorder - item.stock + 1}{" "}
                                            {item.unit}
                                        </div>
                                    )}
                                </div>
                                <div className={styles.productActions}>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            openDialog("stock", { item })
                                        }
                                    >
                                        Adjust stock
                                    </button>
                                    <button
                                        type="button"
                                        aria-label={`Edit ${item.name}`}
                                        onClick={() =>
                                            openDialog("item", { item })
                                        }
                                    >
                                        <FiEdit2 aria-hidden="true" />
                                    </button>
                                    <button
                                        className={styles.deleteButton}
                                        type="button"
                                        aria-label={`Remove ${item.name}`}
                                        onClick={() => removeItem(item)}
                                    >
                                        <FiTrash2 aria-hidden="true" />
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>
                {filtered.length === 0 && (
                    <div className={styles.empty}>
                        <FiBox aria-hidden="true" />
                        <strong>No inventory items match</strong>
                        <span>
                            Change the filters or add a new item to the catalog.
                        </span>
                        <button
                            type="button"
                            onClick={() => {
                                setQuery("");
                                setCategory("All categories");
                                setLowOnly(false);
                            }}
                        >
                            Clear filters
                        </button>
                    </div>
                )}
                <div className={styles.panelFoot}>
                    Stock adjustments and purchase receipts update availability
                    across orders in this session.
                </div>
            </section>
        </div>
    );
};

const Summary = ({ label, value, icon: Icon, warn }) => (
    <div className={warn ? styles.summaryWarn : ""}>
        <span>
            <Icon aria-hidden="true" />
        </span>
        <small>{label}</small>
        <strong>{value}</strong>
    </div>
);

export default Inventory;
