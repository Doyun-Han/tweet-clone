export default class AuthService {
  constructor(http) {
    this.http = http;
  }
  async signup(username, password, name, email, url) {
    return await this.http.fetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
        name,
        email,
        url,
      }),
    });
  }
  async login(username, password) {
    return await this.http.fetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
      }),
    });
  }

  async me() {
    return this.http.fetch('/auth/me', {
      method: 'GET',
    });
  }

  async logout() {
    return this.http.fetch('/auth/logout', {
      method: 'POST',
    });
  }

  async csrfToken() {
    const res = await this.http.fetch('/auth/csrf-token', {
      method: 'GET',
    });
    console.log(res);
    return res.csrfToken;
  }
}
