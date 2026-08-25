/**
 * Borrowing Power Calculator Test Suite
 */


const assert = require('assert');
const {calculateBorrowingPower, getTax, getHEM} = require('./borrowingCalculator');

describe('Tax Calculation', () => {

    it('should return 0 tax for an income of 0', async() =>  {
        const result = await getTax(0);
        assert.strictEqual(result, 0);
    });

    it('should return 0 tax when income is exactly at the 20000 threshold', async () => {
        const result = await getTax(20000);
        assert.strictEqual(result, 0);
    });

    it('should apply the 15% bracket when income is just above 20000', async () => {
        const result = await getTax(20001);
        assert.strictEqual(result, 0);
    });

    it('should not apply the 25% bracket when income is exactly at the 50000 threshold', async () => {
        const result = await getTax(50000);
        assert.strictEqual(result, 4500);
    });

    it('should apply the 25% bracket when income is just above 50000', async () => {
        const result = await getTax(50001);
        assert.strictEqual(result, 4500);
    });

    it('should not apply the 35% bracket when income is exactly at the 100000 threshold', async () => {
        const result = await getTax(100000);
        assert.strictEqual(result, 17000);
    });

    it('should apply the 35% bracket when income is just above 100000', async () => {
        const result = await getTax(100001);
        assert.strictEqual(result, 17000);
    });

    it('should correctly stack all tax brackets for income well above 100000', async () => {
        const result = await getTax(150000);
        assert.strictEqual(result, 34500);
    });

});


describe('HEM Calculation', () => {
    it ('should return low tier HEM with no dependents', () => {
        const result = getHEM(50000, 0);
        assert.strictEqual(result, 1600);
    });

    it('should return medium tier HEM with no dependents', () => {
        const result = getHEM(80000, 0);
        assert.strictEqual(result, 2200);
    });

    it('should return high tier HEM with no dependents', () => {
        const result = getHEM(200000, 0);
        assert.strictEqual(result, 2600);
    });

    it('should cap dependents at 3', () => {
        const result = getHEM(50000, 5);
        assert.strictEqual(result, 2800);
    });

    it('should treat income of exactly 60000 as low tier', () => {
        const result = getHEM(60000, 0);
        assert.strictEqual(result, 1600);
    });

    it('should treat income of exactly 150000 as medium tier', () => {
        const result = getHEM(150000, 0);
        assert.strictEqual(result, 2200);
    });

    it('should floor decimal dependents', () => {
        const result = getHEM(50000, 2.9);
        assert.strictEqual(result, 2500);
    });

    it('should treat negative dependents as 0', () => {
        const result = getHEM(50000, -1);
        assert.strictEqual(result, 1600);
    });

    it ('should treat negative income as low tier', () => {
        const result = getHEM(-50000, 0);
        assert.strictEqual(result, 1600)
    })
})

describe('Borrowing Power Calculation', () => {

    it('should calculate borrowing power for standard values', () => {
        const result = calculateBorrowingPower(120000, 2, 3000, 10000, 7.5);
        assert.strictEqual(result.maxLoanAmount, 657881.09)
        assert.strictEqual(result.monthlyRepayment, 4600);
    });

    it('should return 0 for invalid negative inputs', () => {
        const result = calculateBorrowingPower(30000, 3, 4000, 5000, 7.5);
        assert.strictEqual(result.maxLoanAmount, 0);
        assert.strictEqual(result.monthlyRepayment, 0);
    });

    it('should return 0 when expenses exceed income capacity', () => {
        const result = calculateBorrowingPower(30000, 3, 4000, 5000, 7.5);
        assert.strictEqual(result.maxLoanAmount, 0);
        assert.strictEqual(result.monthlyRepayment, 0);
    });

    it('should return 0 when credit card liability eliminates repayment capacity', () => {
        const result = calculateBorrowingPower(120000, 0, 1000, 200000, 7.5);
        assert.strictEqual(result.maxLoanAmount, 0);
        assert.strictEqual(result.monthlyRepayment, 0);
    });

    it('should use HEM when it exceeds declared expenses', () => {
        const result = calculateBorrowingPower(120000, 0, 1000, 0, 7.5);
        assert.strictEqual(result.maxLoanAmount, 829502.24);
        assert.strictEqual(result.monthlyRepayment, 5800);
    });

    it('should use declared expenses when they exceed HEM', () => {
        const result = calculateBorrowingPower(120000, 0, 5000, 0, 7.5);
        assert.strictEqual(result.maxLoanAmount, 429052.88);
        assert.strictEqual(result.monthlyRepayment, 3000);
    });

    it('should reduce borrowing power based on credit card limits', () => {
        const result = calculateBorrowingPower(120000, 0, 1000, 10000, 7.5);
        assert.strictEqual(result.maxLoanAmount, 786596.95);
        assert.strictEqual(result.monthlyRepayment, 5500);
    });

    it('should calculate lower borrowing power at a higher assessment rate', () => {
        const result = calculateBorrowingPower(120000, 0, 1000, 0, 10.0);
        assert.strictEqual(result.maxLoanAmount, 660914.76);
        assert.strictEqual(result.monthlyRepayment, 5800);
    });

    it('should reduce borrowing power as dependents increase HEM', () => {
        const result = calculateBorrowingPower(120000, 3, 1000, 0, 7.5);
        assert.strictEqual(result.maxLoanAmount, 643579.32);
        assert.strictEqual(result.monthlyRepayment, 4500);
    });

});

