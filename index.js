const express = require("express");
const app = express();
const fs = require('fs');
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'calculator-microservice' },
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}
const add = (n1, n2) => {
    return n1 + n2;
}
const subtract = (n1, n2) => {
    return n1 - n2;
}
const multiply = (n1, n2) => {
    return n1 * n2;
}
const divide = (n1, n2) => {
    if (n2 === 0) throw new Error("Cannot divide by zero");
    return n1 / n2;
}
const exponentiation = (n1, n2) => {
    return Math.pow(n1, n2); //n1^n2
}
const squareRoot = (n) => {
    if (n < 0) throw new Error("Cannot take square root of negative number");;
    return Math.sqrt(n);
}
const modulo = (n1, n2) => {
    return n1 % n2;
}

function performOperation(req, res, operation, operationFunc) {
    try {
        const n1 = parseFloat(req.query.n1);
        const n2 = parseFloat(req.query.n2);
        if (isNaN(n1) || isNaN(n2)) {
            throw new Error("Invalid input numbers");
        }

        const result = operationFunc(n1, n2);
        logger.info(`Operation performed: New ${operation} with numbers ${n1} and ${n2}`);
        res.status(200).json({ statusCode: 200, operation, result });
    } catch (error) {
        logger.error(`Error performing ${operation}: ${error.message}`);
        res.status(400).json({ statusCode: 400, message: error.message });
    }
}

app.get("/add", (req, res) => {
    performOperation(req, res, 'add', add);
});

app.get("/subtract", (req, res) => {
    performOperation(req, res, 'subtract', subtract);
});

app.get("/multiply", (req, res) => {
    performOperation(req, res, 'multiply', multiply);
});

app.get("/divide", (req, res) => {
    performOperation(req, res, 'divide', divide);
});

app.get("/exponentiation", (req, res) => {
    performOperation(req, res, 'exponentiation', exponentiation);
});

app.get("/modulo", (req, res) => {
    performOperation(req, res, 'modulo', modulo);
});

app.get("/squareRoot", (req, res) => {
    try {
        const number = parseFloat(req.query.n);
        if (isNaN(number)) {
            throw new Error("Invalid input number");
        }

        const result = squareRoot(number);
        logger.info(`Square root operation performed on number ${number}`);
        res.status(200).json({ statusCode: 200, operation: "squareRoot", result });
    } catch (error) {
        logger.error(`Error performing square root: ${error.message}`);
        res.status(400).json({ statusCode: 400, message: error.message });
    }
});

const port = 3040;
app.listen(port, () => {
    console.log("hello i'm listening to port" + port);
})
