"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0d0a0b",
          color: "#ede8e4",
          fontFamily: "system-ui, sans-serif",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "28rem", textAlign: "center" }}>
          <h2 style={{ marginBottom: "0.75rem", fontSize: "1.25rem" }}>
            Algo deu errado
          </h2>
          <p style={{ marginBottom: "1.5rem", opacity: 0.6, fontSize: "0.875rem" }}>
            {error.message || "Erro inesperado ao carregar a página."}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              background: "#c4426a",
              color: "#fff",
              border: "none",
              borderRadius: "9999px",
              padding: "0.75rem 1.5rem",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            Tentar de novo
          </button>
        </div>
      </body>
    </html>
  );
}
