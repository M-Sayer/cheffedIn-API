const { expect } = require('chai');
const supertest = require('supertest');
process.NODE_ENV = 'test';

global.expect = expect;
global.supertest = supertest;
