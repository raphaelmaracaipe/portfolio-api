export default () => ({
  keyDefault: process.env.KEY_DEFAULT,
  ivDefault: process.env.IV_DEFAULT,
  urlConnectionDB: process.env.URL_CONNECTION_DB,
  isDev: process.env.IS_DEV == 'true',
  timeToValidationCode: parseInt(process.env.TIME_TO_VALIDATION_CODE),
});
