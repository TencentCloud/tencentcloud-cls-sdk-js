// import * as mocha from 'mocha';
import { LogGroup, Log, AsyncClient} from '../src/index'
import { PutLogsRequest } from '../src/request/putLogsRequest';

describe('send log test', () => {
    it('test send logs' , async () => {
        let client = new AsyncClient({
            endpoint: "http://ap-guangzhou-open.cls.tencentcs.com",
            retry_times: 2,
        });

        let logGroup = new LogGroup("127.0.0.1")
        logGroup.setSource("127.0.0.1")

        let log = new Log(Date.now())
        log.addContent("hello", "hello world中文")
        logGroup.addLog(log)

        let request = new PutLogsRequest("", logGroup);
        await client.PutLogs(request);
    });
});