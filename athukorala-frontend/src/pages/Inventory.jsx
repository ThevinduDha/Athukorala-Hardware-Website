import React, { useEffect, useState } from "react";
import { getInventory } from "../services/inventoryApi";

const Inventory = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await getInventory();
    setData(res.data);
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Inventory</h2>

      <table className="w-full bg-gray-900 rounded-xl overflow-hidden">
        <thead>
          <tr className="bg-gray-800 text-left">
            <th className="p-3">Product</th>
            <th className="p-3">Stock</th>
            <th className="p-3">Reorder Level</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item.productId} className="border-b border-gray-700">
              <td className="p-3">{item.productName}</td>
              <td className="p-3">{item.quantity}</td>
              <td className="p-3">{item.reorderLevel}</td>

              <td className="p-3">
                {item.quantity <= item.reorderLevel ? (
                  <span className="text-red-400">Low Stock</span>
                ) : (
                  <span className="text-green-400">OK</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inventory;