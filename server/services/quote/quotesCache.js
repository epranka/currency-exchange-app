const memoryCache = require("memory-cache");

module.exports = function quotesCacheFactory(durationInMs) {
  const quotesCache = new memoryCache.Cache();

  const put = (baseCurrency, quoteCurrency, exchange_rate) => {
    const key = baseCurrency + "-" + quoteCurrency;
    quotesCache.put(key, exchange_rate, durationInMs);
    const invertedKey = quoteCurrency + "-" + baseCurrency;
    const invertedExchangeRate = 1 / exchange_rate;
    quotesCache.put(invertedKey, invertedExchangeRate, durationInMs);
  };

  const get = (baseCurrency, quoteCurrency) => {
    const key = baseCurrency + "-" + quoteCurrency;
    return quotesCache.get(key);
  };

  return { put, get };
};
