module.exports = {
  baseApiUrl: 'https://webapi.burgerking.fr/blossom/api/v12/',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0',
    'X-Application': 'WEBSITE',
    'X-Platform': 'WEB',
    Origin: 'https://www.burgerking.fr',
    Referer: 'https://www.burgerking.fr/'
  },
  androidHeaders: {
    'User-Agent': 'okhttp/4.10.0',
    'X-Application': 'WEBSITE',
    'X-Device-Model': 'Pixel 5',
    'X-Os-Version': '13',
    'X-Platform': 'APP_AND',
    'X-Version': '7.7.0'
  }
};
