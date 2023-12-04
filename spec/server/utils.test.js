// eslint-disable-next-line import/no-extraneous-dependencies
import { Headers } from 'node-fetch'; // Assuming you're using node-fetch for Headers in Node.js
import { IncomingMessage } from 'http'; // Node.js http module
import { parse } from 'cookie';
import qs from 'qs';
import {
  getHeaderValue,
  getUserIp,
  getUserParameters,
  getQueryParamsFromUrl,
} from '../../src/server/utils';

describe('getHeaderValue', () => {
  describe('with Fetch API Headers', () => {
    it('returns the correct value for an existing header key', () => {
      const headers = new Headers({ 'content-type': 'application/json' });
      expect(getHeaderValue(headers, 'content-type')).toBe('application/json');
    });

    it('returns undefined for a non-existing header key', () => {
      const headers = new Headers({ 'content-type': 'application/json' });
      expect(getHeaderValue(headers, 'authorization')).toBeUndefined();
    });

    it('handles empty Headers object', () => {
      const headers = new Headers();
      expect(getHeaderValue(headers, 'content-type')).toBeUndefined();
    });
  });

  describe('with Node.js IncomingHttpHeaders', () => {
    it('returns the correct value for an existing header key', () => {
      const headers = { 'content-type': 'application/json' };
      expect(getHeaderValue(headers, 'content-type')).toBe('application/json');
    });

    it('is case-insensitive', () => {
      const headers = { 'Content-Type': 'application/json' };
      expect(getHeaderValue(headers, 'content-type')).toBe('application/json');
    });

    it('returns undefined for a non-existing header key', () => {
      const headers = { 'content-type': 'application/json' };
      expect(getHeaderValue(headers, 'authorization')).toBeUndefined();
    });

    it('handles empty IncomingHttpHeaders object', () => {
      const headers = {};
      expect(getHeaderValue(headers, 'content-type')).toBeUndefined();
    });
  });

  describe('with invalid or unsupported types', () => {
    it('returns undefined for null', () => {
      expect(getHeaderValue(null, 'content-type')).toBeUndefined();
    });

    it('returns undefined for undefined', () => {
      expect(getHeaderValue(undefined, 'content-type')).toBeUndefined();
    });

    // Add tests for other unsupported types as necessary
  });
});

describe('getUserIp', () => {
  describe('with Fetch API Request', () => {
    it('gets the first IP from x-forwarded-for with a single IP', () => {
      const request = new Request('http://example.com', {
        headers: { 'x-forwarded-for': '192.0.2.1' },
      });
      expect(getUserIp(request)).toBe('192.0.2.1');
    });

    it('gets the first IP from x-forwarded-for with multiple IPs', () => {
      const request = new Request('http://example.com', {
        headers: { 'x-forwarded-for': '192.0.2.1, 198.51.100.1' },
      });
      expect(getUserIp(request)).toBe('192.0.2.1');
    });

    it('returns undefined if x-forwarded-for is missing', () => {
      const request = new Request('http://example.com');
      expect(getUserIp(request)).toBeUndefined();
    });
  });

  describe('with Node.js IncomingMessage', () => {
    const mockSocket = { remoteAddress: '192.0.2.1' };

    it('gets IP from x-forwarded-for', () => {
      const incomingMessage = new IncomingMessage(mockSocket);
      incomingMessage.headers = { 'x-forwarded-for': '192.0.2.1' };
      expect(getUserIp(incomingMessage)).toBe('192.0.2.1');
    });

    it('gets IP from remoteAddress if x-forwarded-for is missing', () => {
      const incomingMessage = new IncomingMessage(mockSocket);
      expect(getUserIp(incomingMessage)).toBe('192.0.2.1');
    });

    it('returns undefined if remoteAddress is missing', () => {
      const incomingMessage = new IncomingMessage({});
      expect(getUserIp(incomingMessage)).toBeUndefined();
    });

    // Add more tests for different header formats and edge cases
  });

  // ... Additional tests for edge cases and error handling
}); // Assuming you're using 'cookie' library for parsing

jest.mock('cookie');

describe('getUserParameters', () => {
  describe('with Fetch API Request', () => {
    it('extracts parameters from Request with cookie header', () => {
      const request = new Request('http://example.com', {
        headers: {
          cookie: 'ConstructorioID_client_id=123; ConstructorioID_session_id=456',
          'user-agent': 'test-agent',
        },
      });
      parse.mockReturnValueOnce({
        ConstructorioID_client_id: '123',
        ConstructorioID_session_id: '456',
      });

      const userParams = getUserParameters(request);
      expect(userParams).toEqual({
        clientId: '123',
        sessionId: 456,
        userAgent: 'test-agent',
        // userIp: (Depends on the IP extraction logic)
      });
    });

    // ... more tests for Fetch API Request
  });

  describe('with Node.js IncomingMessage', () => {
    // ... tests for IncomingMessage with various header configurations
  });

  describe('with NextRequest', () => {
    it('extracts parameters from NextRequest with cookies property', () => {
      const nextRequest = {
        cookies: { ConstructorioID_client_id: '123', ConstructorioID_session_id: '456' },
        headers: { 'user-agent': 'test-agent' },
        // ... other properties as needed
      };

      const userParams = getUserParameters(nextRequest);
      expect(userParams).toEqual({
        clientId: '123',
        sessionId: 456,
        userAgent: 'test-agent',
        // userIp: (Depends on the IP extraction logic)
      });
    });

    // ... more tests for NextRequest
  });

  // ... Additional tests for edge cases and error handling
});

jest.mock('qs');

describe('getQueryParamsFromUrl', () => {
  it('parses single query parameter correctly', () => {
    const url = 'http://example.com?param=value';
    qs.parse.mockReturnValueOnce({ param: 'value' });

    const queryParams = getQueryParamsFromUrl(url);
    expect(queryParams).toEqual({ param: 'value' });
  });

  it('parses multiple query parameters correctly', () => {
    const url = 'http://example.com?param1=value1&param2=value2';
    qs.parse.mockReturnValueOnce({ param1: 'value1', param2: 'value2' });

    const queryParams = getQueryParamsFromUrl(url);
    expect(queryParams).toEqual({ param1: 'value1', param2: 'value2' });
  });

  it('handles nested query parameters', () => {
    const url = 'http://example.com?nested[param]=value';
    qs.parse.mockReturnValueOnce({ nested: { param: 'value' } });

    const queryParams = getQueryParamsFromUrl(url);
    expect(queryParams).toEqual({ nested: { param: 'value' } });
  });

  it('handles encoded characters in query parameters', () => {
    const url = 'http://example.com?param=some%20value';
    qs.parse.mockReturnValueOnce({ param: 'some value' });

    const queryParams = getQueryParamsFromUrl(url);
    expect(queryParams).toEqual({ param: 'some value' });
  });

  it('returns an empty object for a URL without query parameters', () => {
    const url = 'http://example.com';

    const queryParams = getQueryParamsFromUrl(url);
    expect(queryParams).toEqual({});
  });

  it('returns an empty object for a URL with an empty query string', () => {
    const url = 'http://example.com?';

    const queryParams = getQueryParamsFromUrl(url);
    expect(queryParams).toEqual({});
  });

  // Additional test cases for other edge cases or special scenarios
});
