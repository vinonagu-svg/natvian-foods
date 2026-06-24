import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportOrdersToExcel = (
  orders,
  fileName = "Orders"
) => {
  const data = orders.map((order) => ({
    OrderNo: order.orderNumber,

    Customer: order.customer?.name,

    Phone: order.customer?.phone,

    City: order.customer?.city,

    Amount: order.grandTotal,

    Status: order.orderStatus,

    DeliveredDate: order.deliveredAt
      ? new Date(
          order.deliveredAt.seconds * 1000
        ).toLocaleDateString("en-IN")
      : "",

    Products:
      order.items
        ?.map(
          (i) =>
            `${i.name} (${i.weight}) x ${i.qty}`
        )
        .join(", ") || "",
  }));

  const worksheet =
    XLSX.utils.json_to_sheet(data);

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Orders"
  );

  const excelBuffer = XLSX.write(
    workbook,
    {
      bookType: "xlsx",
      type: "array",
    }
  );

  const blob = new Blob(
    [excelBuffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }
  );

  saveAs(blob, `${fileName}.xlsx`);
};