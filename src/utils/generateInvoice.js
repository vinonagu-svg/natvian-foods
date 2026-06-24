import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoice = (order) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Natvian Foods", 14, 20);

  doc.setFontSize(12);

  doc.text(
    `Order No: ${order.orderNumber}`,
    14,
    35
  );

  doc.text(
    `Customer: ${order.customer?.name}`,
    14,
    45
  );

  doc.text(
    `Phone: ${order.customer?.phone}`,
    14,
    55
  );

  doc.text(
    `City: ${order.customer?.city}`,
    14,
    65
  );

  autoTable(doc, {
    startY: 80,

    head: [
      [
        "Product",
        "Weight",
        "Qty",
        "Price",
      ],
    ],

    body:
      order.items?.map((item) => [
        item.name,
        item.weight,
        item.qty,
        item.mrp,
      ]) || [],
  });

  const y = doc.lastAutoTable.finalY + 15;

  doc.text(
    `Subtotal: ₹${order.subtotal}`,
    14,
    y
  );

  doc.text(
    `CGST: ₹${order.cgst}`,
    14,
    y + 10
  );

  doc.text(
    `SGST: ₹${order.sgst}`,
    14,
    y + 20
  );

  doc.text(
    `Shipping: ₹${order.shipping}`,
    14,
    y + 30
  );

  doc.setFontSize(14);

  doc.text(
    `Grand Total: ₹${order.grandTotal}`,
    14,
    y + 45
  );

  doc.save(
    `Invoice-${order.orderNumber}.pdf`
  );
};