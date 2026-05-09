interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
}

export async function onRequestPost(context: {
  request: Request;
  env: Record<string, unknown>;
}): Promise<Response> {
  const { request, env } = context;

  try {
    const data = (await request.json()) as ContactFormData;
    const { name, email, company, message } = data;

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Faltan campos requeridos: nombre, email y mensaje son obligatorios" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "El email no tiene un formato válido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Send email using Resend (configure RESEND_API_KEY in Cloudflare dashboard)
    if (env.RESEND_API_KEY) {
      const RESEND_API_KEY = env.RESEND_API_KEY as string;

      const emailResponse = await fetch("https://api.resend.com/v1/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Contacto <contacto@humantalentevolution.com>",
          to: ["eva@humantalentevolution.com"],
          subject: `Nuevo contacto de ${name}`,
          html: `
            <h2>Nuevo mensaje de contacto</h2>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Empresa:</strong> ${company || "No especificada"}</p>
            <p><strong>Mensaje:</strong></p>
            <p>${message.replace(/\n/g, "<br>")}</p>
          `,
        }),
      });

      if (!emailResponse.ok) {
        console.error("Resend API error:", await emailResponse.text());
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Mensaje recibido correctamente" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return new Response(
      JSON.stringify({ error: "Error al procesar la solicitud" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function onRequestOptions(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
