import { CloudUpload, DollarSign, Link2, LoaderCircle, ShieldCheck, Upload, Zap } from "lucide-react";

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
    Icon: CloudUpload ,
    title: "99.9% Uptime",
    description:
      "Reliability you can count on for mission-critical applications.",
  },
    {
    Icon: Zap ,
    title: "Blazing Fast CDN",
    description:
      "Deliver images to your users at lightning speed, anywhere in the world.",
  },
      {
    Icon: ShieldCheck ,
    title: "Secure & Scalable",
    description:
      "Built with security best practices and scales with your growth.",
  },
      {
    Icon: DollarSign ,
    title: "Simple Pricing",
    description:
      "Transparent, predictable pricing. No hidden fees or surprises.",
  },
];
