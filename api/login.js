export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  try {
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

    // Query Shop_User__c for matching email and password
    const query = `SELECT Id, First_Name__c, Last_Name__c, Email__c FROM Shop_User__c WHERE Email__c='${email}' AND Password__c='${password}' LIMIT 1`;

    const sfResponse = await fetch(
      `${process.env.SF_INSTANCE_URL}/services/data/v59.0/query?q=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await sfResponse.json();

    if (data.records && data.records.length > 0) {
      const user = data.records[0];
      return res.status(200).json({
        message: "Login successful",
        user: {
          firstName: user.First_Name__c,
          lastName: user.Last_Name__c,
          email: user.Email__c
        }
      });
    } else {
      return res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}