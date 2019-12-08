var config = {
  auth: {
    token: {
      secret: '4FAFEAAA969C0C4AF39C3192871CE99CC3CAADD24E859697D4CB5C8EE9DDCEBE',
      expiresInMinutes: 20
    },
    cookieName: '_accessToken',
    google: {
      "clientId": "361596729964-s5lev02od9gdot59mdbt245luunes114.apps.googleusercontent.com",
      "clientSecret": "dBe0h9TdlLhL44LlavrdCiW9",
      "callback": "/api/oauth/googleUserProfile"
    }
  }
};

module.exports = config;
