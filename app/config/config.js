const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");

const DEFAULT_CONFIG = {
  APP_DB_HOST: "localhost",
  APP_DB_USER: "root",
  APP_DB_PASSWORD: "root",
  APP_DB_NAME: "students",
};

async function loadConfig() {
  const config = { ...DEFAULT_CONFIG };

  try {
    const client = new SecretsManagerClient({ region: "us-east-1" });
    const secretName = "prod/WebApp/Mysql";

    const data = await client.send(
      new GetSecretValueCommand({
        SecretId: secretName,
        VersionStage: "AWSCURRENT",
      })
    );

    const secret = JSON.parse(data.SecretString);

    config.APP_DB_HOST = secret.host;
    config.APP_DB_USER = secret.username;
    config.APP_DB_PASSWORD = secret.password;

    console.log("✅ Secrets loaded from AWS Secrets Manager");
  } catch (err) {
    console.log("⚠️ Using default DB config (Secrets Manager unavailable)");
    console.log(err.message);
  }

  return config;
}

module.exports = { loadConfig };
