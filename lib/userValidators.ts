type UserFormValues = {
  name: string;
  email: string;
};

export function validateUserForm(values: UserFormValues): string | null {
  const name = values.name.trim();
  const email = values.email.trim();

  if (!name) return "Name is required.";
  if (name.length > 8) return "Name must be max 8 characters.";

  if (!email) return "Email is required.";

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) return "Email is not valid.";

  return null;
}
