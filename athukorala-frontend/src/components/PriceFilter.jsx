import React, { useState } from "react";

const PriceFilter = ({ products, setFiltered }) => {
  const [minPrice, setMinPrice] = useState(100);
  const [maxPrice, setMaxPrice] = useState(500);

  const handleFilter = () => {
    if (minPrice > maxPrice) return; // 🔥 important

    let result = products.filter((p) => {
      const price =
        p.discountedPrice && p.discountedPrice < p.price
          ? p.discountedPrice
          : p.price || 0;

      return price >= minPrice && price <= maxPrice;
    });

    setFiltered(result);
  };

  return (
    <div className="p-4 w-full max-w-md">
      <h2 className="font-bold mb-2">Price Range</h2>

      <div className="flex justify-between text-sm mb-2">
        <span>Rs. {minPrice}</span>
        <span>Rs. {maxPrice}</span>
      </div>

      <input
        type="range"
        min="0"
        max="1000"
        value={minPrice}
        onChange={(e) => setMinPrice(Number(e.target.value))}
        className="w-full"
      />

      <input
        type="range"
        min="0"
        max="1000"
        value={maxPrice}
        onChange={(e) => setMaxPrice(Number(e.target.value))}
        className="w-full mt-2"
      />

      <button
        onClick={handleFilter}
        className="mt-3 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Apply Filter
      </button>
    </div>
  );
};

export default PriceFilter;