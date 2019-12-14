var config = {
  auth: {
    token: {
      secret: 'AS5CSA643LASPT85ZJSA19ZIUQW',
      expiresIn: 20000000000
    },
    cookieName: '_accessToken',
    google: {
      "clientId": "361596729964-s5lev02od9gdot59mdbt245luunes114.apps.googleusercontent.com",
      "clientSecret": "dBe0h9TdlLhL44LlavrdCiW9",
      "callback": "/api/oauth/google/callback"
    }
  }
};

module.exports = config;
