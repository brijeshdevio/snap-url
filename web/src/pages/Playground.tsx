import { useState } from "react";
import { Icon } from "@iconify/react";
import axios from "axios";
import { Button, Input } from "@/components/ui";
import { notifyError, notifySuccess } from "@/utils";

export function Playground() {
  const [uploadKey, setUploadKey] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<Record<string, unknown> | null>(
    null,
  );
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const BASE_URL = import.meta.env.VITE_API_URL;

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadKey) {
      return notifyError({
        response: { data: { message: "Upload key is required" } },
      });
    }
    if (!file) {
      return notifyError({
        response: { data: { message: "Please select a file" } },
      });
    }

    setIsLoading(true);
    setResponse(null);
    setUploadedUrl(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await axios.post(`${BASE_URL}/images/upload`, formData, {
        headers: {
          "x-upload-key": uploadKey,
          "Content-Type": "multipart/form-data",
        },
      });

      setResponse(data);
      if (data.success && data.data?.url) {
        setUploadedUrl(data.data.url);
        notifySuccess("Image uploaded successfully!");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setResponse(error.response?.data || { message: error.message });
      } else {
        setResponse({ message: String(error) });
      }
      notifyError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-10 py-10">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">API Playground</h1>
        <p className="text-base-content/70 mx-auto max-w-2xl">
          Test the SnapURL upload API directly from your browser. Use your
          project upload key to send images to our servers.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Interaction Form */}
        <div className="card bg-base-200/50 space-y-6 border border-white/5 p-6">
          <form onSubmit={handleUpload} className="space-y-6">
            <Input
              label="Upload Key (x-upload-key)"
              placeholder="Paste your upload key here..."
              value={uploadKey}
              onChange={(e) => setUploadKey(e.target.value)}
              className="font-mono text-sm"
              required
            />

            <div className="space-y-2">
              <label className="text-base-content/70 text-sm font-medium">
                Select Image
              </label>
              <div
                className={`hover:border-primary/50 group relative rounded-xl border-2 border-dashed border-white/10 p-8 text-center transition-colors ${file ? "bg-primary/5 border-primary/30" : ""}`}
              >
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  accept="image/*"
                />
                <Icon
                  icon={file ? "tabler:photo-check" : "tabler:cloud-upload"}
                  className={`mx-auto mb-4 h-12 w-12 transition-transform group-hover:scale-110 ${file ? "text-primary" : "text-base-content/30"}`}
                />
                <p className="text-sm">
                  {file ? (
                    <span className="text-primary font-semibold">
                      {file.name}
                    </span>
                  ) : (
                    "Click or drag image to upload"
                  )}
                </p>
                <p className="text-base-content/40 mt-1 text-xs">
                  Supports JPG, PNG, WebP up to 5MB
                </p>
              </div>
            </div>

            <Button
              type="submit"
              className="btn btn-primary btn-block h-12"
              isLoading={isLoading}
              isDisabled={!file || !uploadKey}
            >
              <Icon icon="tabler:rocket" className="mr-2 h-5 w-5" />
              Upload to SnapURL
            </Button>
          </form>

          {uploadedUrl && (
            <div className="animate-in fade-in slide-in-from-bottom-4 border-t border-white/5 pt-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                <Icon icon="tabler:photo" className="text-success" />
                Upload Successful
              </h3>
              <div className="overflow-hidden rounded-xl border border-white/5 bg-black/40 ring-1 ring-white/10">
                <img
                  src={uploadedUrl}
                  alt="Uploaded"
                  className="mx-auto max-h-75 w-full object-contain"
                />
              </div>
              <div className="mt-4 flex gap-2">
                <Input
                  value={uploadedUrl}
                  readOnly
                  className="font-mono text-xs"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(uploadedUrl);
                    notifySuccess("URL copied to clipboard");
                  }}
                  className="btn btn-square"
                >
                  <Icon icon="tabler:copy" className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Response Visualization */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-semibold tracking-wider uppercase opacity-50">
              API Response
            </h2>
            {response && (
              <span
                className={`rounded px-2 py-0.5 font-mono text-xs ${response.success ? "bg-success/20 text-success" : "bg-error/20 text-error"}`}
              >
                {response.success ? "200 OK" : "ERROR"}
              </span>
            )}
          </div>

          <div className="mockup-code min-h-100 bg-black/60 text-emerald-400 shadow-2xl ring-1 ring-white/10">
            {response ? (
              <pre className="px-5">
                <code>{JSON.stringify(response, null, 2)}</code>
              </pre>
            ) : (
              <div className="flex h-full flex-col items-center justify-center py-10 opacity-20">
                <Icon icon="tabler:terminal-2" className="mb-2 h-16 w-16" />
                <p>Waiting for request...</p>
              </div>
            )}
          </div>

          <div className="alert alert-soft alert-warning flex items-center gap-2 text-xs">
            <Icon icon="tabler:alert-triangle" className="h-4 w-4 shrink-0" />
            <span>
              Usage of this playground will count towards your project's upload
              limits.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
