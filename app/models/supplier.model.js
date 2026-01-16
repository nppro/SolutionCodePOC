const { getDB } = require("../config/db");

const DUMMY_SUPPLIERS = [
  {
    id: 1,
    name: "John Doe",
    address: "123 Main St",
    city: "Anytown",
    state: "CA",
    email: "john.doe@example.com",
    phone: "123-456-7890",
  },
  {
    id: 2,
    name: "Jane Smith",
    address: "456 Oak Ave",
    city: "Othertown",
    state: "TX",
    email: "jane.smith@example.com",
    phone: "987-654-3210",
  },
];

// constructor
const Supplier = function (supplier) {
  this.id = supplier.id;
  this.name = supplier.name;
  this.address = supplier.address;
  this.city = supplier.city;
  this.state = supplier.state;
  this.email = supplier.email;
  this.phone = supplier.phone;
};

Supplier.create = async (newSupplier) => {
  const db = getDB();
  if (!db) {
    throw new Error("Database not available");
  }
  const [result] = await db.query("INSERT INTO students SET ?", newSupplier);
  return { id: result.insertId, ...newSupplier };
};

Supplier.getAll = async () => {
  const db = getDB();
  if (!db) {
    throw new Error("Database not available");
  }
  const [rows] = await db.query("SELECT * FROM students");
  return rows;
};

Supplier.findById = async (supplierId) => {
  const db = getDB();
  if (!db) {
    throw new Error("Database not available");
  }
  const row = await db.query(`SELECT * FROM students WHERE id = ${supplierId}`);
  return row.length ? row[0] : null;
};

Supplier.updateById = async (id, supplier) => {
  const db = getDB();
  if (!db) {
    throw new Error("Database not available");
  }
  const [result] = await db.query(
    "UPDATE students SET name = ?, city = ?, address = ?, email = ?, phone = ?, state = ? WHERE id = ?",
    [
      supplier.name,
      supplier.city,
      supplier.address,
      supplier.email,
      supplier.phone,
      supplier.state,
      id,
    ]
  );
  return result.affectedRows > 0;
};

Supplier.delete = async (id) => {
  const db = getDB();
  if (!db) {
    throw new Error("Database not available");
  }
  const [result] = await db.query("DELETE FROM students WHERE id = ?", [id]);
  if (result.affectedRows === 0) {
    throw new Error("not_found");
  }
  return result;
};

Supplier.removeAll = async () => {
  const db = getDB();
  if (!db) {
    throw new Error("Database not available");
  }
  const [result] = await db.query("DELETE FROM students");
  return result;
};

module.exports = Supplier;
