import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "site_settings",
    },
    heroImageUrl: {
      type: String,
      default: "/images/scraped_1.jpg",
    },
    aboutImageUrl: {
      type: String,
      default: "/images/scraped_2.jpeg",
    },
    officeAddress: {
      type: String,
      default: "ਕਿਸਾਨ ਭਵਨ, ਸੈਕਟਰ 35\nਚੰਡੀਗੜ੍ਹ, ਪੰਜਾਬ",
    },
    phoneNumbers: {
      type: String,
      default: "+91 98147 54739\n+91 89686 17046",
    },
    contactEmail: {
      type: String,
      default: "info@mislsatluj.com",
    },
    formRecipientEmail: {
      type: String,
      default: "info@mislsatluj.com",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
