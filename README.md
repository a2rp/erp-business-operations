![Ledgerly ERP operations workspace](./screenshot.png)

# Ledgerly ERP Business Operations

Ledgerly is a frontend-only ERP operations workspace for connecting sales orders, inventory, purchasing, and customer receivables. It is designed as a practical browser demo: each workspace shares the same live React state, so common handoffs can be explored without a backend.

**GitHub Pages target:** [https://a2rp.github.io/erp-business-operations/](https://a2rp.github.io/erp-business-operations/). The app bundle is published to `gh-pages`; GitHub Pages still needs that branch selected in the repository settings before this URL serves the app.

## Workspaces

- **Overview:** Monitor order value, open sales orders, reorder alerts, inbound purchases, order progress, and shortcuts to each workspace.
- **Sales orders:** Search, filter, sort, create, edit, inspect, update status, and export order records. Creating an order reserves available units. Shipping it subtracts those units from physical stock and removes its reservation.
- **Inventory:** Search and filter stock by category or reorder status, add and edit catalog items, adjust quantities with a reason, and export the current inventory. Stock cannot be reduced below quantities reserved by open orders, and items allocated to open orders cannot be removed.
- **Procurement:** Search and filter purchase orders, create supplier orders, receive deliveries into inventory, and remove a purchase order with a confirmation dialog. Receiving the same order twice is prevented.
- **Finance:** Review invoices derived from sales orders, search and filter receivables, export the ledger, and record a demo payment. Invoice status stays in sync with the related sales order.

## Connected workflows

1. Create a sales order to reserve available inventory and create a matching invoice.
2. Move an order through its fulfillment statuses. Shipping deducts stock once and keeps shipped units from being reserved again.
3. Create a purchase order for an existing inventory item. Receiving it adds its quantity to on-hand stock and marks the purchase order received.
4. Record an invoice payment in Finance. The payment status is reflected in the linked order and the summary figures.

Forms validate required fields, numeric amounts, unique stock keeping units, and available inventory. Destructive actions use custom confirmation dialogs. Important actions show dismissible status notifications, and empty searches offer a way to clear filters. CSV exports include the currently visible records.

## Data and limits

This is a frontend-only demo. Demo records and edits live in shared React memory while the page is open; refreshing the browser restores the original sample data. No data is written to local storage, a database, or an API. Payment recording updates the demo ledger only. It does not transfer money or contact an accounting service. Supplier, customer, and inventory information is sample data.

## Screenshots

These screenshots were captured from the built application with representative demo data. Select any image to open its full-size version. The page gallery includes the desktop workspaces, a mobile overview, and the not-found route. Dialog images show the distinct create, edit, validation, detail, stock adjustment, and removal confirmation states.

### Pages

<table>
<tr>
<td align="center"><a href="./screenshots/pages/overview.png"><img src="./screenshots/pages/overview.png" alt="Ledgerly overview on desktop" width="360"></a><br><strong>Overview</strong></td>
<td align="center"><a href="./screenshots/pages/orders.png"><img src="./screenshots/pages/orders.png" alt="Sales orders workspace" width="360"></a><br><strong>Sales orders</strong></td>
<td align="center"><a href="./screenshots/pages/inventory.png"><img src="./screenshots/pages/inventory.png" alt="Inventory control workspace" width="360"></a><br><strong>Inventory</strong></td>
</tr>
<tr>
<td align="center"><a href="./screenshots/pages/procurement.png"><img src="./screenshots/pages/procurement.png" alt="Procurement workspace" width="360"></a><br><strong>Procurement</strong></td>
<td align="center"><a href="./screenshots/pages/finance.png"><img src="./screenshots/pages/finance.png" alt="Receivables workspace" width="360"></a><br><strong>Finance</strong></td>
<td align="center"><a href="./screenshots/pages/not-found.png"><img src="./screenshots/pages/not-found.png" alt="Not found route" width="360"></a><br><strong>Not found</strong></td>
</tr>
<tr>
<td align="center"><a href="./screenshots/pages/overview-mobile.png"><img src="./screenshots/pages/overview-mobile.png" alt="Responsive overview on a mobile viewport" width="180"></a><br><strong>Overview on mobile</strong></td>
<td></td><td></td>
</tr>
</table>

### Dialogs and feedback

<table>
<tr>
<td align="center"><a href="./screenshots/modals/sales-order-create.png"><img src="./screenshots/modals/sales-order-create.png" alt="Create sales order dialog" width="320"></a><br><strong>Create sales order</strong></td>
<td align="center"><a href="./screenshots/modals/sales-order-validation.png"><img src="./screenshots/modals/sales-order-validation.png" alt="Sales order validation feedback" width="320"></a><br><strong>Sales order validation</strong></td>
<td align="center"><a href="./screenshots/modals/sales-order-created-toast.png"><img src="./screenshots/modals/sales-order-created-toast.png" alt="Sales order creation notification" width="320"></a><br><strong>Sales order created</strong></td>
</tr>
<tr>
<td align="center"><a href="./screenshots/modals/sales-order-edit.png"><img src="./screenshots/modals/sales-order-edit.png" alt="Edit sales order dialog" width="320"></a><br><strong>Edit sales order</strong></td>
<td align="center"><a href="./screenshots/modals/sales-order-detail.png"><img src="./screenshots/modals/sales-order-detail.png" alt="Sales order detail dialog" width="320"></a><br><strong>Sales order details</strong></td>
<td align="center"><a href="./screenshots/modals/sales-order-delete-confirm.png"><img src="./screenshots/modals/sales-order-delete-confirm.png" alt="Sales order removal confirmation" width="320"></a><br><strong>Remove sales order</strong></td>
</tr>
<tr>
<td align="center"><a href="./screenshots/modals/inventory-item-create.png"><img src="./screenshots/modals/inventory-item-create.png" alt="Add inventory item dialog" width="320"></a><br><strong>Add inventory item</strong></td>
<td align="center"><a href="./screenshots/modals/inventory-item-edit.png"><img src="./screenshots/modals/inventory-item-edit.png" alt="Edit inventory item dialog" width="320"></a><br><strong>Edit inventory item</strong></td>
<td align="center"><a href="./screenshots/modals/inventory-stock-adjustment.png"><img src="./screenshots/modals/inventory-stock-adjustment.png" alt="Stock adjustment dialog" width="320"></a><br><strong>Adjust stock</strong></td>
</tr>
<tr>
<td align="center"><a href="./screenshots/modals/inventory-stock-validation.png"><img src="./screenshots/modals/inventory-stock-validation.png" alt="Stock adjustment validation feedback" width="320"></a><br><strong>Stock adjustment validation</strong></td>
<td align="center"><a href="./screenshots/modals/inventory-delete-confirm.png"><img src="./screenshots/modals/inventory-delete-confirm.png" alt="Inventory item removal confirmation" width="320"></a><br><strong>Remove inventory item</strong></td>
<td align="center"><a href="./screenshots/modals/inventory-delete-confirm-received-item.png"><img src="./screenshots/modals/inventory-delete-confirm-received-item.png" alt="Removal confirmation for an item updated by a received order" width="320"></a><br><strong>Remove received inventory item</strong></td>
</tr>
<tr>
<td align="center"><a href="./screenshots/modals/purchase-order-create.png"><img src="./screenshots/modals/purchase-order-create.png" alt="Create purchase order dialog" width="320"></a><br><strong>Create purchase order</strong></td>
<td align="center"><a href="./screenshots/modals/purchase-order-delete-confirm.png"><img src="./screenshots/modals/purchase-order-delete-confirm.png" alt="Purchase order removal confirmation" width="320"></a><br><strong>Remove purchase order</strong></td>
<td></td>
</tr>
</table>

## Run locally

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

Useful project commands:

```bash
npm run lint
npm run build
npm run preview
npm run deploy
```

The Vite base path and `homepage` are configured for GitHub Pages. `npm run deploy` builds the project and publishes the `dist` directory to the `gh-pages` branch. To activate the target URL, select `gh-pages` and the `/ (root)` folder as the GitHub Pages source in the repository settings. That repository setting is pending a connected GitHub account.

## Future improvements

These items are not implemented in this frontend demo:

- Add a backend API and shared database for durable records, multi-user workspaces, and role-based permissions.
- Connect purchase orders and stock movements to supplier, warehouse, barcode, and accounting systems.
- Add server-side audit history, approval policies, and reporting across teams and time periods.
- Support production invoice numbering, tax rules, payment provider handoff, and reconciliation with an accounting platform.

## Image credits

- Fulfillment photo: [Karori Production on Unsplash](https://unsplash.com/photos/brown-shipping-boxes-next-to-a-small-label-printer-cpwP43LnGRk).
- Stockroom photo: [Guilherme Mendes on Unsplash](https://unsplash.com/photos/cardboard-boxes-and-packaging-supplies-in-a-warehouse-RVP3wAw9gJY).

## Links

- Portfolio: [https://www.ashishranjan.net](https://www.ashishranjan.net)
- GitHub: [https://github.com/a2rp](https://github.com/a2rp)
- CodePen: [https://codepen.io/ash1198](https://codepen.io/ash1198)
- LinkedIn: [https://www.linkedin.com/in/aashishranjan](https://www.linkedin.com/in/aashishranjan)
- Facebook: [https://www.facebook.com/theash.ashish/](https://www.facebook.com/theash.ashish/)
- YouTube: [https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1](https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1)
- Email: [mailto:ash.ranjan09@gmail.com](mailto:ash.ranjan09@gmail.com)

## Support

- Support: [https://a2rp-donation-page.netlify.app/](https://a2rp-donation-page.netlify.app/)
- Buy Me a Coffee: [https://buymeacoffee.com/ashishranjan](https://buymeacoffee.com/ashishranjan)
- Patreon: [https://www.patreon.com/ashishranjan](https://www.patreon.com/ashishranjan)
