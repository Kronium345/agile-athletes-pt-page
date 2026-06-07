const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const config = {
  CONTACT_EMAIL: process.env.CONTACT_EMAIL || "kroniumtechlimited123@gmail.com",
  MAILTO_SUBJECT:
    process.env.MAILTO_SUBJECT || "Early Trainer Partner – Agile Athletes",
  EMAILJS_PUBLIC_KEY: process.env.EMAILJS_PUBLIC_KEY || "",
  EMAILJS_SERVICE_ID: process.env.EMAILJS_SERVICE_ID || "",
  EMAILJS_TEMPLATE_ID: process.env.EMAILJS_TEMPLATE_ID || "",
};

const output = `// Auto-generated from .env — do not edit. Run: npm run config
export default ${JSON.stringify(config, null, 2)};
`;

const outPath = path.join(__dirname, "..", "js", "config.js");
fs.writeFileSync(outPath, output, "utf8");
console.log("Generated js/config.js");
