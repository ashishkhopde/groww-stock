import express from "express";
import Plan from "../../models/Plan.js";

const router = express.Router();


// GET ALL PLANS
router.get("/plans", async (req, res) => {

  const plans = await Plan.find();

  res.json(plans);

});


// UPDATE PLAN
router.put("/plans/:id", async (req, res) => {

  const updated = await Plan.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updated);

});

export default router;