## Setup
`npm install`

### How to run code
1. Start server: `npm run api`
2. Run code: `npm start`

### How to run tests
`npm test`
> Since the server starts automatically when tests are run, there is no need to start the server
---

## Test cases
#### Approach
* I took a test-driven development approach (TDD), writing test cases that initially failed because the api wasn't called
* I changed the original `assert.ok(result.income > 0)` in the original first test case to be `assert.strictEqual(...)`
* For the first few test cases of each category, I manually calculated the intended value returned by each function
* For the remaining test cases, I got Claude to generate the input and output values, but some outputs were inaccurate
* Realising this, Claude recommended this script to get the exact values:
```
node -e "                                                                                                                                                                   
  const M = 4600;
  const R = (7.5 / 100) / 12;
  const N = 360;
  const P = M * ((1 - Math.pow(1 + R, -N)) / R);
  console.log('maxLoanAmount:', Number(P.toFixed(2)));
  console.log('monthlyRepayment:', 4600);
  "
```
* I then reprompted Claude to use the script above for other income and dependent values

#### Assumptions
* Input values are of the correct data types (ie integer / double)
* All errors returned by the server has the `"error"` key

---
## Calling APIs and Making it Manageable
#### Approach
* Tested using Postman to ensure endpoints were working as intended
* Settled with using a class to store calculator functions. Options comparison:

| Approach      | Pro                         | Con                                           |
|---------------|-----------------------------|-----------------------------------------------|
| Class         | OOP, modularity, extensible | Might be trivial for small classes            |
| Orchestractor | Simple                      | Doesn't rly organise code, poor extensibility |
| Factory       | No `this` required          | Functions aren't shared in memory             |

---
### What I found interesting
* In `getHEM(income=120000, dependent=2.9)` I assumed that dependents would get rounded down to 2 as this function rounds it down but because when it gets passed to the server first, the server rounds it up instead

### What I would change
* Not commit the bearer token, instead use `.env` file to store environment variables
* Use ESLint and Prettier to ensure adherence to good coding practices
* Use mock apis for unit testing

### Changes to `package.json`
* Added `--exit` to shut down server after all tests are run
* Added overrides to force patched versions of mocha's sub-dependencies without introducing breaking changes