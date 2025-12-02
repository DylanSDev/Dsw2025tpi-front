import Card from '../../shared/components/Card';
import { useEffect, useState } from 'react';
import { getDashboardSummary } from '../service/dashboardSummary';

function Home() {
  const [stats, setStats] = useState({ products: 0, orders: 0 });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () =>
    {
      setLoading(true);

      const { data, error } = await getDashboardSummary();

      if (!error && data)
      {
        setStats({
          products: data.productCount,
          orders: data.orderCount,
        });
      }

      setLoading(false);
    };

    cargarDatos();
  }, []);

  return (
    <div
      className='flex flex-col gap-3 sm:grid sm:grid-cols-2'
    >
      <Card>
        <h3>Productos</h3>
        <p>Cantidad: {loading ? '...' : stats.products}</p>
      </Card>

      <Card>
        <h3>Ordenes</h3>
        <p>Cantidad: {loading ? '...' : stats.orders}</p>
      </Card>
    </div>
  );
};

export default Home;