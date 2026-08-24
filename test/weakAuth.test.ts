import * as chai from 'chai';
import * as nock from 'nock';
import { LogItem, Content, LogGroup, AsyncClient } from '../src/index';
import { PutLogsRequest } from '../src/request/putLogsRequest';
import { INVALID_UIN, SDK_VERSION, SDK_USER_AGENT } from '../src/common/constants';

const expect = chai.expect;

describe('Weak Auth (免密) Feature Tests', () => {

    afterEach(() => {
        nock.cleanAll();
    });

    // ============================================================
    // §3.3 决策表测试
    // ============================================================
    describe('Decision Table (§3.3)', () => {

        it('AK/SK 齐全 + 无 Uin → 强鉴权（不报错）', () => {
            expect(() => {
                new AsyncClient({
                    endpoint: "ap-guangzhou.cls.tencentcs.com",
                    secretId: "AKIDxxxxxxxxx",
                    secretKey: "secretKeyXXXX",
                    sourceIp: "127.0.0.1",
                    retry_times: 2,
                });
            }).to.not.throw();
        });

        it('AK/SK 齐全 + 有 Uin → 强鉴权（Uin 被忽略，不报错）', () => {
            const client = new AsyncClient({
                endpoint: "ap-guangzhou.cls.tencentcs.com",
                secretId: "AKIDxxxxxxxxx",
                secretKey: "secretKeyXXXX",
                sourceIp: "127.0.0.1",
                retry_times: 2,
                uin: "123456789",
            });
            expect(client.isWeakAuth()).to.equal(false);
        });

        it('AK/SK 不齐 + Uin 已填且合法 → 弱鉴权', () => {
            const client = new AsyncClient({
                endpoint: "ap-guangzhou.cls.tencentcs.com",
                sourceIp: "127.0.0.1",
                retry_times: 2,
                uin: "123456789",
            });
            expect(client.isWeakAuth()).to.equal(true);
        });

        it('AK/SK 不齐 + 无 Uin → 构造期报错「缺少密钥」', () => {
            expect(() => {
                new AsyncClient({
                    endpoint: "ap-guangzhou.cls.tencentcs.com",
                    sourceIp: "127.0.0.1",
                    retry_times: 2,
                });
            }).to.throw("secretId or secretKey can not be empty, or set uin to use weak authorization");
        });

        it('AK/SK 不齐 + Uin 非纯数字 → 构造期报错 InvalidUin', () => {
            expect(() => {
                new AsyncClient({
                    endpoint: "ap-guangzhou.cls.tencentcs.com",
                    sourceIp: "127.0.0.1",
                    retry_times: 2,
                    uin: "abc123",
                });
            }).to.throw(INVALID_UIN);
        });

        it('仅填 SecretID 无 SecretKey + 无 Uin → 报错「缺少密钥」', () => {
            expect(() => {
                new AsyncClient({
                    endpoint: "ap-guangzhou.cls.tencentcs.com",
                    secretId: "AKIDxxxxxxxxx",
                    sourceIp: "127.0.0.1",
                    retry_times: 2,
                });
            }).to.throw("secretId or secretKey can not be empty, or set uin to use weak authorization");
        });

        it('Uin 为负数字符串 → 构造期报错 InvalidUin', () => {
            expect(() => {
                new AsyncClient({
                    endpoint: "ap-guangzhou.cls.tencentcs.com",
                    sourceIp: "127.0.0.1",
                    retry_times: 2,
                    uin: "-123",
                });
            }).to.throw(INVALID_UIN);
        });

        it('Uin 含空格 → 构造期报错 InvalidUin', () => {
            expect(() => {
                new AsyncClient({
                    endpoint: "ap-guangzhou.cls.tencentcs.com",
                    sourceIp: "127.0.0.1",
                    retry_times: 2,
                    uin: "123 456",
                });
            }).to.throw(INVALID_UIN);
        });
    });

    // ============================================================
    // 弱鉴权请求头断言
    // ============================================================
    describe('Weak Auth Request Headers', () => {

        it('弱鉴权请求：带 x-cls-auth-mode + X-CLS-Uin，不带 Authorization / X-Cls-Token', async () => {
            const testUin = "100012345678";

            const scope = nock("http://ap-guangzhou.cls.tencentcs.com")
                .post(/\/structuredlog/)
                .reply(function(_uri, _body) {
                    const headers = this.req.headers;
                    // 必须带弱鉴权头
                    expect(headers['x-cls-auth-mode']).to.include('weak');
                    expect(headers['x-cls-uin']).to.include(testUin);
                    // 必须不带 Authorization / X-Cls-Token
                    expect(headers['authorization']).to.be.undefined;
                    expect(headers['x-cls-token']).to.be.undefined;
                    // 必须带 User-Agent
                    expect(headers['user-agent']).to.include('cls-js-sdk-');
                    return [200, ''];
                });

            const client = new AsyncClient({
                endpoint: "ap-guangzhou.cls.tencentcs.com",
                sourceIp: "127.0.0.1",
                retry_times: 1,
                uin: testUin,
            });

            let item = new LogItem();
            item.pushBack(new Content("key", "value"));
            item.setTime(Math.floor(Date.now() / 1000));
            let loggroup = new LogGroup();
            loggroup.addLogs(item);
            let request = new PutLogsRequest("test-topic-id", loggroup);

            await client.PutLogs(request);
            expect(scope.isDone()).to.be.true;
        });
    });

    // ============================================================
    // 强鉴权请求头断言
    // ============================================================
    describe('Strong Auth Request Headers', () => {

        it('强鉴权请求：带 Authorization，不带 x-cls-auth-mode / X-CLS-Uin', async () => {
            const scope = nock("http://ap-guangzhou.cls.tencentcs.com")
                .post(/\/structuredlog/)
                .reply(function(_uri, _body) {
                    const headers = this.req.headers;
                    // 必须带 Authorization（nock 中 header 值可能是字符串或数组）
                    const authHeader = Array.isArray(headers['authorization']) ? headers['authorization'][0] : headers['authorization'];
                    expect(authHeader).to.not.be.undefined;
                    expect(authHeader).to.include('q-sign-algorithm');
                    // 必须不带弱鉴权头
                    expect(headers['x-cls-auth-mode']).to.be.undefined;
                    expect(headers['x-cls-uin']).to.be.undefined;
                    return [200, ''];
                });

            const client = new AsyncClient({
                endpoint: "ap-guangzhou.cls.tencentcs.com",
                secretId: "AKIDxxxxxxxxx",
                secretKey: "secretKeyXXXX",
                sourceIp: "127.0.0.1",
                retry_times: 1,
            });

            let item = new LogItem();
            item.pushBack(new Content("key", "value"));
            item.setTime(Math.floor(Date.now() / 1000));
            let loggroup = new LogGroup();
            loggroup.addLogs(item);
            let request = new PutLogsRequest("test-topic-id", loggroup);

            await client.PutLogs(request);
            expect(scope.isDone()).to.be.true;
        });

        it('强鉴权 + secretToken → 带 X-Cls-Token', async () => {
            const scope = nock("http://ap-guangzhou.cls.tencentcs.com")
                .post(/\/structuredlog/)
                .reply(function(_uri, _body) {
                    const headers = this.req.headers;
                    expect(headers['authorization']).to.not.be.undefined;
                    const tokenHeader = Array.isArray(headers['x-cls-token']) ? headers['x-cls-token'][0] : headers['x-cls-token'];
                    expect(tokenHeader).to.not.be.undefined;
                    expect(tokenHeader).to.equal('test-session-token');
                    return [200, ''];
                });

            const client = new AsyncClient({
                endpoint: "ap-guangzhou.cls.tencentcs.com",
                secretId: "AKIDxxxxxxxxx",
                secretKey: "secretKeyXXXX",
                secretToken: "test-session-token",
                sourceIp: "127.0.0.1",
                retry_times: 1,
            });

            let item = new LogItem();
            item.pushBack(new Content("key", "value"));
            item.setTime(Math.floor(Date.now() / 1000));
            let loggroup = new LogGroup();
            loggroup.addLogs(item);
            let request = new PutLogsRequest("test-topic-id", loggroup);

            await client.PutLogs(request);
            expect(scope.isDone()).to.be.true;
        });

        it('AK/SK + Uin 并存 → 走强鉴权，不带弱鉴权头', async () => {
            const scope = nock("http://ap-guangzhou.cls.tencentcs.com")
                .post(/\/structuredlog/)
                .reply(function(_uri, _body) {
                    const headers = this.req.headers;
                    // 强鉴权
                    const authHeader = Array.isArray(headers['authorization']) ? headers['authorization'][0] : headers['authorization'];
                    expect(authHeader).to.not.be.undefined;
                    expect(authHeader).to.include('q-sign-algorithm');
                    // 不带弱鉴权头
                    expect(headers['x-cls-auth-mode']).to.be.undefined;
                    expect(headers['x-cls-uin']).to.be.undefined;
                    return [200, ''];
                });

            const client = new AsyncClient({
                endpoint: "ap-guangzhou.cls.tencentcs.com",
                secretId: "AKIDxxxxxxxxx",
                secretKey: "secretKeyXXXX",
                sourceIp: "127.0.0.1",
                retry_times: 1,
                uin: "123456789",
            });

            let item = new LogItem();
            item.pushBack(new Content("key", "value"));
            item.setTime(Math.floor(Date.now() / 1000));
            let loggroup = new LogGroup();
            loggroup.addLogs(item);
            let request = new PutLogsRequest("test-topic-id", loggroup);

            await client.PutLogs(request);
            expect(scope.isDone()).to.be.true;
        });
    });

    // ============================================================
    // 401 响应处理
    // ============================================================
    describe('401 Response Handling', () => {

        it('401 不重试，直接抛出异常并透传信息', async () => {
            const scope = nock("http://ap-guangzhou.cls.tencentcs.com")
                .post(/\/structuredlog/)
                .reply(401, {
                    errorcode: "AuthFailure.UnauthorizedOperation",
                    errormessage: "topic test-topic-id anonymous access not enabled"
                }, {
                    "X-Cls-Requestid": "req-id-12345"
                });

            const client = new AsyncClient({
                endpoint: "ap-guangzhou.cls.tencentcs.com",
                sourceIp: "127.0.0.1",
                retry_times: 3,
                uin: "100012345678",
            });

            let item = new LogItem();
            item.pushBack(new Content("key", "value"));
            item.setTime(Math.floor(Date.now() / 1000));
            let loggroup = new LogGroup();
            loggroup.addLogs(item);
            let request = new PutLogsRequest("test-topic-id", loggroup);

            try {
                await client.PutLogs(request);
                expect.fail("should have thrown");
            } catch (error) {
                expect(error.message).to.include("401");
            }
            // 确认只请求了一次（不重试）
            expect(scope.isDone()).to.be.true;
        });
    });

    // ============================================================
    // ResetSecretToken 测试
    // ============================================================
    describe('ResetSecretToken', () => {

        it('弱鉴权下调用 ResetSecretToken → 返回成功、模式不变', () => {
            const client = new AsyncClient({
                endpoint: "ap-guangzhou.cls.tencentcs.com",
                sourceIp: "127.0.0.1",
                retry_times: 2,
                uin: "123456789",
            });

            expect(client.isWeakAuth()).to.equal(true);

            // 不应抛错
            client.ResetSecretToken("newId", "newKey", "newToken");

            // 模式仍为弱鉴权（凭证未被修改）
            expect(client.isWeakAuth()).to.equal(true);
        });

        it('强鉴权下调用 ResetSecretToken → 正常更新', () => {
            const client = new AsyncClient({
                endpoint: "ap-guangzhou.cls.tencentcs.com",
                secretId: "AKIDxxxxxxxxx",
                secretKey: "secretKeyXXXX",
                sourceIp: "127.0.0.1",
                retry_times: 2,
            });

            expect(client.isWeakAuth()).to.equal(false);

            client.ResetSecretToken("newAKID", "newSecretKey", "newToken");

            // 仍为强鉴权
            expect(client.isWeakAuth()).to.equal(false);
        });

        it('强鉴权下参数为空 → 报错', () => {
            const client = new AsyncClient({
                endpoint: "ap-guangzhou.cls.tencentcs.com",
                secretId: "AKIDxxxxxxxxx",
                secretKey: "secretKeyXXXX",
                sourceIp: "127.0.0.1",
                retry_times: 2,
            });

            expect(() => {
                client.ResetSecretToken("", "newKey", "newToken");
            }).to.throw("invalid param");
        });
    });

    // ============================================================
    // 版本号测试
    // ============================================================
    describe('Version & User-Agent', () => {

        it('SDK_VERSION 格式为 x.y.z', () => {
            expect(SDK_VERSION).to.match(/^\d+\.\d+\.\d+$/);
        });

        it('SDK_USER_AGENT 格式为 cls-js-sdk-x.y.z', () => {
            expect(SDK_USER_AGENT).to.match(/^cls-js-sdk-\d+\.\d+\.\d+$/);
        });

        it('SDK_VERSION 与 package.json 版本一致', () => {
            const pkg = require('../package.json');
            expect(SDK_VERSION).to.equal(pkg.version);
        });
    });

});
