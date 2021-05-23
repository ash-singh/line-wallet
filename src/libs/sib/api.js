const SibApiV3Sdk = require('sib-api-v3-sdk');
const { sib_api_key } = require('../../config');
let defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = sib_api_key;

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

module.exports= {
    apiInstance: apiInstance,
    sendSmtpEmail: sendSmtpEmail
}