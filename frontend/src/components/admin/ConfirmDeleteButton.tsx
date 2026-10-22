"use client";

export default function ConfirmDeleteButton({
  skillName,
  className,
}: {
  skillName: string;
  className?: string;
}) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (
          !window.confirm(`Delete skill "${skillName}"? This cannot be undone.`)
        ) {
          e.preventDefault();
        }
      }}
      className={className}
      title={`Delete ${skillName}`}>
      Delete
    </button>
  );
}
