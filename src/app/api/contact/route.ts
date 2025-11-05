import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema
const contactSchema = z.object({
  message: z.string().min(1, 'Message is required').max(2000, 'Message too long'),
  name: z.string().max(100).optional(),
  email: z.string().email('Invalid email').max(100).optional().or(z.literal('')),
  discord: z.string().max(100).optional(),
  phone: z.string().max(50).optional(),
  facebook: z.string().url('Invalid Facebook URL').max(200).optional().or(z.literal('')),
  source: z.enum(['web', 'ssh']).default('web'),
});

type ContactFormData = z.infer<typeof contactSchema>;

// Rate limiting (simple in-memory store)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5;

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

async function sendToDiscord(data: ContactFormData): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error('DISCORD_WEBHOOK_URL is not configured');
    return false;
  }

  // Build contact methods array
  const contactMethods: string[] = [];
  if (data.email) contactMethods.push(`📧 **Email:** ${data.email}`);
  if (data.discord) contactMethods.push(`💬 **Discord:** ${data.discord}`);
  if (data.phone) contactMethods.push(`📱 **Phone:** ${data.phone}`);
  if (data.facebook) contactMethods.push(`👤 **Facebook:** ${data.facebook}`);

  // Format embed
  const embed = {
    title: '📬 New Contact Form Submission',
    description: data.message,
    color: data.source === 'ssh' ? 0x00e5ff : 0xe6007e, // cyan for SSH, magenta for web
    fields: [
      ...(data.name ? [{ name: '👤 Name', value: data.name, inline: true }] : []),
      { name: '📍 Source', value: data.source.toUpperCase(), inline: true },
      ...(contactMethods.length > 0
        ? [{ name: '📞 Contact Methods', value: contactMethods.join('\n'), inline: false }]
        : []
      ),
    ],
    timestamp: new Date().toISOString(),
    footer: {
      text: 'pcstyle.dev contact form',
    },
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] }),
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to send to Discord:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    // Send to Discord
    const success = await sendToDiscord(validatedData);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to send message. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully! Thanks for reaching out.'
      },
      { status: 200 }
    );

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint for health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/contact',
    methods: ['POST']
  });
}
