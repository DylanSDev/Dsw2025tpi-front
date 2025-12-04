export const updateOrderStatus = async (id, newStatus) =>
{
  try
  {
    const response = await instance.put(`/api/orders/${id}/status`,
    {
      status: newStatus,
    });

    return {data: response.data, error: null};
  } catch (error) {
    return {data: null, error: error.response?.data || error.message};
  }
};