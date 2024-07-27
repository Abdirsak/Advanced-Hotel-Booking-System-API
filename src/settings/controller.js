import Setting from "./model.js";

export const upsertSetting = async (req, res) => {
  const { name, currency, address, city, country, phone } = req.body;
  const logo = req.file ? req.file.filename : req.body.logo;

  try {
    let setting = await Setting.findOne();
    if (setting) {
      // Update existing setting
      setting.companyInfo = {
        name,
        logo,
        currency,
        address,
        city,
        country,
        phone,
      };
    } else {
      // Create new setting
      setting = new Setting({
        companyInfo: { name, logo, currency, address, city, country, phone },
      });
    }

    await setting.save();
    res.status(200).json(setting);
  } catch (err) {
    res.status(500).json({ error: "Failed to save setting" });
  }
};
