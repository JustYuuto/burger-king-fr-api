module.exports = class Profile {

  _email = null;
  _civility = null;
  _lastName = null;
  _firstName = null;
  _phone = null;
  _birthdate = null;
  _maxKids = 0;

  constructor(client) {
    this.client = client;
  }

  async fetch() {
    const { data: profile } = await this.client.get('kingdom/profile');

    this._email = profile.email;
    this._civility = profile.civility;
    this._lastName = profile.lastname;
    this._firstName = profile.firstname;
    this._phone = profile.phone;
    const [day, month, year] = profile.birthdate.split('/').map(n => parseInt(n));
    this._birthdate = new Date(year, month - 1, day);
    this._maxKids = profile.maxKids;
  }

  get email() {
    return this._email;
  }

  get civility() {
    return this._civility;
  }

  get lastName() {
    return this._lastName;
  }

  get firstName() {
    return this._firstName;
  }

  get phone() {
    return this._phone;
  }

  get birthdate() {
    return this._birthdate;
  }

  get maxKids() {
    return this._maxKids;
  }

};