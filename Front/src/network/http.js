import axios from 'axios';
import axiosRetry from 'axios-retry';

const defaultRetryConfig = {
  retries: 5,
  initialDelayMs: 100,
};

export default class HttpClient {
  constructor(baseURL, getCsrfToekn, config = defaultRetryConfig) {
    this.baseURL = baseURL;
    this.getCsrfToekn = getCsrfToekn;
    this.client = axios.create({
      baseURL: baseURL,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });
    axiosRetry(this.client, {
      retries: config.retries,
      retryDelay: (retry) => {
        const delay = Math.pow(2, retry) * config.initialDelayMs;
        const jitter = delay * 0.1 * Math.random();
        return jitter + delay;
      },
      retryCondition: (err) =>
        axiosRetry.isNetworkOrIdempotentRequestError(err) ||
        err.response.status === 429,
    });
  }

  async fetch(url, options) {
    const { body, method, headers } = options;
    const req = {
      url,
      method,
      headers: {
        ...headers,
        'dwitter-csrf-token': this.getCsrfToekn(),
      },
      data: body,
    };

    try {
      const res = await this.client(req);
      return res.data;
    } catch (err) {
      if (err.response) {
        const data = err.response.data;
        const message =
          data && data.message ? data.message : 'Something Went Wrong';
        throw new Error(message);
      }
      throw new Error('Connection Error');
    }
  }
}
