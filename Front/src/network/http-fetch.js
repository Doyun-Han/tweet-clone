export default class HttpClient {
  constructor(baseURL, getCsrfToekn) {
    this.baseURL = baseURL;
    this.getCsrfToekn = getCsrfToekn;
  }

  async fetch(url, options) {
    const res = await fetch(`${this.baseURL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        'dwitter-csrf-token': this.getCsrfToekn(),
      },
      credentials: 'include',
    });
    let data;

    try {
      data = await res.json();
    } catch (error) {
      console.error(error);
    }
    if (res.status > 299 || res.status < 200) {
      const message =
        data && data.message ? data.message : 'Something Went Wrong';
      throw new Error(message);
    }

    return data;
  }
}
