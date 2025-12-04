import { useEffect, useState } from 'react';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import { listOrders } from '../services/listServices';
import { updateOrderStatus } from '../services/update';

function ListOrdersPage() {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [pageNumber, setPageNumber] = useState(1);
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
  }, [statusFilter, pageNumber, pageSize]);

  const handleStatusChange = async (id, newStatus) => {
     const { error } = await updateOrderStatus(id, newStatus);

     if (error) {
       console.error("Error actualizando estado:", error);
       alert("No se pudo actualizar el estado.");
     } else {
       await fetchOrders(); 
     }
  };

  const toggleDetails = (id) =>
  {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  return (
    <div>
      <Card className="mb-4">
        <div className='flex flex-col md:flex-row justify-between items-center gap-4 mb-2'>
          <h1 className='text-3xl font-bold text-gray-800'>Gestión de Órdenes</h1>
          
          <div className='flex flex-col sm:flex-row gap-4 w-full md:w-auto'>
            <div className='flex items-center gap-3 w-full'>
              <input 
                type="text" 
                placeholder='Buscar' 
                className='text-[1.3rem] w-full border border-gray-200 rounded-md p-1.5 hover:shadow outline-none' 
              />
              <Button className='h-11 w-11 flex justify-center items-center'>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                  <g id="SVGRepo_iconCarrier"> 
                    <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> 
                  </g>
                </svg>
              </Button>
            </div>

            <select 
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPageNumber(1);
              }}
              className='text-[1.3rem] border border-gray-200 rounded-md p-1.5 hover:shadow outline-none min-w-[150px]'
            >
              <option value="ALL">Todos</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </Card>

      <div className='flex flex-col gap-4'>
        {loading ? (
          <span className="text-gray-500 ml-2">Buscando datos...</span>
        ) : orders.length === 0 ? (
          <Card>No se encontraron órdenes.</Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="transition-all hover:shadow-md">
              <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center'>
                
                <div className="mb-2 sm:mb-0">
                  <h1 className='text-xl font-bold text-gray-800'>
                    #{order.id.substring(0, 8)}... - Cliente: <span className="font-normal text-gray-600">{order.customerId}</span>
                  </h1>
                  <p className='text-base text-gray-500 mt-1'>
                    {order.status}
                  </p>
                </div>

                <Button 
                  onClick={() => toggleDetails(order.id)}
                  className="bg-purple-200 text-black hover:bg-purple-300 px-6"
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
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      <div className='flex justify-center items-center mt-6 mb-4'>
        <button
          disabled={pageNumber === 1}
          onClick={() => setPageNumber(pageNumber - 1)}
          className='bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md px-3 py-1.5 disabled:bg-gray-100 disabled:text-gray-400 transition'
        >
          Atras
        </button>
        
        <span className='mx-4 text-lg'>{pageNumber}</span>
        
        <button
          disabled={orders.length < pageSize}
          onClick={() => setPageNumber(pageNumber + 1)}
          className='bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md px-3 py-1.5 disabled:bg-gray-100 disabled:text-gray-400 transition'
        >
          Siguiente
        </button>

        <select
          value={pageSize}
          onChange={evt => {
            setPageNumber(1);
            setPageSize(Number(evt.target.value));
          }}
          className='ml-3 border border-gray-200 rounded p-1'
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