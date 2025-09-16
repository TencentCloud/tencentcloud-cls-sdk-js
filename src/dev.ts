// 本文件仅供本地测试使用，不会构建至最终产物中
import VConsole from 'vconsole';
import { Log, WebTrackerBrowser } from './index';
const vConsole = new VConsole();

/* const clsTracker = new WebTrackerBrowser({
  host: import.meta.env.VITE_HOST,
  topicId: import.meta.env.VITE_TOPIC_ID,
  count: 2,
  time: 5,
});

const log1 = new Log(Date.now());
log1.addContent('key', 'log1');

clsTracker.send(log1);

setTimeout(() => {
  const log2 = new Log(Date.now());
  log2.addContent('key', 'log2');

  clsTracker.send(log2);
}, 3000);

setTimeout(() => {
  const log3 = new Log(Date.now());
  log3.addContent('key', 'log3');

  clsTracker.send(log3);
}, 4000);*/

const clsTracker = new WebTrackerBrowser({
  host: import.meta.env.VITE_HOST,
  topicId: import.meta.env.VITE_TOPIC_ID,
  count: 2000,
  time: 5,
  // source: '127.0.0.1',
});

for (let keyI = 0; keyI < 1000; keyI += 1) {
  const log = new Log(Date.now());
  let logLargeValue = '';
  for (let i = 0; i < 1 * 1024; i++) {
    logLargeValue += 'a';
  }
  log.addContent('key', logLargeValue);
  clsTracker.send(log);
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    // alert('hidden');
  }
});

document.addEventListener('pagehide', () => {
  // alert('pagehide');
  // vConsole.destroy();
});

document.addEventListener('beforeunload', () => {
  // alert('beforeunload');
  // vConsole.destroy();
});
document.addEventListener('unload', () => {
  // alert('unload');
  vConsole.destroy();
});
