import { Composio } from 'composio-core';

async function testSend() {
  const composio = new Composio({ apiKey: "uak_DyiY1hPAre9LbDTe8Nv0Xhz_Is6OELRJGJ777DaCMJw" });
  const entity = composio.getEntity("default");

  const emailBody = `Hi Prestige Team,

Saw your exceptional 4.9★ rating and 85+ verified reviews in DHA Phase 5—your PPF and Graphene work is top-tier in Lahore, but noticed your studio currently doesn't have a dedicated mobile booking page to capture high-ticket clients.

Instead of just pitching, our team went ahead and built a custom, fully functional mobile prototype specifically for Prestige Car Detailing ($0 cost, no catch).

You can test the live interactive preview right on your phone here:
👉 https://mox.infni-t.online/preview/prestige-car-detailing-01

If you like the design, we can connect your custom domain in under 15 minutes; if not, feel free to keep the ideas with zero obligation.

Best regards,
AbdulRahman-T
MoX Hunter Studio`;

  console.log("Sending live test email to sirajiaengineering@gmail.com via Composio Gmail...");

  const response = await entity.execute({
    actionName: "GMAIL_SEND_EMAIL",
    params: {
      recipient_email: "sirajiaengineering@gmail.com",
      subject: "Quick live prototype for Prestige Car Detailing (DHA Phase 5)",
      body: emailBody
    }
  });

  console.log("GMAIL_DISPATCH_RESPONSE:", JSON.stringify(response, null, 2));
}

testSend().catch(err => {
  console.error("Error sending email:", err);
});
