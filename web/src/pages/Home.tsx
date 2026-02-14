import { Link } from "react-router-dom";
import { features, steps } from "@/data";

function Header() {
  const BASE_URL = import.meta.env.VITE_API_URL;

  return (
    <header className="flex flex-col gap-y-10 py-20">
      <div className="flex flex-col gap-y-3 text-center">
        <h1 className="text-4xl font-bold sm:text-6xl">
          Upload images. Get URLs. Done.
        </h1>
        <p className="text-md mx-auto max-w-2xl opacity-70 sm:text-xl">
          The simplest, most reliable API for developers to handle image
          uploads, transformations, and delivery at scale.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Link to="/register" className="btn btn-primary btn-gradient">
            Get started for free
          </Link>

          <Link to="/docs" className="btn btn-secondary btn-gradient">
            Read the Docs
          </Link>
        </div>
      </div>
      <div>
        <div className="bg-base-200/50 border-secondary/10 rounded-2xl border p-5">
          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wider uppercase opacity-50">
              Example cURL
            </h4>
            <div className="mockup-code bg-neutral text-neutral-content shadow-xl">
              <pre data-prefix="$">
                <code>curl -X POST {BASE_URL}/images/upload \</code>
              </pre>
              <pre data-prefix=" ">
                <code> -H "x-upload-key: YOUR_UPLOAD_KEY" \</code>
              </pre>
              <pre data-prefix=" ">
                <code> -F "file=@logo.png"</code>
              </pre>
            </div>
          </div>
          <div>
            <h4 className="my-4 text-sm font-semibold tracking-wider uppercase opacity-50">
              Response JSON
            </h4>
            <div className="mockup-code bg-neutral text-neutral-content shadow-xl">
              <pre data-prefix="{">
                <code>
                  {`
    "success": true,
    "data": {
      "signKey": "img_1234567890",
      "url": "${BASE_URL}/images/view/img_1234567890.png",
      "filename": "logo.png",
      "mimeType": "image/png",
      "size": 12345,
      "createdAt": "2022-01-01T00:00:00.000Z"
    }
`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function Step() {
  return (
    <section className="flex flex-col gap-y-10 pb-20">
      <div className="text-center">
        <h2 className="text-3xl font-bold">How It Works</h2>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
        {steps?.map((step) => (
          <div key={step.title} className="card bg-base-200/50">
            <div className="card-body gap-1">
              <step.Icon size={25} className="text-primary mb-3" />
              <h3 className="text-lg">{step.title}</h3>
              <p className="text-sm opacity-70">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Feature() {
  return (
    <section className="flex flex-col gap-y-10 pb-20">
      <div className="text-center">
        <h2 className="text-3xl font-bold">
          Built for Developers, Trusted by Enterprise
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {features?.map((feature) => (
          <div key={feature.title} className="card bg-base-200/50">
            <div className="card-body gap-2.5 text-center">
              <feature.Icon size={25} className="text-primary mx-auto" />
              <h3 className="text-lg">{feature.title}</h3>
              <p className="text-sm opacity-70">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="pb-20">
      <div className="bg-primary/20 flex w-full flex-col items-center justify-center gap-5 gap-x-10 rounded-2xl p-10 sm:p-16 md:flex-row">
        <div>
          <h2 className="text-2xl leading-7 font-bold sm:text-3xl">
            Ready to simplify your image workflow?
          </h2>
          <p className="mt-2 text-sm opacity-80 sm:text-lg">
            Start for free and get your API key in minutes. No credit card
            required.
          </p>
        </div>
        <div>
          <Link
            to={"/register"}
            className="btn btn-primary btn-gradient whitespace-nowrap"
          >
            Register Now
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Home() {
  return (
    <>
      <Header />
      <Step />
      <Feature />
      <CTA />
    </>
  );
}
