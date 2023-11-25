const axios = require('axios');
const { parse } = require('node-html-parser');

module.exports = class Captcha {

  static async resolve() {
    const apiKey = '6Lf5DqUUAAAAAIHKVINTlK4DGAisCEIXM75KeUqT';
    const params = new URLSearchParams();
    params.set('ar', '1');
    params.set('k', apiKey);
    params.set('co', 'aHR0cHM6Ly93d3cuYnVyZ2Vya2luZy5mcjo0NDM.');
    params.set('hl', 'en');
    params.set('v', '-QbJqHfGOUB8nuVRLvzFLVed');
    params.set('size', 'invisible');
    params.set('cb', 'np3eftnhlzvl');
    const urls = {
      anchor: `https://www.google.com/recaptcha/api2/anchor?${params.toString()}`,
      reload: `https://www.google.com/recaptcha/api2/reload?k=${apiKey}`
    };

    const { data: anchorData } = await axios.get(urls.anchor);
    const token = parse(anchorData).querySelector('input#recaptcha-token').getAttribute('value');
    const { data: postData } = await axios.post(urls.reload, {
      v: params.get('v'),
      reason: 'q',
      c: token,
      k: apiKey,
      co: params.get('co'),
      hl: params.get('hl'),
      size: params.get('size'),
      chr: encodeURI('[30,85,0]'),
      vh: '-419930829',
      bg: '!4Oag5uMKAAQeEAnmbQEHnAgEoUMfuFJKlcwL6HmbC6a1sjQUfZsj5PV0lu22LNAK2XlpN9GVXT-RbJVjyjON0aqCO_-ebeIGPwKwh6c4NtXQ9hfSA6WdPuyXnKxXmeYO0skcT8j7LiRDhhZ_BCmQmIENC1KrdTwljoROHGrebqR95s1bmhQlQw9yt1D5rDAdnDVA7wL1mMZ2uUjRRzw_qMG8_d-aF8jcnBsje5mp0RXA4_Op4FDb1wJDtyuYcz7Z5wXKz1OQYt_SD2-hVTavVDle7MtGXiFry6I1ZlArZpjtddJic1AaVSULLaN-VtKWD65dibDNEAQgX9LoXnwOPYc_FWPLT5kVAvoVz09aM7E-iM4bExpFuC68ulz-ooSaVtfjVBNvKrP9IUW02CYYIIvZx4koKVuBE8rG3V-CyJbtO3ukDGsbRgK60VVnQXJfOtgGGtw3HFOLFvHtAA8XplK5Ly9fE1grFERTd_DV4VhCrOVCs1HWs7wXkcM7DiX9E88DIGNYiS9XVY5RvFDzacz4PaqJpbELOEXqZ3XSLXxSUTVmuToYfiMLd6389egnhh18dZCZqES61keiN1dP0LthERvYPHlHhygZ3VCR9naNSXrRrzWaSNnIdoVtQVhFeczznFQKwkdK2qJWMSJ2gUURKavFAplGj5CNxiZXRBRbEOYBTXtTm0tkdu66mrXFtVrsWTUVHypJhlMdXBP5HfAOxJDwaksAiWos4VgJ0l8HuflJA7O8lutYLVZBmGjVQTsoc1cNi-zP82kM8-TJU0tK9SLFiUhJJVBDhxPLmGRhchHFdzFEZukIaZ2f9PJoptR7dprn6kmSqcNQ9XMCbz30w7sXAf2ZGE6twbtIjBThuNKlI7Qikl6zyefbPNX1LX5vU2j8YOLH26lM0NMJwOvXMRUcZ9mZBe6-Ukn-rEhNFLpNzQXDfDI2GSdXUUnF0V9h7BIXLxslNL-H4TbCj6zpRVXAroVQnh4WpG33E9kd8imJJlTdlc5WbqvEBCqGSLywYluyEojmBeFnUoCncatKZnpZqpbx6i8cnSiUrIjc-PhhN3u7aII8f_FecZoA-xjFsufZiMzkEewcfKY2PxLFCW17lm3Eb2eoKxy-LzhMx230JU5fdslgXSWGTRkOP_c7TtAaiQNZLq7q6spDXYmpVTP6GDD0pZ0NkTfWo-jRMr2u5YF-Rfd4GleSK7l_OYLnvX8CJGhBUP6CgkFWVNViUFgJrV9s8LrZRXuo9B29C-peH0gQC_FqiIW2hZW1GrcRfW-91KbgJhsU0tJYcG-Ctvh6n04Jq1c3ZaXk0TxBrj9sInuzftEjqVEf-TEsozF89cNoNRC5TS5UZsDIM4MVoJG3PGeoWXTLrZh_nql8l1ip9_rs5P-0zjfO9aVchukjzARs4_Ln_KRMdR2PIGnojK4FLGlh7H2SWliBoUdy3T9r5oL23vOHurd_f-J5mlRFNK8esDIXZ36UDEQzJml0segit7Jxfbk-ghnBwYCvjfPeO47qz9FjGRIF85LSfMeQDXYATyjQwAkkLloSW3eD_BNEfDqRkyNxi0M7JRRnnRdxX0kw1Q1XRpnlgM9hgf7P1022UWn9YgQq5dOQu3Q_y32PEuX374DTMiD1iZ8xvgevDU-wrToRYEVqtCrUwLcr1SqiZW_YbSNKpaZzsC7yqXlTEYN6cmBy_PmKDHkmlqMHtS-64vdKBuGMcvNzTfcWnMgv5PbMojSJ2NFP9ZTX83so3R2MdATfjEJQAhosijN191qUpeF6xFPoxBblSJZEmV51Ns1qfgUhp55RZiWkwbaoDIBeCc0qPhfENtYJLHGFHO-gPQgRUsWoONUKF3Z9sJettl7IsRUZyZx9xf014En00UPoBvoAcmWI417CpGqWq12YWtCb-DXatO_ChgJkeDxUPBXjeZWWj_fM9YyodVn-TKtswqUSaNigfRgl3haoY2-Yu4tVU_llvZgqOdZuM89O8aH7pUCqd3Jnk6kdJqcCQ534Oap2MgdsTanU_y6TvRU9EZnCze2Eon6idzBRbWu0ba8IuM9g2BedOSxTV_0_ysDj_u3bNiXVJuS7yPP0BWTyKoyAkdkK80XZSpmE0pLJUtpKrQkYzDWAOKo4A8Wuh1xKsZMjFa7VVnPP430kn-wS3sRuPRq9koTclY0GoRsHwMiDRUHFqSwxTWIvO9c7i6JCh3X-e7TagPuJG9J8R_2dCKJ2Z1MyTC5fg2FBgSwss5oTAH0hrftRzLzKIuebTcDBAY7cS6p1xhXa_1jKNzQn9-6P3e6QsaVhdLGjOLMRIHXRsZhYOfLenZUHF4tVCMTv-sOMERA6m4W4J-pdt2Q3qJvT1CvpXeXViUn6QWC5zWgpjj54-V1CbW450PHq733Q9qzMsGzKCenz2iy97idlFL_HjCQwgSCqsrGZjvH-oV_UslBxlfOACdYStpvvhjWhx8mItow2H1OQgl_lsGdeXC7fR6RBRTk6-F2Q4jSgBFbe2hOYQEsZZ8NXKZ4GDpHzbcLY7sqZ0sLrQlPqwzfhBvWDCcs7hwcTncdcPGLawANmKOad0K6yMRBJ4N5pBK-YVUrGXtVACik5Y2a9hDkKl96t3KtFAFTs0ZawOX0REcpDkFFRTKpN4fpdgpO1dN9AD45M0op25LphRyTvRdFomnD0XGYhbbPB3ClRvT7dLYQBh3yPfP7vgFujDQBeQgWzqM-SZhH1b-SVEYERcFQPmIg-KQSeo6rSr-4EB1l-'
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return JSON.parse(postData.slice(5))[1];
  }

};