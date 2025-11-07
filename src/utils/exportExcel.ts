import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function exportExcel(data: any[], fileName = "export") {
  if (!data || data.length === 0) {
    alert("Không có dữ liệu để xuất!");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Submissions");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(fileData, `${fileName}.xlsx`);
}
