import { EmailConfig } from 'next-auth/providers';

export const sendGridVerificationEmail = async ({
  email,
  url,
  provider,
}: {
  email: string;
  url: string;
  provider: EmailConfig;
}) => {
  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.AUTH_SENDGRID_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email }] }],
        from: { email: provider.from },
        subject: 'Sign in to Your BandMate Account',
        content: [
          { type: 'text/plain', value: text(url) },
          { type: 'text/html', value: html(url) },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`SendGrid error: ${errorText}`);
    }
  } catch (error) {
    console.error('Custom SendGrid Error:', error);
    throw error;
  }
};

const html = (url: string) => {
  return `
    <body>
      <table width="100%" border="0" cellspacing="20" cellpadding="0"
        style="max-width: 600px; margin: auto; border-radius: 10px;">
        <tr>
          <td align="center"
            style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif;">
            Sign in to <strong>BandMate</strong>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 20px 0;">
            <table border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td align="center" style="border-radius: 5px;"><a href="${url}"
                    target="_blank"
                    style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid black; display: inline-block; font-weight: bold;">Sign
                    in</a></td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center"
            style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: black;">
            If you did not request this email you can safely ignore it.
          </td>
        </tr>
      </table>
    </body>
  `;
};

const text = (url: string) => `Sign in using this link: ${url.toString()}`;
