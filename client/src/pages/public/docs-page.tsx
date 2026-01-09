import { MarkdownPreview } from "@/components";

export function DocsPage() {
  const apiURL = import.meta.env.VITE_API_URL;
  return (
    <>
      <section className="space-y-5 pt-5 pb-10">
        <h1 className="text-3xl font-bold mb-5">Introduction</h1>
        <p className="mt-2 opacity-80">
          Welcome to the SnapURL API documentation. Here you'll find everything
          you need to integrate with our image upload service.
        </p>
        <p>
          The SnapURL API provides a simple, programmatic way to upload and
          manage images. All API endpoints are RESTful and return JSON-encoded
          responses.
        </p>
      </section>
      <div className="border-t border-white/10" />
      <section className="space-y-5 pt-5 pb-10">
        <h2 className="text-2xl mb-3">Upload API</h2>
        <p className="mt-2 opacity-80">
          This endpoint allows you to upload an image. The request must be a{" "}
          <code className="font-mono text-primary bg-primary/20 px-2 py-1 rounded-full">
            multipart/form-data
          </code>{" "}
          request.
        </p>
        <div className="flex items-center gap-2">
          <button className="btn btn-primary btn-gradient" disabled>
            POST
          </button>
          <span>/upload</span>
        </div>
        <div>
          <h3 className="text-xl">Example Request (CURL)</h3>
          <MarkdownPreview
            source={`\`\`\`bash
curl -X POST ${apiURL}/uploads \\
  -H "X-Upload-Token: ssk_UPLOAD_TOKEN" \\
  -F "file=@/path/to/your/image.jpg"      
\`\`\``}
          />
        </div>
        <div className="space-y-3">
          <h3 className="text-xl">Example Request (JS)</h3>
          <MarkdownPreview
            source={`\`\`\`javascript
const formData = new FormData();
formData.append("file", fileInput.files[0]);
fetch("${apiURL}/uploads", {
  method: "POST",
  headers: {
    "X-Upload-Token": "ssk_UPLOAD_TOKEN"
  },
  body: formData
});
\`\`\``}
          />
          <h3 className="text-xl">Response</h3>
          <MarkdownPreview
            source={`\`\`\`json
{
  "success": true,
  "status": 200,
  "data": {
    "size": 4694,
    "mimeType": "image/jpeg",
    "width": 225,
    "height": 225,
    "url": "${apiURL}/images/qmjydjncawtcnosnpgpk",
    "format": "jpg",
    "bytes": 4610,
    "timestamp": "2026-01-08T12:16:32.777Z",
    "imageId": "img_0c4e7a457d1420f05142a167d47d8acc3186f454bad62b8b086aec5780b3875e"
  }
}
\`\`\``}
          />
        </div>
      </section>
      <div className="border-t border-white/10" />
      <section className="space-y-5 pt-5 pb-10">
        <h2 className="text-2xl mb-3">Limits</h2>
        <p className="mt-2 opacity-80">
          To ensure stability for all users, we enforce rate limits on API
          requests.
        </p>
        <div className="bg-primary/20 p-2 border-l-4 border-primary">
          The current rate limit is 100 requests per hour per API key. The
          maximum allowed file size for a single upload is 5MB.
        </div>
      </section>
    </>
  );
}
