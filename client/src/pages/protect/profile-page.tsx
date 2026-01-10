import { Pen } from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";
import { InputField } from "@/components";
import { useUpdateProfile } from "@/queries/user.query";

function AvatarSection() {
  const { user } = useAuth();

  return (
    <section className="mb-6">
      <div className="card bg-base-200 border border-white/10">
        <div className="card-body">
          <h2 className="text-xl font-bold text-white">Profile Picture</h2>
          <p className="opacity-90 text-sm">
            Update your profile picture. Please upload a square image.
          </p>
          <div className="avatar avatar-placeholder mt-3 relative w-fit">
            <div className="absolute right-[-10px] top-[-10px]">
              <button className="dropdown-toggle btn btn-text btn-circle dropdown-open:bg-base-content/10 dropdown-open:text-base-content">
                <Pen size={20} />
              </button>
            </div>
            {!user?.avatar ? (
              <div className="size-16 rounded-full">
                <img
                  src="https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png"
                  alt="avatar"
                />
              </div>
            ) : (
              <div className="bg-neutral text-neutral-content w-14 rounded-full">
                <span className="text-2xl uppercase">
                  {user?.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function PersonalInfoSection() {
  const { user } = useAuth();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateProfile(Object.fromEntries(formData) as unknown as { name: string });
  };

  return (
    <section className="mb-6 pb-10">
      <div className="card bg-base-200 border border-white/10">
        <div className="card-body">
          <h2 className="text-xl font-bold text-white">Personal Information</h2>
          <p className="opacity-90 text-sm">Update personal information.</p>
          <form className="flex flex-col gap-3 mt-2" onSubmit={handleSubmit}>
            <InputField
              label="Name"
              name="name"
              required
              defaultValue={user?.name}
            />
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
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export function ProfilePage() {
  return (
    <>
      <section className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl">Profile</h2>
            <p className="text-md opacity-80 mt-1 flex-wrap">
              Manage your profile details.
            </p>
          </div>
        </div>
      </section>
      <AvatarSection />
      <PersonalInfoSection />
    </>
  );
}
