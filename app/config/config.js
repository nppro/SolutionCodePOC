// define default config, but allow overrides from ENV vars
let config = {
  APP_DB_HOST: "localhost",
  APP_DB_USER: "nodeapp",
  APP_DB_PASSWORD: "student12",
  APP_DB_NAME: "students",
};

var AWS = require("@aws-sdk/client-secrets-manager");

try {
  var client = new AWS.SecretsManagerClient({
    region: "us-east-1",
  });

  const secretName = "prod/WebApp/Mysql";

  client
    .send(
      new AWS.GetSecretValueCommand({
        SecretId: secretName,
        VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
      })
    )
    .then((data) => {
      const secret = data.SecretString;
      const parsedSecret = JSON.parse(secret);

      config.APP_DB_HOST = parsedSecret.host;
      config.APP_DB_PASSWORD = parsedSecret.password;
      config.APP_DB_USER = parsedSecret.username;

      console.log("Secrets retrieved from AWS Secrets Manager");
    })
    .catch((err) => {
      console.log("Error retrieving secrets from AWS Secrets Manager", err);
      throw err;
    });
} catch (e) {
  // config.APP_DB_HOST = "localhost";
  // config.APP_DB_NAME = "STUDENTS";
  // config.APP_DB_PASSWORD = "student12";
  // config.APP_DB_USER = "nodeapp";
  console.error("Secrets not found. Proceeding with default values..");
  console.error(e);
  process.exit(1);
}

// Object.keys(config).forEach((key) => {
//   if (process.env[key] === undefined) {
//     console.log(
//       `[NOTICE] Value for key '${key}' not found in ENV, using default value.  See app/config/config.js`
//     );
//   } else {
//     config[key] = process.env[key];
//   }
// });

module.exports = config;
