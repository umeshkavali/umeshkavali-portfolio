export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { firstName, lastName, email, password } = req.body;

  try {
    // Get Salesforce token using credentials from environment variables
    const tokenResponse = await fetch(
      "https://login.salesforce.com/services/oauth2/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "password",
          client_id: process.env.SF_CLIENT_ID,
          client_secret: process.env.SF_CLIENT_SECRET,
          username: process.env.SF_USERNAME,
          password: process.env.SF_PASSWORD,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return res.status(401).json({ error: "Salesforce authentication failed" });
    }

    // Create Shop User in Salesforce
    const sfResponse = await fetch(
      `${process.env.SF_INSTANCE_URL}/services/apexrest/signup`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      }
    );

    const result = await sfResponse.text();

    if (result === "Success") {
      return res.status(200).json({ message: "Account created successfully!" });
    } else {
      return res.status(400).json({ error: result });
    }
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
}