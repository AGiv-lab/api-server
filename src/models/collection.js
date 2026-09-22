'use strict';

class Collection {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return this.model.create(data);
  }

  async read(id) {
    if (id) {
      return this.model.findByPk(id);
    }

    return this.model.findAll();
  }
  async update(id, data) {
    const record = await this.model.findByPk(id);

    if (!record) {
      return null;
    }

    return record.update(data);
  }

  async delete(id) {
    const record = await this.model.findByPk(id);

    if (!record) {
      return null;
    }

    await record.destroy();
    return record;
  }
}

module.exports = Collection;