export type SignupForm = {
  name: string;
  email: string;
  password: string;
};

export type LoginForm = {
  email: string;
  password: string;
};

export type ResetPasswordForm = {
  newPassword: string;
  confirmPassword: string;
};
