import { jsPDF } from "jspdf";
import type { RecommendedProduct } from "@/lib/types";

interface ExportShoppingListOptions {
  projectName: string;
  products: RecommendedProduct[];
  ownedIds: Set<string>;
  regionName?: string;
}

export function exportShoppingListPdf({
  projectName,
  products,
  ownedIds,
  regionName,
}: ExportShoppingListOptions): void {
  const toBuy = products.filter((p) => !ownedIds.has(p.id));
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const margin = 18;
  let y = margin;

  doc.setFontSize(18);
  doc.text("Irrigate.fr — Liste d'achats", margin, y);
  y += 10;

  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text(`Projet : ${projectName}`, margin, y);
  y += 6;
  if (regionName) {
    doc.text(`Région : ${regionName}`, margin, y);
    y += 6;
  }
  doc.text(`Date : ${new Date().toLocaleDateString("fr-FR")}`, margin, y);
  y += 12;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(13);
  doc.text(`Matériel à acheter (${toBuy.length} article${toBuy.length > 1 ? "s" : ""})`, margin, y);
  y += 8;

  doc.setFontSize(10);
  let total = 0;

  if (toBuy.length === 0) {
    doc.text("Vous possédez déjà tout le matériel recommandé !", margin, y);
  } else {
    for (const product of toBuy) {
      if (y > 270) {
        doc.addPage();
        y = margin;
      }
      doc.setFont("helvetica", "bold");
      doc.text(product.name, margin, y);
      doc.setFont("helvetica", "normal");
      doc.text(`~${product.priceEstimate} €`, 170, y, { align: "right" });
      y += 5;
      doc.setTextColor(60, 60, 60);
      const lines = doc.splitTextToSize(product.description, 170);
      doc.text(lines, margin, y);
      y += lines.length * 4 + 2;
      doc.text(`Où : ${product.shopHint}`, margin, y);
      y += 8;
      doc.setTextColor(0, 0, 0);
      total += product.priceEstimate;
    }

    y += 4;
    doc.setFont("helvetica", "bold");
    doc.text(`Total estimé : ~${total} €`, margin, y);
  }

  y += 14;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(
    "Estimations indicatives — vérifiez les quantités en jardinerie. irrigate.fr",
    margin,
    y
  );

  doc.save(`irrigate-liste-achats-${projectName.replace(/\s+/g, "-").toLowerCase()}.pdf`);
}
