import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

export function Docs() {
  const sections = [
    { id: "overview", label: "Overview", icon: "tabler:info-circle" },
    { id: "getting-started", label: "Getting Started", icon: "tabler:rocket" },
    { id: "authentication", label: "Authentication", icon: "tabler:key" },
    { id: "upload-api", label: "Upload API", icon: "tabler:upload" },
  ];
  const BASE_URL = import.meta.env.VITE_API_URL;

  return (
    <div className="bg-base-100 min-h-screen">
      {/* Hero Section */}
      <div className="bg-primary/5 border-base-content/5 border-b py-16 lg:py-24">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="bg-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium">
              <Icon icon="tabler:sparkles" className="h-4 w-4" />
              <span>Developer Documentation</span>
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight lg:text-6xl">
              SnapURL <span className="text-primary">API</span>
            </h1>
            <p className="text-base-content/70 mb-8 text-xl leading-relaxed">
              The simplest way to upload and manage images for your logos,
              avatars, and social media assets. Get permanent URLs in seconds.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="btn btn-primary btn-lg">
                Get Started
              </Link>
              <a href="#authentication" className="btn btn-outline btn-lg">
                View Auth
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row">
          {/* Sidebar */}
          <aside className="w-full shrink-0 lg:w-64">
            <div className="sticky top-24 space-y-8">
              <div>
                <h5 className="text-base-content/40 mb-4 px-4 text-sm font-semibold tracking-wider uppercase">
                  Navigation
                </h5>
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="text-base-content/70 hover:text-primary hover:bg-primary/5 group flex items-center gap-3 rounded-lg px-4 py-2.5 transition-all"
                    >
                      <Icon
                        icon={section.icon}
                        className="h-5 w-5 transition-transform group-hover:scale-110"
                      />
                      <span className="font-medium">{section.label}</span>
                    </a>
                  ))}
                </nav>
              </div>

              <div className="bg-base-200/50 border-base-content/5 rounded-2xl border p-4">
                <h6 className="mb-2 font-semibold">Need help?</h6>
                <p className="text-base-content/60 mb-4 text-sm">
                  Can't find what you're looking for? Reach out to our support.
                </p>
                <button className="btn btn-sm btn-block">
                  Contact Support
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="max-w-4xl flex-1 space-y-24 pb-24">
            {/* Overview */}
            <section id="overview" className="scroll-mt-24">
              <h2 className="mb-6 flex items-center gap-3 text-3xl font-bold">
                <span className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl font-mono">
                  01
                </span>
                Overview
              </h2>
              <div className="prose prose-lg text-base-content/80 max-w-none">
                <p>
                  SnapURL is a SaaS web platform designed for developers to
                  upload and manage images effortlessly. Whether you need to
                  host logos, user avatars, or social media assets, SnapURL
                  provides a secure, fast, and simple API to get the job done.
                </p>
                <div className="my-10 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="card bg-base-200 border-base-content/5 h-full border p-6">
                    <Icon
                      icon="tabler:bolt"
                      className="text-warning mb-4 h-8 w-8"
                    />
                    <h3 className="mb-2 text-lg font-bold">High Speed</h3>
                    <p className="text-sm">
                      Optimized delivery for small application assets and fast
                      upload turnaround.
                    </p>
                  </div>
                  <div className="card bg-base-200 border-base-content/5 h-full border p-6">
                    <Icon
                      icon="tabler:lock"
                      className="text-success mb-4 h-8 w-8"
                    />
                    <h3 className="mb-2 text-lg font-bold">Secure</h3>
                    <p className="text-sm">
                      Project-scoped API keys and JWT-based authentication for
                      the dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Getting Started */}
            <section id="getting-started" className="scroll-mt-24">
              <h2 className="mb-6 flex items-center gap-3 text-3xl font-bold">
                <span className="bg-secondary/10 text-secondary flex h-10 w-10 items-center justify-center rounded-xl font-mono">
                  02
                </span>
                Getting Started
              </h2>
              <div className="space-y-6">
                <p className="text-base-content/70 text-lg">
                  Follow these steps to start using SnapURL in your project:
                </p>
                <ol className="steps steps-vertical space-y-8">
                  <li className="step step-primary min-h-0 flex-col items-start text-left">
                    <div className="ml-4">
                      <h4 className="text-xl font-bold">Create an Account</h4>
                      <p className="text-base-content/60 mt-1">
                        Sign up on our platform and log in to your dashboard.
                      </p>
                    </div>
                  </li>
                  <li className="step step-primary min-h-0 flex-col items-start text-left">
                    <div className="ml-4">
                      <h4 className="text-xl font-bold">Create a Project</h4>
                      <p className="text-base-content/60 mt-1">
                        Projects help you organize your assets. Navigate to the
                        Projects section and create a new one.
                      </p>
                    </div>
                  </li>
                  <li className="step step-primary min-h-0 flex-col items-start text-left">
                    <div className="ml-4">
                      <h4 className="text-xl font-bold">Generate an API Key</h4>
                      <p className="text-base-content/60 mt-1">
                        Go to the API Keys tab within your project and generate
                        a new key with 'UPLOAD' permissions.
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
            </section>

            {/* Authentication */}
            <section id="authentication" className="scroll-mt-24">
              <h2 className="mb-6 flex items-center gap-3 text-3xl font-bold">
                <span className="bg-accent/10 text-accent flex h-10 w-10 items-center justify-center rounded-xl font-mono">
                  03
                </span>
                Authentication
              </h2>
              <div className="space-y-6">
                <p className="text-base-content/70 text-lg">
                  SnapURL uses API keys to authenticate projects. Only upload
                  requests include the <code>x-upload-key</code> header.
                </p>
                <div className="mockup-code bg-neutral text-neutral-content shadow-xl">
                  <pre data-prefix=">">
                    <code>x-upload-key: YOUR_UPLOAD_KEY</code>
                  </pre>
                </div>
              </div>
            </section>

            {/* Upload API */}
            <section id="upload-api" className="scroll-mt-24">
              <h2 className="mb-6 flex items-center gap-3 text-3xl font-bold">
                <span className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl font-mono">
                  04
                </span>
                Upload API
              </h2>
              <div className="space-y-8">
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="badge badge-primary font-bold">POST</span>
                    <code className="text-lg opacity-80">
                      /api/images/upload
                    </code>
                  </div>
                  <p className="text-base-content/70 mb-6">
                    Upload a single image and get a publicly accessible URL.
                  </p>

                  <h4 className="mb-4 text-sm font-semibold tracking-wider uppercase opacity-50">
                    Request Body (multipart/form-data)
                  </h4>
                  <div className="border-base-content/5 overflow-x-auto rounded-xl border">
                    <table className="table-zebra table">
                      <thead>
                        <tr>
                          <th>Field</th>
                          <th>Type</th>
                          <th>Required</th>
                          <th>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <code>file</code>
                          </td>
                          <td>File</td>
                          <td>
                            <span className="text-success">Yes</span>
                          </td>
                          <td>The image file (jpg, png, webp)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

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
                  <h4 className="mb-4 text-sm font-semibold tracking-wider uppercase opacity-50">
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
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
