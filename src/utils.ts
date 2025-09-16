/**
 * 生成重试等待时间
 * @reference https://juejin.cn/post/6982032399580266510
 * @param {number} times 重试次数
 * @param {number} maximumBackoff 最大等待毫秒数
 * @returns {number}
 */
export function createTimeout(times: number, maximumBackoff: number): number {
  const randomNumberMilliseconds = Math.floor(Math.random() * 1000);
  return Math.min(2 ** times * 1000 + randomNumberMilliseconds, maximumBackoff);
}
