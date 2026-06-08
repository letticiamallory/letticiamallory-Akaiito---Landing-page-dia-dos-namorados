export function buildGiftLinkEmail({
  giftLink,
  coupleNames,
}: {
  giftLink: string;
  coupleNames?: string;
}) {
  const title = coupleNames
    ? `O presente de ${coupleNames} está pronto`
    : "Seu presente está pronto";

  const preview = coupleNames
    ? `O link do presente de ${coupleNames} já está disponível.`
    : "Seu link exclusivo já está disponível.";

  const text = [
    title,
    "",
    preview,
    "",
    giftLink,
    "",
    "Guarde este link. Você pode compartilhar quando quiser.",
    "",
    "Com carinho,",
    "Equipe Akaiito",
  ].join("\n");

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
  </head>
  <body style="margin:0;padding:0;background:#0d0a0b;font-family:Georgia,'Times New Roman',serif;color:#f5ede6;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0d0a0b;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:#1a1214;border:1px solid rgba(196,66,106,0.25);border-radius:20px;overflow:hidden;">
            <tr>
              <td style="padding:28px 28px 12px;text-align:center;">
                <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#c4426a;">Akaiito</p>
                <h1 style="margin:0;font-size:28px;line-height:1.2;font-weight:400;color:#f5ede6;">${title}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 28px 20px;text-align:center;">
                <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(245,237,230,0.78);">${preview}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 24px;">
                <div style="background:#120404;border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:16px 18px;word-break:break-all;font-size:14px;line-height:1.6;color:#f5ede6;">
                  ${giftLink}
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 28px;text-align:center;">
                <a href="${giftLink}" style="display:inline-block;background:#f5ede6;color:#3c140a;text-decoration:none;font-size:15px;font-weight:600;padding:14px 28px;border-radius:999px;">
                  Abrir presente
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 28px;text-align:center;">
                <p style="margin:0;font-size:13px;line-height:1.6;color:rgba(245,237,230,0.55);">
                  Guarde este e-mail. O link é permanente e você pode enviar quando quiser.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`.trim();

  return {
    subject: title,
    text,
    html,
  };
}
