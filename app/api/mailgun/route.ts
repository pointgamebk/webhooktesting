import { NextRequest, NextResponse } from "next/server";
import Mailgun from "mailgun.js";
import FormData from "form-data";

const API_KEY = process.env.MAILGUN_API_KEY!;
const DOMAIN = process.env.MAILGUN_DOMAIN!;

const mailgun = new Mailgun(FormData).client({
  username: "api",
  key: API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const intro = body.intro || "You've received a new order";
    const content =
      body.content || "See more details in your Instructor Dashboard";
    const outro = body.outro || "Thanks - Team Campify";

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .email-container {
              font-family: Arial, sans-serif;
              color: #ECE2D0;
            }
            .email-header {
              background-color: #2A4849;
              padding: 20px;
              text-align: center;
              color: #ECE2D0;
            }
            .email-body {
              padding: 20px;
              color: #333;
            }
            .email-footer {
              background-color: #2A4849;
              padding: 10px;
              text-align: center;
              font-size: 16px;
              color: #ECE2D0;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <h1>Campify</h1>
            </div>
            <div class="email-body">
              <p>Hi ${body.name},</p>
              <p>${intro}</p>
              <p>${content}</p>
              <p>${outro}</p>
              <a class="link" href="https://campify.app">Campify</a>
            </div>
            <div class="email-footer">
              <p>Thanks for using Campify!</p>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      // Mailgun send
      await mailgun.messages.create(DOMAIN, {
        to: body.to,
        from: "Campify <no-reply@campify.app>",
        subject: body.subject || "Order Notification",
        text: `${intro}\n\n${content}\n\n${outro}`,
        html: htmlContent,
      });

      return NextResponse.json({ success: true }, { status: 200 });
    } catch (e) {
      console.error("Mailgun error:", e as Error); // Log error details
      return NextResponse.json({ success: false, error: e }, { status: 500 });
    }
  } catch (e) {
    console.error("Request handling error:", e as Error); // Log error details
    return NextResponse.json({ success: false, error: e }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ success: false }, { status: 404 });
}
