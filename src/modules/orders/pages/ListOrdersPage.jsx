import { useEffect, useState } from 'react';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import { listOrders } from '../services/listServices';
import { updateOrderStatus } from '../services/update';

function ListOrdersPage() {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [pageNumber, setPageNumber] = useState(1);
  // 1. Agregamos setPageSize para que el dropdown funcione
  const [pageSize, setPageSize] = useState(10); 
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    const statusToSend = statusFilter === 'ALL' ? null : statusFilter;
    
    const { data, error } = await listOrders(statusToSend, pageNumber, pageSize);
    setLoading(false);

    if (error) {
      console.error("Error al cargar órdenes:", error);
      setOrders([]);
    } else {
      setOrders(data || []);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, pageNumber, pageSize]); // Agregamos pageSize a las dependencias

  const handleStatusChange = async (id, newStatus) => {
     const { error } = await updateOrderStatus(id, newStatus);

     if (error) {
       console.error("Error actualizando estado:", error);
       alert("No se pudo actualizar el estado.");
     } else {
       await fetchOrders(); 
     }
  };

  const toggleDetails = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  return (
    <div className="flex flex-col gap-5">
      
      {/* --- BARRA DE CONTROL --- */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Órdenes</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white w-full sm:w-64 focus-within:ring-2 focus-within:ring-purple-200 transition">
            <input 
              type="text" 
              placeholder="Buscar" 
              className="px-3 py-2 w-full outline-none text-sm text-gray-700 placeholder-gray-400"
            />
            <button className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-600 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          <select 
            className="border border-gray-300 rounded-lg p-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 text-gray-700 cursor-pointer min-w-[160px]"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPageNumber(1);
            }}
          >
            <option value="ALL">Todos</option>
            <option value="Pending">Pendiente</option>
            <option value="Processing">Procesando</option>
            <option value="Shipped">Enviado</option>
            <option value="Delivered">Entregado</option>
            <option value="Cancelled">Cancelado</option>
          </select>
        </div>
      </div>

      {/* --- LISTA DE ÓRDENES --- */}
      <div className="flex flex-col gap-3 min-h-[200px]">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Cargando...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-gray-200">No se encontraron órdenes.</div>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="transition-all hover:shadow-md border border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    #{order.id.substring(0, 8)}... - Cliente: <span className="font-normal text-gray-600">{order.customerId}</span>
                  </h3>
                  <div className="mt-1">
                    <span className={`text-sm font-medium ${
                      order.status === 'Cancelled' ? 'text-red-500' : 
                      order.status === 'Delivered' ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <Button 
                  onClick={() => toggleDetails(order.id)}
                  className="bg-purple-100 text-purple-700 hover:bg-purple-200 font-semibold px-6 py-2 rounded-lg transition-colors self-end sm:self-center"
                >
                  {expandedOrderId === order.id ? 'Ocultar' : 'Ver'}
                </Button>
              </div>

              {expandedOrderId === order.id && (
                <div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-400 uppercase font-bold mb-1">Información de Envío</p>
                      <p className="text-sm text-gray-700">{order.shippingAddress}</p>
                      <p className="text-xs text-gray-400 mt-2">Fecha: {new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-400 uppercase font-bold mb-2">Items del Pedido</p>
                      <ul className="text-sm space-y-1">
                        {order.orderItems?.map((item, idx) => (
                          <li key={idx} className="flex justify-between text-gray-700">
                            <span>Prod: {item.productId.substring(0,8)}... (x{item.quantity})</span>
                            <span className="font-medium">${item.subtotal}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex justify-end mt-3 border-t border-gray-200 pt-2 text-gray-900 font-bold">
                        Total: ${order.totalAmount}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 bg-purple-50 p-3 rounded-lg">
                    <label className="text-sm font-medium text-purple-900">Actualizar estado:</label>
                    <select 
                      className="border border-purple-200 rounded p-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value="Pending">Pendiente</option>
                      <option value="Processing">Procesando</option>
                      <option value="Shipped">Enviado</option>
                      <option value="Delivered">Entregado</option>
                      <option value="Cancelled">Cancelado</option>
                    </select>
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* --- PAGINACIÓN --- */}
      <div className="flex justify-center items-center mt-3">
        {/* Botón Atras */}
        <button
          disabled={pageNumber === 1}
          onClick={() => setPageNumber(pageNumber - 1)}
          className='bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 rounded-md px-3 py-1.5 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm'
        >
          Atras
        </button>

        {/* Indicador de Página */}
        <span className='mx-4 text-gray-700 font-medium'>
          {pageNumber} 
          {/* Si tu backend devolviera el total, aquí iría " / {totalPages}" */}
        </span>

        {/* Botón Siguiente */}
        <button
          disabled={orders.length < pageSize}
          onClick={() => setPageNumber(pageNumber + 1)}
          className='bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 rounded-md px-3 py-1.5 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm'
        >
          Siguiente
        </button>

        {/* Selector de Tamaño de Página */}
        <select
          value={pageSize}
          onChange={evt => {
            setPageNumber(1);
            setPageSize(Number(evt.target.value));
          }}
          className='ml-4 border border-gray-200 rounded-md p-1.5 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 cursor-pointer'
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>
    </div>
  );
}

export default ListOrdersPage;