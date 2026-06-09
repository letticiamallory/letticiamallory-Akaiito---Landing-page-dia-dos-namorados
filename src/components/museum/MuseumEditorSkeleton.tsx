"use client";

export function MuseumEditorSkeleton() {
  return (
    <div className="museum-editor-skeleton" aria-hidden>
      <div className="museum-editor-skeleton__chandelier" />
      <div className="museum-editor-skeleton__frames">
        <div className="museum-editor-skeleton__frame museum-editor-skeleton__frame--lg" />
        <div className="museum-editor-skeleton__frame museum-editor-skeleton__frame--md" />
        <div className="museum-editor-skeleton__frame museum-editor-skeleton__frame--sm" />
      </div>
      <div className="museum-editor-skeleton__floor" />
    </div>
  );
}
