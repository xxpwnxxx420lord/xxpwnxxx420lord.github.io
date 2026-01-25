export async function GET() {
  const termsText = `
ADVERTISER TERMS AND CONDITIONS

These Advertiser Terms and Conditions ("Advertiser Terms") govern your participation in our advertising program. By applying to advertise our product, you acknowledge that you have read, understood, and agree to be bound by these terms.

Eligibility:
1. Advertisers must have a minimum of 1,000 followers or subscribers.
2. Approval is required prior to posting any advertisement.
3. We reserve the right to approve or deny any advertiser at our sole discretion.

Advertising Requirements:
1. Each promotional video must achieve a minimum of 3,000 views.
2. Channels must consistently average 1,000+ views per video.
3. Any form of botting, fake engagement, or artificial inflation is strictly prohibited.
4. Advertisements must accurately represent the product.
5. Content must remain public for a minimum period determined by us.

Application Process:
To apply, open a ticket in our official Discord server and provide your channel links, analytics, and promotional plan.

---

RESELLER TERMS AND CONDITIONS

This Reseller Agreement ("Agreement") sets forth the terms and conditions under which you ("Reseller") are permitted to resell our products.

Eligibility:
1. Resellers must be approved prior to selling any products.
2. We reserve the right to approve or deny any application.
3. Approval may be revoked at any time without prior notice.

Reselling Rules:
1. Products may only be sold at prices approved by us.
2. Resellers may not misrepresent the product or its origin.
3. All sales must be conducted legitimately. Fraud or deceptive practices result in termination.
4. Resellers may not share, leak, or distribute keys outside approved sales.

Compliance and Conduct:
1. Resellers must comply with all laws and platform rules.
2. Exploiting or reverse engineering the product is forbidden.
3. We may audit reseller activity at any time.

Termination:
We reserve the right to suspend or terminate reseller access immediately for any violation, with or without notice.

How to Apply:
Open a ticket in our Discord server. Provide business background, prior experience proof, and a clear plan for reselling.
`;

  return new Response(termsText, {
    headers: { 'Content-Type': 'text/plain' }
  });
}
