const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");
const Machine = require("../models/Machine");
const PDFDocument = require("pdfkit");

// ----------------------------------------------------------
// PDF REPORT : période = week | month | 3months
// ----------------------------------------------------------
router.get("/pdf", async (req, res) => {
  try {
    const { period } = req.query;  // "week" | "month" | "3months"

    let dateFilter = new Date();
    if (period === "week") dateFilter.setDate(dateFilter.getDate() - 7);
    if (period === "month") dateFilter = new Date(dateFilter.setMonth(dateFilter.getMonth() - 1));
    if (period === "3months") dateFilter = new Date(dateFilter.setMonth(dateFilter.getMonth() - 3));

    const alerts = await Alert.find({ date: { $gte: dateFilter } }).sort({ date: -1 });

    // -------------------------------
    //  Génération du PDF
    // -------------------------------
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=rapport.pdf");

    doc.pipe(res);

    doc.fontSize(20).text("Rapport de Maintenance", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Période du rapport : ${period}`);
    doc.text(`Nombre total d’alertes : ${alerts.length}`);
    doc.moveDown();

    alerts.forEach(a => {
      doc.text(`Machine : ${a.machineId}`);
      doc.text(`Type : ${a.type}`);
      doc.text(`Valeur : ${a.value}`);
      doc.text(`Message : ${a.message || "-"}`);
      doc.text(`Date : ${a.date.toLocaleString()}`);
      doc.moveDown();
      doc.moveDown();
    });

    doc.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erreur génération PDF" });
  }
});

module.exports = router;
