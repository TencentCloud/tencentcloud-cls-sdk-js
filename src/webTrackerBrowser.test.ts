import { Log, WebTrackerBrowser } from '../src';
import mockAxios from 'jest-mock-axios';

describe('WebTrackerBrowser', () => {
  let clsTracker: WebTrackerBrowser;

  beforeEach(() => {
    jest.useFakeTimers();
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    // cleaning up the mess left behind the previous test
    mockAxios.reset();
    jest.useRealTimers();
  });

  describe('Constructor', () => {
    it('should initialize with default values', () => {
      const options = {
        host: 'https://ap-guangzhou.cls.tencentcs.com',
        topicId: 'test-topic-id',
      };

      clsTracker = new WebTrackerBrowser(options);

      expect(clsTracker).toBeDefined();
      // @ts-ignore - 访问私有属性进行测试
      expect(clsTracker.time).toBe(10); // 默认值
      // @ts-ignore
      expect(clsTracker.count).toBe(10); // 默认值
      // @ts-ignore
      expect(clsTracker.topicId).toBe('test-topic-id');
      // @ts-ignore
      expect(clsTracker.url).toBe('https://ap-guangzhou.cls.tencentcs.com/tracklog');
      // @ts-ignore
      expect(clsTracker.opt).toEqual(options);
      // @ts-ignore
      expect(clsTracker.arr).toEqual([]);
      // @ts-ignore
      expect(clsTracker.timer).toBeUndefined();
    });

    it('should initialize with custom time and count', () => {
      const options = {
        host: 'https://ap-guangzhou.cls.tencentcs.com',
        topicId: 'test-topic-id',
        time: 5,
        count: 20,
      };

      clsTracker = new WebTrackerBrowser(options);

      expect(clsTracker).toBeDefined();
      // @ts-ignore
      expect(clsTracker.time).toBe(5);
      // @ts-ignore
      expect(clsTracker.count).toBe(20);
      // @ts-ignore
      expect(clsTracker.topicId).toBe('test-topic-id');
      // @ts-ignore
      expect(clsTracker.opt).toEqual(options);
    });

    it('should handle host without protocol', () => {
      const options = {
        host: 'ap-guangzhou.cls.tencentcs.com',
        topicId: 'test-topic-id',
      };

      clsTracker = new WebTrackerBrowser(options);

      expect(clsTracker).toBeDefined();
      // @ts-ignore - 应该自动添加https://前缀
      expect(clsTracker.url).toBe('https://ap-guangzhou.cls.tencentcs.com/tracklog');
      // @ts-ignore
      expect(clsTracker.topicId).toBe('test-topic-id');
      // @ts-ignore
      expect(clsTracker.opt).toEqual(options);
    });

    it('should handle host with http protocol', () => {
      const options = {
        host: 'http://ap-guangzhou.cls.tencentcs.com',
        topicId: 'test-topic-id',
      };

      clsTracker = new WebTrackerBrowser(options);

      expect(clsTracker).toBeDefined();
      // @ts-ignore - 应该保持http://前缀
      expect(clsTracker.url).toBe('http://ap-guangzhou.cls.tencentcs.com/tracklog');
      // @ts-ignore
      expect(clsTracker.topicId).toBe('test-topic-id');
      // @ts-ignore
      expect(clsTracker.opt).toEqual(options);
    });

    it('should initialize with source option', () => {
      const options = {
        host: 'https://ap-guangzhou.cls.tencentcs.com',
        topicId: 'test-topic-id',
        source: '192.168.1.1',
      };

      clsTracker = new WebTrackerBrowser(options);

      expect(clsTracker).toBeDefined();
      // @ts-ignore
      expect(clsTracker.topicId).toBe('test-topic-id');
      // @ts-ignore
      expect(clsTracker.opt).toEqual(options);
      // @ts-ignore
      expect(clsTracker.opt.source).toBe('192.168.1.1');
    });
  });

  describe('Basic send operations', () => {
    beforeEach(() => {
      clsTracker = new WebTrackerBrowser({
        host: 'https://ap-guangzhou.cls.tencentcs.com',
        topicId: 'test-topic-id',
      });
    });

    it('test send', async () => {
      const log = new Log(Date.now());
      log.addContent('hello', 'hello world中文');

      const spy = jest.spyOn(clsTracker as any, 'request');

      clsTracker.send(log);

      expect(mockAxios.post).not.toHaveBeenCalled();
      jest.advanceTimersByTime(10000);
      expect(mockAxios.post).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(JSON.stringify({ logs: [log.toLogData()] }), false);

      spy.mockRestore();
    });

    it('test sendImmediate', async () => {
      const log = new Log(Date.now());
      log.addContent('hello', 'hello world中文');

      const spy = jest.spyOn(clsTracker as any, 'request');

      clsTracker.sendImmediate(log);

      expect(mockAxios.post).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(JSON.stringify({ logs: [log.toLogData()] }), false);

      spy.mockRestore();
    });

    it('test sendBatchLogs', async () => {
      const log = new Log(Date.now());
      log.addContent('hello', 'hello world');
      const log2 = new Log(Date.now());
      log2.addContent('nihao', '你好');

      const spy = jest.spyOn(clsTracker as any, 'request');

      clsTracker.sendBatchLogs([log, log2]);

      expect(mockAxios.post).not.toHaveBeenCalled();
      jest.advanceTimersByTime(10000);
      expect(mockAxios.post).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(JSON.stringify({ logs: [log.toLogData(), log2.toLogData()] }), false);

      spy.mockRestore();
    });

    it('test sendBatchLogsImmediate', async () => {
      const log = new Log(Date.now());
      log.addContent('hello', 'hello world');
      const log2 = new Log(Date.now());
      log2.addContent('nihao', '你好');

      const spy = jest.spyOn(clsTracker as any, 'request');

      clsTracker.sendBatchLogsImmediate([log, log2]);

      expect(mockAxios.post).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(JSON.stringify({ logs: [log.toLogData(), log2.toLogData()] }), false);

      spy.mockRestore();
    });
  });

  describe('Batch sending with thresholds', () => {
    beforeEach(() => {
      clsTracker = new WebTrackerBrowser({
        host: 'https://ap-guangzhou.cls.tencentcs.com',
        topicId: 'test-topic-id',
        count: 3, // Set low count for testing
        time: 5,
      });
    });

    it('should send immediately when count threshold is reached', () => {
      const spy = jest.spyOn(clsTracker as any, 'request');

      // Add logs one by one
      const log1 = new Log(Date.now());
      log1.addContent('test1', 'value1');
      clsTracker.send(log1);

      const log2 = new Log(Date.now());
      log2.addContent('test2', 'value2');
      clsTracker.send(log2);

      // Should not send yet
      expect(spy).not.toHaveBeenCalled();

      const log3 = new Log(Date.now());
      log3.addContent('test3', 'value3');
      clsTracker.send(log3);

      // Should send immediately when count threshold is reached
      expect(spy).toHaveBeenCalled();

      spy.mockRestore();
    });

    it('should handle time threshold of 0 or negative', () => {
      clsTracker = new WebTrackerBrowser({
        host: 'https://ap-guangzhou.cls.tencentcs.com',
        topicId: 'test-topic-id',
        time: 0,
      });

      const spy = jest.spyOn(clsTracker as any, 'request');

      const log = new Log(Date.now());
      log.addContent('test', 'value');
      clsTracker.send(log);

      // Should send immediately when time is 0
      expect(spy).toHaveBeenCalled();

      spy.mockRestore();
    });
  });

  describe('Error handling', () => {
    let spyConsoleError: jest.SpyInstance;

    beforeEach(() => {
      clsTracker = new WebTrackerBrowser({
        host: 'https://ap-guangzhou.cls.tencentcs.com',
        topicId: 'test-topic-id',
      });
      spyConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {
        console.log('mocked');
        console.log(spyConsoleError.mock.calls.length);
      });
      jest.useRealTimers();
    });

    afterEach(() => {
      mockAxios.post.mockClear();
      spyConsoleError.mockRestore();
    });

    it('should handle successful response (200)', async () => {
      const log = new Log(Date.now());
      log.addContent('test', 'value');

      const spy = jest.spyOn(clsTracker as any, 'request');

      mockAxios.post.mockResolvedValueOnce({
        status: 200,
        data: 'success',
        headers: { 'x-cls-requestid': 'test-request-id' },
      });

      clsTracker.sendImmediate(log);

      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(spyConsoleError).not.toHaveBeenCalled();

      expect(spy).toHaveBeenCalledTimes(1);
      // @ts-ignore
      expect(clsTracker.timer).toBeFalsy();

      spy.mockRestore();
    });

    it('should handle client error (400)', async () => {
      const log = new Log(Date.now());
      log.addContent('test', 'value');

      const spy = jest.spyOn(clsTracker as any, 'request');

      mockAxios.post.mockRejectedValueOnce({
        response: {
          status: 400,
          statusText: 'Bad Request',
          data: 'Invalid request',
          headers: { 'x-cls-requestid': 'test-request-id' },
        },
      });

      clsTracker.sendImmediate(log);

      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(spyConsoleError).toHaveBeenCalled();

      expect(spy).toHaveBeenCalledTimes(1);
      // @ts-ignore
      expect(clsTracker.timer).toBeFalsy();

      spy.mockRestore();
    });

    it('should handle unauthorized error (401)', async () => {
      const log = new Log(Date.now());
      log.addContent('test', 'value');

      const spy = jest.spyOn(clsTracker as any, 'request');

      mockAxios.post.mockRejectedValueOnce({
        response: {
          status: 401,
          statusText: 'Unauthorized',
          data: 'Authentication failed',
          headers: { 'x-cls-requestid': 'test-request-id' },
        },
      });

      clsTracker.sendImmediate(log);

      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(spyConsoleError).toHaveBeenCalled();

      expect(spy).toHaveBeenCalledTimes(1);
      // @ts-ignore
      expect(clsTracker.timer).toBeFalsy();

      spy.mockRestore();
    });

    it('should handle forbidden error (403)', async () => {
      const log = new Log(Date.now());
      log.addContent('test', 'value');

      const spy = jest.spyOn(clsTracker as any, 'request');

      mockAxios.post.mockRejectedValueOnce({
        response: {
          status: 403,
          statusText: 'Forbidden',
          data: 'Access denied',
          headers: { 'x-cls-requestid': 'test-request-id' },
        },
      });

      clsTracker.sendImmediate(log);

      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(spyConsoleError).toHaveBeenCalled();

      expect(spy).toHaveBeenCalledTimes(1);
      // @ts-ignore
      expect(clsTracker.timer).toBeFalsy();

      spy.mockRestore();
    });

    it('should handle payload too large error (413)', async () => {
      const log = new Log(Date.now());
      log.addContent('test', 'value');

      const spy = jest.spyOn(clsTracker as any, 'request');

      mockAxios.post.mockRejectedValueOnce({
        response: {
          status: 413,
          statusText: 'Payload Too Large',
          data: 'Request entity too large',
          headers: { 'x-cls-requestid': 'test-request-id' },
        },
      });

      clsTracker.sendImmediate(log);

      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(spyConsoleError).toHaveBeenCalled();

      expect(spy).toHaveBeenCalledTimes(1);
      // @ts-ignore
      expect(clsTracker.timer).toBeFalsy();

      spy.mockRestore();
    });

    it('should retry on server error (500)', async () => {
      const log = new Log(Date.now());
      log.addContent('test', 'value');

      const spy = jest.spyOn(clsTracker as any, 'request');

      mockAxios.post.mockRejectedValueOnce({
        response: {
          status: 500,
          statusText: 'Internal Server Error',
          data: 'Server error',
          headers: { 'x-cls-requestid': 'test-request-id' },
        },
      });

      clsTracker.sendImmediate(log);

      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(spyConsoleError).toHaveBeenCalled();

      expect(spy).toHaveBeenCalledTimes(1);
      // @ts-ignore
      expect(clsTracker.timer).toBeTruthy();

      spy.mockRestore();
    });

    it('should handle network error', async () => {
      const log = new Log(Date.now());
      log.addContent('test', 'value');

      const spy = jest.spyOn(clsTracker as any, 'request');

      const networkError = new Error('Network Error');
      mockAxios.post.mockRejectedValueOnce(networkError);

      clsTracker.sendImmediate(log);

      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(spyConsoleError).toHaveBeenCalled();

      expect(spy).toHaveBeenCalledTimes(1);
      // @ts-ignore
      expect(clsTracker.timer).toBeTruthy();
    });
  });

  describe('Large payload handling', () => {
    beforeEach(() => {
      clsTracker = new WebTrackerBrowser({
        host: 'https://ap-guangzhou.cls.tencentcs.com',
        topicId: 'test-topic-id',
      });
    });

    it('should split large payloads into multiple requests', () => {
      const spy = jest.spyOn(clsTracker as any, 'request');

      // Create logs that would exceed MAX_BODY_SIZE when combined
      const logs: Log[] = [];
      for (let i = 0; i < 100; i++) {
        const log = new Log(Date.now());
        // Add large content to make the log size significant
        const largeContent = 'x'.repeat(50000); // 50KB per log
        log.addContent(`key${i}`, largeContent);
        logs.push(log);
      }

      clsTracker.sendBatchLogsImmediate(logs);

      // Should make multiple requests due to size limit
      expect(spy).toHaveBeenCalledTimes(2);

      spy.mockRestore();
    });
  });

  describe('Timer management', () => {
    beforeEach(() => {
      clsTracker = new WebTrackerBrowser({
        host: 'https://ap-guangzhou.cls.tencentcs.com',
        topicId: 'test-topic-id',
        time: 5,
        count: 10,
      });
    });

    it('should clear existing timer when sending immediately', () => {
      const spy = jest.spyOn(clsTracker as any, 'request');

      const log1 = new Log(Date.now());
      log1.addContent('test1', 'value1');
      clsTracker.send(log1);

      // Timer should be set
      // @ts-ignore
      expect(clsTracker.timer).toBeTruthy();
      expect(spy).not.toHaveBeenCalled();

      const log2 = new Log(Date.now());
      log2.addContent('test2', 'value2');
      clsTracker.sendImmediate(log2);

      // Should send immediately and clear timer
      // @ts-ignore
      expect(clsTracker.timer).toBeFalsy();
      expect(spy).toHaveBeenCalled();

      spy.mockRestore();
    });

    it('should handle multiple sends with timer', () => {
      const spy = jest.spyOn(clsTracker as any, 'request');

      const log1 = new Log(Date.now());
      log1.addContent('test1', 'value1');
      clsTracker.send(log1);

      const log2 = new Log(Date.now());
      log2.addContent('test2', 'value2');
      clsTracker.send(log2);

      // Should not send yet
      expect(spy).not.toHaveBeenCalled();

      // Advance time
      jest.advanceTimersByTime(5000);
      expect(spy).toHaveBeenCalled();

      spy.mockRestore();
    });
  });

  describe('visibilitychange event', () => {
    beforeEach(() => {
      // Reset document properties before each test
      Object.defineProperty(document, 'hidden', { value: false, writable: true });
      Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true });

      clsTracker = new WebTrackerBrowser({
        host: 'https://ap-guangzhou.cls.tencentcs.com',
        topicId: 'test-topic-id',
      });
    });

    it('should send logs on visibilitychange hidden event', () => {
      const spy = jest.spyOn(clsTracker as any, 'request');

      const log = new Log(Date.now());
      log.addContent('test', 'value');
      clsTracker.send(log);

      // Should not send yet
      expect(spy).not.toHaveBeenCalled();

      // Simulate visibilityState event
      Object.defineProperty(document, 'hidden', { value: true });
      Object.defineProperty(document, 'visibilityState', { value: 'hidden' });
      window.dispatchEvent(new Event('visibilitychange'));

      // Should send immediately
      expect(spy).toHaveBeenCalled();

      spy.mockRestore();
    });
  });

  describe('Empty array handling', () => {
    beforeEach(() => {
      // Reset document properties before each test
      Object.defineProperty(document, 'hidden', { value: false, writable: true });
      Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true });

      clsTracker = new WebTrackerBrowser({
        host: 'https://ap-guangzhou.cls.tencentcs.com',
        topicId: 'test-topic-id',
      });
    });

    it('should handle empty log array', () => {
      const spy = jest.spyOn(clsTracker as any, 'request');

      clsTracker.sendBatchLogsImmediate([]);

      // Should not make any request
      expect(spy).not.toHaveBeenCalled();

      spy.mockRestore();
    });

    it('should handle sendImmediate with empty array', () => {
      const spy = jest.spyOn(clsTracker as any, 'sendImmediateInner');

      // Simulate visibilityState event
      Object.defineProperty(document, 'hidden', { value: true });
      Object.defineProperty(document, 'visibilityState', { value: 'hidden' });
      window.dispatchEvent(new Event('visibilitychange'));

      // Should call sendImmediateInner but not make request
      expect(spy).toHaveBeenCalled();
      expect(mockAxios.post).not.toHaveBeenCalled();

      spy.mockRestore();
    });
  });
});
