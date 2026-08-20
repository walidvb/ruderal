"use client";

export default function SignOutButton({
  className = "underline underline-offset-4",
}: {
  className?: string;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        await fetch("/auth/signout", { method: "POST" });
        location.reload();
      }}
    >
      Sign out
    </button>
  );
}
