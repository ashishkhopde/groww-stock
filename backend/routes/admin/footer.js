import express from "express";
import FooterSettings from "../../models/footerSettings.js";

const router = express.Router();


// GET FOOTER SETTINGS
router.get("/footer", async (req, res) => {

  try {

    let settings = await FooterSettings.findOne();

    if (!settings) {
      settings = await FooterSettings.create({});
    }

    res.json(settings);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

});


// UPDATE FOOTER SETTINGS
router.put("/footer", async (req, res) => {

  try {

    const { address, email, mapLink } = req.body;

    let settings = await FooterSettings.findOne();

    if (!settings) {

      settings = new FooterSettings({
        address,
        email,
        mapLink
      });

    } else {

      settings.address = address;
      settings.email = email;
      settings.mapLink = mapLink;

    }

    await settings.save();

    res.json({ message: "Footer Updated Successfully" });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

});

export default router;