class BaseRepository {
  constructor(model, request) {
    if (!model) throw new Error("Model Object Required");
    if (!request ) throw new Error("Request Object Required");

    this.model = model;
    this.request = request;
    this.data = {};
    this.where = {};
    this.relations = [];
    this.options = {
      raw: true,
      nest: true,
    };
  }

  get primaryKey() {
    return this.model.primaryKeyAttributes;
  }

  get attributes() {
    return Object.keys(this.model.rawAttributes);
  }

  hasAttribute(attribute) {
    return this.attributes.indexOf(attribute) > -1;
  }

  setData(data, isNewRecord = false) {
    this.data = {};
    this.data = data || {};

    // set created by and updated by
    if (this.request && this.request.user) {
      if (this.hasAttribute("created_by") && isNewRecord) {
        this.data.created_by = this.request.user.id;
      }
  
      if (this.hasAttribute("updated_by") && !isNewRecord) {
        this.data.updated_by = this.request.user.id;
      }
    }
  }

  setWhere(where, isUpdateOrDelete = false) {
    this.where = {};
    if (isUpdateOrDelete) {
      if (!where || !isObject(where)) {
        throw new Error("Where Must be an Object");
      }
  
      // this is to prevent from updating or deleting all records
      if (Object.keys(where).length === 0) {
        throw new Error("Where Object Cannot be Empty");
      }
    }

    this.where = where || {};

    if (!isUpdateOrDelete) {
      // by default, find query will add "deleted_at IS NULL"
      if (this.hasAttribute("deleted_at") && !this.where.hasOwnProperty("deleted_at")) {
        this.where.deleted_at = null;
      }
    }
  }

  setRelations(relations) {
    let includes = relations.map(v => {
      let value = {};
      Object.assign(value, v);

      value.model = appRequire("models")[v.model];
      return value;
    });

    this.relations = includes;
  }

  async findByPk({ id, relations }) {
    if (relations) this.setRelations(relations);
    let process = await this.model.findByPk(id, { include: this.relations, ...this.options });
    return process;
  }

  async findOne({ where, relations }) {
    this.setWhere(where);
    if (relations) this.setRelations(relations);
    let process = await this.model.findOne({
      where: this.where,
      include: this.relations,
    }, this.options);
    return process;
  }

  async count({ where, relations }) {
    this.setWhere(where);
    if (relations) this.setRelations(relations);
    let process = await this.model.count({
      where: this.where,
      include: this.relations,
    }, this.options);
    return process;
  }

  async findAll({ where, relations } = {}) {
    this.setWhere(where);
    if (relations) this.setRelations(relations);
    let process = await this.model.findAll({
      where: this.where,
      include: this.relations,
    }, this.options);
    return process;
  }

  async create({ data, addOptions = {} }) {
    this.setData(data, true);
    let process = await this.model.create(this.data, addOptions);
    return process;
  }

  async update({ data, where, addOptions = {} }) {
    this.setData(data);
    this.setWhere(where, true);
    this.primaryKey.forEach(key => delete this.data[key]);
    let process = await this.model.update(this.data, {
      where: this.where,
      individualHooks: true,
      ...addOptions,
    });
    return process;
  }

  async softDelete({ where }) {
    this.setWhere(where, true);
    let process = await this.model.update({ deleted_at: new Date() }, {
      where: this.where,
      individualHooks: true,
    });
    return process;
  }

  async destroy({ where }) {
    this.setWhere(where, true);
    let process = await this.model.destroy({
      where: this.where,
      individualHooks: true,
    })
    return process;
  }

  async truncate() {
    let process = await this.model.destroy({ truncate: true });
    return process;
  }
}

module.exports = BaseRepository;