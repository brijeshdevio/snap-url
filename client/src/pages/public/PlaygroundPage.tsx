import { InputField, MarkdownPreview } from "@/components";
import { playgroundSource } from "@/data";
import { useUploadImage } from "@/queries/playground.query";

function PlaygroundSection() {
  const { mutate, isPending, data } = useUploadImage();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    mutate(Object.fromEntries(formData));
  };
  console.log(data);

  return (
    <div className="w-full">
      <form className="flex flex-col gap-y-3" onSubmit={handleSubmit}>
        <InputField
          label="Secret API Key"
          name="secret"
          placeholder="e.g. ssk_daf7c0fafb317ea1992fc831344234209b450452e4f62176c013e4f53b3648ca"
          required
        />
        <InputField type="file" name="file" required />
        <div>
          <button
            type="submit"
            className="btn btn-primary btn-gradient"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <span className="loading loading-spinner"></span>
              </>
            ) : (
              <>
                <span>Submit</span>
              </>
            )}
          </button>
        </div>
      </form>
      {data?.success && (
        <div className="mt-3">
          <MarkdownPreview
            source={`
\`\`\`json
${JSON.stringify(data, null, 2)}
\`\`\`
            `}
          />
        </div>
      )}
    </div>
  );
}

export function PlaygroundPage() {
  return (
    <>
      <section className="p-5 bg-base-200/50 border border-secondary/10 rounded-2xl">
        <h2 className="text-2xl">Playground</h2>
        <div className="divider mt-3" />
        <div className="flex flex-col lg:flex-row gap-3 mt-5">
          <PlaygroundSection />
          <div className="w-full rounded-2xl overflow-hidden shadow border border-white/5">
            <MarkdownPreview source={playgroundSource} />
          </div>
        </div>
      </section>
    </>
  );
}
