import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link2, Package, Truck, DollarSign, Unlink } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProductSupplierLinkPanel = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [linkedSuppliers, setLinkedSuppliers] = useState([]);

  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [supplierPrice, setSupplierPrice] = useState('');

  const [loadingLinks, setLoadingLinks] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/products/all');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      toast.error('PRODUCT REGISTRY OFFLINE');
      setProducts([]);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/suppliers');
      const data = await res.json();
      setSuppliers(Array.isArray(data) ? data : []);
    } catch {
      toast.error('SUPPLIER REGISTRY OFFLINE');
      setSuppliers([]);
    }
  };

  const fetchLinkedSuppliers = async (productId) => {
    if (!productId) {
      setLinkedSuppliers([]);
      return;
    }

    setLoadingLinks(true);
    try {
      const res = await fetch(`http://localhost:8080/api/suppliers/by-product/${productId}`);
      const data = await res.json();
      setLinkedSuppliers(Array.isArray(data) ? data : []);
    } catch {
      toast.error('LINKED SUPPLIER DATA OFFLINE');
      setLinkedSuppliers([]);
    } finally {
      setLoadingLinks(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, []);

  useEffect(() => {
    fetchLinkedSuppliers(selectedProductId);
  }, [selectedProductId]);

  const selectedProduct = useMemo(
    () => products.find((p) => String(p.id) === String(selectedProductId)),
    [products, selectedProductId]
  );

  const handleLink = async (e) => {
    e.preventDefault();

    if (!selectedProductId || !selectedSupplierId) {
      toast.error('SELECT PRODUCT AND SUPPLIER');
      return;
    }

    const loading = toast.loading('CREATING LINK...');

    try {
      const res = await fetch('http://localhost:8080/api/suppliers/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: Number(selectedProductId),
          supplierId: Number(selectedSupplierId),
          supplierPrice: supplierPrice === '' ? null : Number(supplierPrice)
        })
      });

      if (res.ok) {
        toast.success('SUPPLIER LINKED TO PRODUCT', { id: loading });
        setSelectedSupplierId('');
        setSupplierPrice('');
        fetchLinkedSuppliers(selectedProductId);
      } else {
        const text = await res.text();
        toast.error(text || 'LINK FAILED', { id: loading });
      }
    } catch {
      toast.error('LINK FAILED', { id: loading });
    }
  };

  const handleUnlink = async (supplierId) => {
    if (!selectedProductId || !supplierId) return;

    const ok = window.confirm('Unlink this supplier from the selected product?');
    if (!ok) return;

    const loading = toast.loading('REMOVING LINK...');

    try {
      const res = await fetch(
        `http://localhost:8080/api/suppliers/unlink?productId=${selectedProductId}&supplierId=${supplierId}`,
        { method: 'DELETE' }
      );

      if (res.ok) {
        toast.success('SUPPLIER UNLINKED', { id: loading });
        fetchLinkedSuppliers(selectedProductId);
      } else {
        const text = await res.text();
        toast.error(text || 'UNLINK FAILED', { id: loading });
      }
    } catch {
      toast.error('UNLINK FAILED', { id: loading });
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <Link2 size={18} className="text-[#D4AF37]" />
          <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
            Product Supplier Mapping
          </p>
        </div>

        <h2 className="text-3xl font-black text-white">Supplier Product Link Center</h2>
        <p className="text-sm text-gray-400 mt-3 max-w-3xl">
          Connect suppliers to products, store supplier pricing, and manage procurement links from one panel.
        </p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleLink}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6 shadow-xl"
      >
        <FieldShell label="Select Product" icon={<Package size={16} />}>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white"
          >
            <option value="">Choose product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </FieldShell>

        <FieldShell label="Select Supplier" icon={<Truck size={16} />}>
          <select
            value={selectedSupplierId}
            onChange={(e) => setSelectedSupplierId(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white"
          >
            <option value="">Choose supplier</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </FieldShell>

        <FieldShell label="Supplier Price" icon={<DollarSign size={16} />}>
          <input
            type="number"
            min="0"
            step="0.01"
            value={supplierPrice}
            onChange={(e) => setSupplierPrice(e.target.value)}
            placeholder="Enter supplier price"
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white"
          />
        </FieldShell>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded-xl bg-[#D4AF37] text-black font-bold py-4 hover:bg-white transition"
          >
            Link Supplier
          </button>
        </div>
      </motion.form>

      <div className="rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-5 border-b border-white/10 bg-black/20">
          <p className="text-sm font-bold text-white">
            {selectedProduct
              ? `Linked Suppliers for ${selectedProduct.name}`
              : 'Select a product to view linked suppliers'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Procurement relationships and supplier pricing
          </p>
        </div>

        {!selectedProductId ? (
          <div className="px-6 py-16 text-center text-gray-400">
            Choose a product above to load linked suppliers.
          </div>
        ) : loadingLinks ? (
          <div className="px-6 py-16 text-center text-gray-400">
            Loading links...
          </div>
        ) : linkedSuppliers.length === 0 ? (
          <div className="px-6 py-16 text-center text-gray-400">
            No suppliers linked to this product yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="bg-white/[0.02]">
                <tr className="text-[11px] uppercase tracking-[0.22em] text-gray-400">
                  <th className="px-6 py-4 font-semibold">Supplier</th>
                  <th className="px-6 py-4 font-semibold">Contact Person</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Phone</th>
                  <th className="px-6 py-4 font-semibold">Supplier Price</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {linkedSuppliers.map((link) => (
                  <tr
                    key={link.id}
                    className="border-t border-white/6 hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-6 py-5 text-white font-semibold">
                      {link.supplier?.name || '-'}
                    </td>

                    <td className="px-6 py-5 text-gray-300">
                      {link.supplier?.contactPerson || '-'}
                    </td>

                    <td className="px-6 py-5 text-gray-300">
                      {link.supplier?.email || '-'}
                    </td>

                    <td className="px-6 py-5 text-gray-300">
                      {link.supplier?.phoneNumber || '-'}
                    </td>

                    <td className="px-6 py-5 text-gray-300">
                      {link.supplierPrice ?? '-'}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleUnlink(link.supplier?.id)}
                          className="inline-flex items-center gap-2 rounded-2xl border border-red-500/15 bg-red-500/8 px-4 py-2.5 text-sm font-semibold text-red-300 transition-all hover:border-red-500/40 hover:bg-red-500/12 hover:text-red-200"
                        >
                          <Unlink size={16} />
                          Unlink
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const FieldShell = ({ label, icon, children }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs text-gray-400 flex items-center gap-2">
      <span className="text-[#D4AF37]">{icon}</span>
      {label}
    </label>
    {children}
  </div>
);

export default ProductSupplierLinkPanel;