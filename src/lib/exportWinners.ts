import { Employee } from "@/types/employee";

/**
 * Export winners list to CSV and trigger download.
 */
export function exportWinnersToCSV(winners: Employee[]): void {
  if (winners.length === 0) return;

  const headers = ["ลำดับ", "รหัสพนักงาน", "ชื่อ-สกุล", "แผนก", "รางวัล (บาท)"];
  const rows = winners.map((w, i) => [
    i + 1,
    w.id,
    w.name || "-",
    w.department || "-",
    "10,000",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  // Add BOM for proper Thai character encoding in Excel
  const bom = "\uFEFF";
  const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `lucky_draw_winners_${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/**
 * Print the winners list.
 */
export function printWinners(winners: Employee[]): void {
  const printContent = `
    <html>
      <head>
        <title>ผลการจับรางวัลพนักงาน</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; }
          h1 { text-align: center; color: #1e3a5f; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: center; }
          th { background-color: #1e3a5f; color: white; }
          tr:nth-child(even) { background-color: #f2f2f2; }
          .date { text-align: center; color: #666; margin-top: 10px; }
        </style>
      </head>
      <body>
        <h1>🏆 ผลการจับรางวัลพนักงาน</h1>
        <p class="date">วันที่: ${new Date().toLocaleDateString("th-TH", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}</p>
        <table>
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>รหัสพนักงาน</th>
              <th>ชื่อ-สกุล</th>
              <th>แผนก</th>
              <th>รางวัล</th>
            </tr>
          </thead>
          <tbody>
            ${winners
              .map(
                (w, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${w.id}</td>
                <td>${w.name || "-"}</td>
                <td>${w.department || "-"}</td>
                <td>10,000 บาท</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.onafterprint = () => printWindow.close();
    setTimeout(() => printWindow.print(), 250);
  }
}
