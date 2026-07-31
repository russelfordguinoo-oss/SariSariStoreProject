const guides = [
  { terms: ['add product', 'new product', 'create product'], reply: 'Open Products, then select + Add Product. Fill in the name, price, stock, and optional category, then select Save.' },
  { terms: ['low stock', 'running low', 'out of stock'], reply: 'Open Inventory to review stock levels and product history. You can change your personal low-stock alert level in Settings > Inventory.' },
  { terms: ['sale', 'pos', 'checkout', 'sell'], reply: 'Open Sales / POS, search for products, select items to add them to the cart, adjust quantities if needed, then select Complete Sale.' },
  { terms: ['report', 'export', 'excel'], reply: 'Open Reports, choose a start and end date, then select Generate Report. Once it is generated, use Export to Excel to download it.' },
  { terms: ['transaction', 'history'], reply: 'Open Transactions to review completed sales for a selected date range. The Dashboard also shows your most recent transactions.' },
  { terms: ['inventory', 'stock'], reply: 'Open Inventory to view current stock and product movement history. Your saved sorting and table-view preferences are applied automatically.' },
  { terms: ['custom', 'theme', 'color', 'logo', 'store name', 'branding', 'setting'], reply: 'Open Settings to customize your store name, logo, colors, layout density, sidebar, dashboard widgets, navigation favorites, inventory preferences, and notifications.' },
  { terms: ['dashboard', 'widget', 'card'], reply: 'On the Dashboard, drag summary cards to rearrange them. In Settings > Dashboard, you can show or hide widgets and choose pinned quick actions.' },
  { terms: ['password', 'login', 'sign in'], reply: 'Enter the email and password provided for your store account on the login page. If you cannot sign in, contact the store administrator.' },
];

export function getLocalAssistantReply(message) {
  const normalized = message.toLowerCase();
  const guide = guides.find((item) => item.terms.some((term) => normalized.includes(term)));
  return guide?.reply || 'I can help you use Products, Inventory, Sales / POS, Transactions, Reports, Dashboard, and Settings. Try asking “How do I add a product?” or “How do I make a sale?”';
}
