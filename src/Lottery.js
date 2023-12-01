const Captcha = require('./Captcha');
const crypto = require('crypto');
const Utils = require('./Utils');
const RequestError = require('./RequestError');

module.exports = class Lottery {

  constructor(client) {
    this.client = client;
    this.deviceId = crypto.randomBytes(8).toString('hex');
  }

  async operation() {
    return this._operation ? this._operation : this._operation = (await this.client.get('public/lottery/available', {
      headers: {
        ...Utils.androidHeaders,
        Authorization: this.client.bearer,
        'X-Device': this.deviceId
      }
    })).data.operation;
  }

  async play(options) {
    const operation = await this.operation();

    if (!operation.available && !options?.ignoreIfUnavailable) throw new Error('Lottery is not available');

    try {
      const data = {
        operationId: operation.id,
        deviceCheckPayload: {
          // Device ID
          king: this.deviceId,
          hash: crypto.randomBytes(16).toString('hex'),
          queen: await Captcha.resolve(),
          princess: '',
          prince: crypto.randomUUID()
        }
      };
      console.log(data);
      await this.client.post('kingdom/lottery', data, {
        headers: {
          ...Utils.androidHeaders,
          Authorization: this.client.bearer,
          'X-Device': this.deviceId
        }
      });
    } catch (e) {
      throw new RequestError('Failed to play lottery', e.response.data);
    }
  }

};