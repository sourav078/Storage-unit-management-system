const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const { expect } = chai;

const StorageUnit = require('../models/StorageUnit');
const { getStorageUnits } = require('../controllers/storageUnitController');

describe('Get Storage Units Function Test', () => {

  afterEach(() => {
    sinon.restore();
  });

  it('should return storage units successfully', async () => {
    const fakeUnits = [
      { _id: new mongoose.Types.ObjectId(), name: 'Unit A' },
      { _id: new mongoose.Types.ObjectId(), name: 'Unit B' }
    ];

    sinon.stub(StorageUnit, 'find').returns({
      sort: sinon.stub().resolves(fakeUnits)
    });

    const req = {};
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await getStorageUnits(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(fakeUnits)).to.be.true;
  });

  it('should return 500 if an error occurs', async () => {
    sinon.stub(StorageUnit, 'find').throws(new Error('DB Error'));

    const req = {};
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await getStorageUnits(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });

});