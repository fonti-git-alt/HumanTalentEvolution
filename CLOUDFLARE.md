# Cloudflare Pages Configuration

name = "human-talent-evo"
compatibility_date = "2024-01-01"

# Build settings
compatibility_flags = ["nodejs_compat"]

[vars]
# Add environment variables here
```

# Contact Form API Worker

To enable the contact form, create a Cloudflare Worker at `functions/api/contact.ts`:

```typescript
export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    const data = await request.json();
    const { name, email, company, message } = data;
    
    // Validate required fields
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Send email using Cloudflare Email Workers or a service like Resend
    // Example with Resend:
    // const resend = new Resend(env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'contacto@humantalentevolution.com',
    //   to: 'eva@humantalentevolution.com',
    //   subject: `Nuevo contacto de ${name}`,
    //   html: `
    //     <h2>Nuevo mensaje de contacto</h2>
    //     <p><strong>Nombre:</strong> ${name}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>Empresa:</strong> ${company || 'No especificada'}</p>
    //     <p><strong>Mensaje:</strong></p>
    //     <p>${message}</p>
    //   `
    // });
    
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Error al procesar la solicitud' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
```

## Setup Instructions

1. **Deploy to Cloudflare Pages**:
   ```bash
   wrangler pages deploy dist
   ```

2. **Configure environment variables** (in Cloudflare Dashboard):
   - `RESEND_API_KEY` (if using Resend for emails)

3. **Or use Formspree** (simpler alternative):
   - Replace form action with Formspree endpoint
   - Update `ContactForm.astro`:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```

## Build Command
```bash
npm run build
```

## Output Directory
```
dist/
```
