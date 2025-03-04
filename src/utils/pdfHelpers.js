import { PDFStyles } from "../constant/reportStyles.js";

export const createPdfTable = (doc, { headers, rows }) => {
  // Validate the inputs
  if (!Array.isArray(headers)) {
    throw new Error("Invalid headers provided: headers must be an array.");
  }
  if (!Array.isArray(rows)) {
    throw new Error("Invalid rows provided: rows must be an array.");
  }

  const initialY = doc.y;
  const margin = 50;
  const rowHeight = 25;
  const colCount = headers.length;
  const colWidth = (doc.page.width - margin * 2) / colCount;

  // Table Header
  doc.rect(margin, initialY, doc.page.width - margin * 2, rowHeight)
     .fill(PDFStyles.tableHeader.fill)
     .fillColor(PDFStyles.tableHeader.text)
     .font(PDFStyles.fontHeader)
     .fontSize(12);

  headers.forEach((header, i) => {
    doc.text(header, margin + (colWidth * i) + 10, initialY + 8);
  });

  // Table Rows
  let currentY = initialY + rowHeight;
  rows.forEach((row, rowIndex) => {
    const fillColor = rowIndex % 2 === 0 
      ? PDFStyles.tableRow.even 
      : PDFStyles.tableRow.odd;

    doc.rect(margin, currentY, doc.page.width - margin * 2, rowHeight)
       .fill(fillColor)
       .fillColor(PDFStyles.primaryColor)
       .font(PDFStyles.fontBody)
       .fontSize(11);

    row.forEach((cell, colIndex) => {
      doc.text(cell.toString(), margin + (colWidth * colIndex) + 10, currentY + 8);
    });

    currentY += rowHeight;
  });

  doc.moveDown(2);
};
