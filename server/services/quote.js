const fetch = require("node-fetch");
const { query, validationResult } = require("express-validator");
const UserError = require("../UserError");
const ServerError = require("../ServerError");

const exchangeApiUrl = "https://api.exchangeratesapi.io/latest";
const supportedCurrencies = ["USD", "EUR", "ILS"];
const supportedCurrenciesString = supportedCurrencies.join(", ");

const somethingWrongErrorMessage =
  "Something wrong with the service. Try again later";

module.exports = async function quoteService(req, res, next) {
  try {
    // validate query input
    await query("base_currency")
      .isIn(supportedCurrencies)
      .withMessage(
        `Base currency is not supported. Supported: ${supportedCurrenciesString}`
      )
      .run(req);

    await query("quote_currency")
      .isIn(supportedCurrencies)
      .withMessage(
        `Quote currency is not supported. Supportd: ${supportedCurrenciesString}`
      )
      .run(req);

    await query("base_amount")
      .isInt({
        allow_leading_zeroes: false,
        min: 0,
      })
      .withMessage(
        "The base amount must be an integer and greater or equal to zero"
      )
      .toInt()
      .run(req);

    // if query input validation failed, send an error message to the client
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      const firstValidationError = validation.array()[0];
      throw new UserError(firstValidationError.msg, 422, {
        field: firstValidationError.param,
      });
    }

    // get the validated and sanitized query parameters
    const { base_currency, quote_currency, base_amount } = req.query;

    // check if the base amount is in safe computable range
    if (!Number.isSafeInteger(base_amount)) {
      throw new UserError(
        `The base amount is too big, we can't correctly calculate the result. Try to use the value less than ${Number.MAX_SAFE_INTEGER}`,
        422
      );
    }

    // if base and quote currencies are the same, do not fetch any data, just return as the rate is equal 1
    if (base_currency === quote_currency) {
      return res.json({
        exchange_rate: 1,
        quote_amount: base_amount,
      });
    }

    // create a request URL and fetch the rates
    const fetchUrl = `${exchangeApiUrl}?base=${base_currency}&symbols=${quote_currency}`;
    const response = await fetch(fetchUrl);

    // if the response is invalid, log and return an error to the client
    if (!response.ok) {
      console.error(`Status code received from: ${fetchUrl}`, response.status);
      console.error(await response.json());
      throw new ServerError(somethingWrongErrorMessage);
    }

    // try to get the rate from the response
    const data = await response.json();
    const exchange_rate = data.rates && data.rates[quote_currency];

    // if the response is not as expected, log and return an error to the client
    if (typeof exchange_rate !== "number") {
      console.error(`The unexpected response received from ${fetchUrl}`);
      console.error(data);
      throw new ServerError(somethingWrongErrorMessage);
    }

    // calculate and round the quote amount to the integer
    const quote_amount = Math.round(base_amount * exchange_rate);

    // check if the result is in safe computable range
    if (!Number.isSafeInteger(quote_amount)) {
      throw new UserError(
        `The result is out of a safe computable range. Try to use base amount less than ${Math.floor(
          base_amount / exchange_rate
        )}`,
        422
      );
    }

    // round exchange rate up to 3 decimal digits and return the result to the user
    return res.json({
      exchange_rate: Math.round(exchange_rate * 1000) / 1000,
      quote_amount,
    });
  } catch (err) {
    // return an unexpected error
    return next(err);
  }
};
