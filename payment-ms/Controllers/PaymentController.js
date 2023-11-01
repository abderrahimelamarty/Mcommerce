const express = require("express");
const router = express.Router();
const Paiement = require("../Models/PaymentModel");
const axios = require("axios");

router.post("/payments", async (req, res) => {
  const paymentData = req.body;

  try {
    const existingPaiement = await Paiement.findOne({
      idCommand: paymentData.idCommand,
    });

    if (existingPaiement) {
      return res.status(409).json({ error: "Cette commande est déjà payée" });
    }

    const newPayment = await Paiement.create(paymentData);

    if (!newPayment) {
      return res.status(500).json({
        error: "Erreur, impossible d'établir le paiement, réessayez plus tard",
      });
    }

    console.log(newPayment);

    const commandeResponse = await axios.get(
      `http://localhost:8081/commands/${newPayment.idCommand}`
    );
    const commandData = commandeResponse.data;

    if (!commandData) {
      return res
        .status(404)
        .json({ error: "La commande correspondante n'a pas été trouvée" });
    }

    // Update the Commande to mark it as paid
    commandData.commandePayee = true;

    const updateCommandeResponse = await axios.put(
      `http://localhost:8081/commands/${newPayment.idCommand}`,
      commandData
    );

    if (updateCommandeResponse.status !== 200) {
      return res
        .status(500)
        .json({ error: "Erreur lors de la mise à jour de la commande" });
    }

    return res.status(201).json(newPayment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Une erreur est survenue lors du paiement" });
  }
});

module.exports = router;
