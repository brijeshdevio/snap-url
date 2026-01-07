import { Link } from "react-router-dom";
import { features, steps } from "@/data";

function Header() {
  return (
    <header className="flex flex-col gap-y-10 py-20">
      <div className="flex flex-col gap-y-3 text-center">
        <h1 className="text-4xl sm:text-6xl font-bold">
          Upload images. Get URLs. Done.
        </h1>
        <p className="text-md sm:text-xl opacity-70 max-w-2xl mx-auto">
          The simplest, most reliable API for developers to handle image
          uploads, transformations, and delivery at scale.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
          <Link to="/signup" className="btn btn-primary btn-gradient">
            Get started for free
          </Link>

          <Link to="/docs" className="btn btn-secondary btn-gradient">
            Read the Docs
          </Link>
        </div>
      </div>
      <div>
        <div className="p-5 bg-base-200/50 border border-secondary/10 rounded-2xl">
          <div className="flex items-center gap-3">
            <span className="block w-3 h-3 bg-error rounded-full"></span>
            <span className="block w-3 h-3 bg-warning rounded-full"></span>
            <span className="block w-3 h-3 bg-primary rounded-full"></span>
          </div>
          <div className="mt-3 overflow-x-scroll">
            <pre>
              <code className="language-bash text-sm">{`$ curl -X POST https://api.snapurl.com/v1/upload \\
  -H 'Authorization: Bearer <YOUR_API_KEY>' \\
  -F 'file=@/path/to/your/image.jpg'

// Response
{
  "success": true,
  "data": {
    "id": "img_1a2b3c4d5e",
    "url": "https://cdn.snapurl.com/img_1a2b3c4d5e.jpg"
  }
}`}</code>
            </pre>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
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

export function Home() {
  return (
    <>
      <Header />
      <Step />
      <Feature />
      <section className="pb-20">
        <div className="w-full flex flex-col md:flex-row items-center gap-5 gap-x-10 justify-center bg-primary/20 p-10 sm:p-16 rounded-2xl">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold leading-7">
              Ready to simplify your image workflow?
            </h2>
            <p className="text-sm sm:text-lg opacity-80 mt-2">
              Start for free and get your API key in minutes. No credit card
              required.
            </p>
          </div>
          <div>
            <Link
              to={"/signup"}
              className="btn btn-primary btn-gradient whitespace-nowrap"
            >
              Sign up Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
