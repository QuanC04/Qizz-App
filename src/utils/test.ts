import Excel from "exceljs";
import { saveAs } from "file-saver";

export async function exTest() {
  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet("My Sheet");

  worksheet.columns = [
    { header: "Id", key: "id", width: 10 },
    { header: "Name", key: "name", width: 32 },
    { header: "D.O.B.", key: "dob", width: 15 },
  ];

  worksheet.addRow({ id: 1, name: "John Doe", dob: new Date(1970, 1, 1) });
  worksheet.addRow({ id: 2, name: "Jane Doe", dob: new Date(1965, 1, 7) });

  // thêm row mới trực tiếp
  worksheet.addRow({ id: 3, name: "New Guy", dob: new Date(2000, 1, 1) });

  // tạo buffer để download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
saveAs(blob, "test.xlsx");

  console.log("File Excel đã được tạo!");
}
