import {
  CloudUpload,
  DollarSign,
  Link2,
  LoaderCircle,
  ShieldCheck,
  Upload,
  Zap,
} from "lucide-react";

export const steps = [
  {
    Icon: Upload,
    title: "1. Send Request",
    description:
      "Upload your image file via a simple POST request to our secure endpoint.",
  },
  {
    Icon: LoaderCircle,
    title: "2. We Process It",
    description:
      "Our powerful infrastructure handles optimization, resizing, and storage in milliseconds.",
  },
  {
    Icon: Link2,
    title: "3. Get URL Back",
    description:
      "Receive a direct, CDN-ready URL in the API response instantly.",
  },
];

export const features = [
  {
    Icon: CloudUpload,
    title: "99.9% Uptime",
    description:
      "Reliability you can count on for mission-critical applications.",
  },
  {
    Icon: Zap,
    title: "Blazing Fast CDN",
    description:
      "Deliver images to your users at lightning speed, anywhere in the world.",
  },
  {
    Icon: ShieldCheck,
    title: "Secure & Scalable",
    description:
      "Built with security best practices and scales with your growth.",
  },
  {
    Icon: DollarSign,
    title: "Simple Pricing",
    description:
      "Transparent, predictable pricing. No hidden fees or surprises.",
  },
];

export const playgroundSource = `
**HTML**
\`\`\`html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Image Upload</title>
  </head>
  <body>
    <h2>Upload Image</h2>
    <input type="file" id="imageInput" accept="image/*" />
    <button onclick="uploadImage()">Upload</button>
    <p id="status"></p>
    <script src="upload.js"></script>
  </body>
</html>
\`\`\`

**JavaScript**

\`\`\`javascript
async function uploadImage() {
  const input = document.getElementById("imageInput");
  const status = document.getElementById("status");

  if (!input.files.length) {
    status.textContent = "Please select an image.";
    return;
  }

  const file = input.files[0];

  // Create FormData
  const formData = new FormData();
  formData.append("image", file); // "image" = API field name

  try {
    const response = await fetch("http://localhost:4000/api/uploads", {
      method: "POST",
      headers: {
        "X-Upload-Token": "ssk_SECRET_API_KEY"
      },
      body: formData
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Upload failed");
    }

    status.textContent = "Upload successful!";
    console.log("API Response:", result);

  } catch (error) {
    status.textContent = "Error: " + error.message;
  }
}
\`\`\`

`;
