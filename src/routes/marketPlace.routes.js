const express = require("express");
const {
  addMarketPlace,
  getAllMarketPlace,
  deleteMarketPlace,
  updateMarketPlace,
} = require("../controllers/marketPlace/marketPlace.controllers");

const router = express.Router();

router.post("/post-marketPlace", addMarketPlace);
router.get("/get-marketPlace", getAllMarketPlace);
router.delete("/delete-marketPlace/:id", deleteMarketPlace);
router.patch("/edit-marketPlace/:id", updateMarketPlace);

module.exports = router;
