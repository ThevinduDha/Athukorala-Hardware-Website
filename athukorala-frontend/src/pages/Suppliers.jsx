import React, { useEffect, useState } from "react";
import { getSuppliers, addSupplier } from "../services/inventoryApi";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getSuppliers();
    setSuppliers(res.data);
  };

  const handleAdd = async () => {
    await addSupplier({ name });
    setName("");
    load();
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl mb-4">Suppliers</h2>

      <div className="mb-4">
        <input
          className="p-2 bg-gray-800 rounded"
          placeholder="Supplier Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="ml-2 px-4 py-2 bg-blue-600 rounded"
        >
          Add
        </button>
      </div>

      <ul>
        {suppliers.map((s) => (
          <li key={s.id} className="mb-2">
            {s.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Suppliers;