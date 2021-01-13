const { Op, QueryTypes } = require("sequelize");
const { sequelize } = appRequire("models");

class BaseRepository {
  constructor(request, model) {
    if (!request ) throw new Error("Request Required");

    this.request = request;
    this.model = appRequire("models")[model];
    this.data = {};
    this.where = {};
    this.order = [];
    this.group = [];
    this.offset = null;
    this.limit = null;
    this.include = [];
    this.options = {
      // raw: true,
      // subQuery: false,
      nest: true,
    };
  }

  get primaryKey() {
    return this.model.primaryKeyAttributes;
  }

  get attributes() {
    return Object.keys(this.model.rawAttributes);
  }

  get selectAttributes() {
    return {
      where: this.where,
      order: this.order,
      group: this.group,
      offset: this.offset,
      limit: this.limit,
      include: this.include,
    }
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

  setInclude(include) {
    for (let i in include) {
      let value = {};
      Object.assign(value, include[i]);
      value.model = appRequire("models")[include[i].model];
      include[i] = value;
      if ('include' in include[i]) {
        this.setInclude(include[i].include);
      }
    }

    this.include = include;
  }

  setOrder(order) {
    this.order = order;
  }

  setGroup(group) {
    this.group = group;
  }

  setOffset(offset) {
    this.offset = offset != null ? Number(offset) : null;
  }

  setLimit(limit) {
    this.limit = limit != null ? Number(limit) : null;
  }

  setAllAttributes({
    where,
    order,
    group,
    offset,
    limit,
    include,
  }) {
    this.setWhere(where);
    this.setOrder(order);
    this.setGroup(group);
    this.setOffset(offset);
    this.setLimit(limit);
    this.setInclude(include);
  }

  async findByPk({ id, ...rest }) {
    this.setAllAttributes({...rest});
    let process = await this.model.findByPk(id, {
      ...this.selectAttributes,
      ...this.options
    });
    return process;
  }

  async findOne({ ...rest } = {}) {
    this.setAllAttributes({ ...rest });
    let process = await this.model.findOne(this.selectAttributes, this.options);
    return process;
  }

  async count({ ...rest } = {}) {
    this.setAllAttributes({ ...rest });
    let process = await this.model.count(this.selectAttributes, this.options);
    return process;
  }

  async findAll({ ...rest } = {}) {
    this.setAllAttributes({...rest});
    let process = await this.model.findAll(this.selectAttributes, this.options);
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

  async selectRaw({ query, ...rest }) {
    let process = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      ...rest,
    });
    return process;
  }

  async dataTable({
    where = {},
    sort,
    query,
    page,
    limit,
    ...rest
  } = {}) {
    let queryTerm = {};
    if (query) {
      this.attributes.map(v => {
        if (this.model.rawAttributes[v].type.constructor.name !== "DATE") {
          queryTerm[v] = {
            [Op.like]: "%" + query + "%"
          }
        }
      });

      if (this.include.length) {
        Object.keys(this.include)
      }
      queryTerm ={
        [Op.or]: queryTerm,
      }
    }
    where = {
      ...where,
      ...queryTerm,
    };
    let order = [];
    if (sort) {
      sort = sort.split(':');
      order = [[sort[0], sort[1]]];
    }
    this.setAllAttributes({
      ...rest,
      offset: page * limit,
      limit,
      where,
      order,
    });

    let data = await this.model.findAndCountAll({
      ...this.selectAttributes,
      ...this.options,
    });

    return {
      data: data.rows,
      from: 1,
      to: Math.ceil(data.count / this.limit),
      total: data.count
    };
  }
}

module.exports = BaseRepository;