import Plan from "../models/Plan.js";

export const seedPlans = async () => {

  const count = await Plan.countDocuments();

  if (count === 0) {

    await Plan.insertMany([
      {
        name: "Standard Plan",
        roi: "20% ROI",
        price: "₹ 25,000",
        features: [
          "Index Options Focus",
          "20% Max Return Guarantee",
          "Monthly Withdrawal Access",
          "Basic Support"
        ],
        color: "emerald"
      },
      {
        name: "Special User Plan",
        roi: "30% ROI",
        price: "₹ 50,000",
        features: [
          "Index & Futures Trading",
          "30% Max Return Guarantee",
          "Daily Withdrawal Access",
          "Priority Support"
        ],
        featured: true,
        color: "blue"
      },
      {
        name: "Premium Plan",
        roi: "40% ROI",
        price: "₹ 1,00,000",
        features: [
          "Stock, Index & Commodity",
          "40% Max Return Guarantee",
          "Lifetime Validity",
          "24/7 Analyst Support"
        ],
        color: "purple"
      }
    ]);

    console.log("Plans inserted");

  }

};