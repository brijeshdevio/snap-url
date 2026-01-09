import { useAuth } from "@/app/providers/AuthProvider";
import { InputField } from "@/components";
import { useChangeEmail } from "@/queries/user.query";

const changePasswordForm = [
  {
    label: "Current Password",
    type: "password",
    placeholder: "Enter your current password",
  },
  {
    label: "New Password",
    type: "password",
    placeholder: "Enter a new password",
  },
  {
    label: "Confirm New Password",
    type: "password",
    placeholder: "Confirm your new password",
  },
];

function ChangeEmailSection() {
  const { user } = useAuth();
  const { mutate: changeEmail, isPending } = useChangeEmail();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    changeEmail(Object.fromEntries(formData) as unknown as { email: string });
  };

  return (
    <section className="mb-6">
      <div className="card bg-base-200">
        <div className="card-body">
          <h2 className="text-xl font-bold text-white">Account Settings</h2>
          <p className="opacity-90">
            Update your account email address. Please note that changing your
            email will require you to re-verify your account.
          </p>
          <form className="flex flex-col gap-3 mt-2" onSubmit={handleSubmit}>
            <InputField
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter new email address"
              defaultValue={user?.email}
              required
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
                    <span>Change Email</span>
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

function ChangePasswordSection() {
  return (
    <section className="mb-6">
      <div className="card bg-base-200">
        <div className="card-body">
          <h2 className="text-xl font-bold text-white">Password</h2>
          <p className="opacity-90">
            For security, we recommend using a long, unique password. After
            updating, you will be logged out of all other active sessions.
          </p>
          <form className="flex flex-col gap-3 mt-2">
            {changePasswordForm.map((field, index) => (
              <InputField key={index} {...field} />
            ))}
            <div>
              <button type="submit" className="btn btn-primary">
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function DangerZoneSection() {
  return (
    <section className="mb-6 pb-10">
      <div className="card bg-error/10 border border-error/50">
        <div className="card-body space-y-2">
          <h2 className="text-xl font-bold text-error">Danger Zone</h2>
          <p className="text-error/80">
            Deleting your account is a permanent action. All your API keys,
            uploaded images, and account data will be irretrievably lost. Please
            be certain before proceeding.
          </p>
          <div>
            <button className="btn btn-error btn-gradient">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SettingPage() {
  return (
    <>
      <section className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl">Settings</h2>
            <p className="text-md opacity-80 mt-1 flex-wrap">
              Manage your account settings and preferences.
            </p>
          </div>
        </div>
      </section>
      <ChangeEmailSection />
      <ChangePasswordSection />
      <DangerZoneSection />
    </>
  );
}
