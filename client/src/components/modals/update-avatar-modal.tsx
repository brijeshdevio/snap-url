import { useUpdateAvatar } from "@/queries/user.query";
import { useRef, useState } from "react";

export function UpdateAvatarModal() {
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { handleUpload, isLoading } = useUpdateAvatar();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      handleUpload(file);
    }
  };

  const handleOpenFile = () => {
    fileRef.current?.click();
  };

  return (
    <div className="card w-full sm:w-[600px] border border-white/5 shadow-xl">
      <div className="card-body">
        <div className="text-center p-12">
          <p className="text-base-content/50 mb-3 text-sm">
            Choose a file with a size up to 2MB.
          </p>
          <button
            className="btn btn-soft btn-sm btn-primary text-nowrap"
            onClick={handleOpenFile}
          >
            {" "}
            <span className="icon-[tabler--file-upload] size-4.5 shrink-0"></span>{" "}
            Drag & Drop to Upload{" "}
          </button>
          <p className="text-base-content/50 my-2 text-xs">or</p>
          <p
            className="link link-animated link-primary font-medium text-sm"
            onClick={handleOpenFile}
          >
            Browse
          </p>
          <form onSubmit={handleSubmit}>
            <input
              type="file"
              accept="image/*"
              ref={fileRef}
              className="hidden"
              name="avatar"
              onChange={(e) => {
                if (e.target.files) {
                  setFile(e.target.files[0]);
                }
              }}
              required
            />
            <div>
              {file && (
                <p className="text-base-content/50 my-2 text-xs">
                  Selected file: {file.name}
                </p>
              )}
              <button
                className="btn btn-primary mt-2 btn-gradient"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                  </>
                ) : (
                  <>Upload</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
