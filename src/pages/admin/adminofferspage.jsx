import { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import api from '../../utils/api';
import Spinner from '../../components/Spinner';

export default function adminofferspage() {

  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');


  const fetchOffers = async () => {
    try {
      const res = await api.get('/offers/pending');

      setOffers(res.data.data || []);

    } catch (err) {
      console.error('[adminofferspage] Fetch Error:', err);

      setError(
        err.response?.data?.message ||
        'Failed to fetch pending offers'
      );

    } finally {
      setIsLoading(false);
    }
    console.log(res.data)
  };


  useEffect(() => {
    fetchOffers();
  }, []);



  const handleApprove = async (id) => {
    try {

      await api.patch(`/offers/${id}/approve`);

      setOffers(prev =>
        prev.filter(offer => offer.id !== id)
      );

    } catch (err) {

      console.error('[adminofferspage] Approve Error:', err);
      alert('Failed to approve offer');

    }
  };



  const handleReject = async (id) => {
    try {

      await api.patch(`/offers/${id}/reject`);

      setOffers(prev =>
        prev.filter(offer => offer.id !== id)
      );

    } catch (err) {

      console.error('[adminofferspage] Reject Error:', err);
      alert('Failed to reject offer');

    }
  };



  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      </AdminLayout>
    );
  }



  return (
    <AdminLayout>

      <div className="space-y-6">


        {/* KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <Card className="p-5 border-zinc-200 dark:border-zinc-800">

            <h3 className="text-xs font-bold uppercase text-zinc-500">
              Pending Offers
            </h3>

            <p className="text-3xl font-black mt-2">
              {offers.length}
            </p>

          </Card>

        </div>



        {error && (
          <div className="p-4 rounded-xl bg-red-50 text-red-600">
            {error}
          </div>
        )}



        {/* Offers Table */}
        <Card className="overflow-hidden border-zinc-200 dark:border-zinc-800">


          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">

            <h2 className="text-lg font-bold">
              Offer Management
            </h2>

          </div>



          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">


              <thead>

                <tr className="bg-zinc-50 dark:bg-zinc-900 text-xs uppercase text-zinc-500">

                  <th className="px-6 py-4 text-left">
                    Image
                  </th>


                  <th className="px-6 py-4 text-left">
                    Offer Details
                  </th>


                  <th className="px-6 py-4 text-left">
                    Vendor
                  </th>


                  <th className="px-6 py-4 text-left">
                    Status
                  </th>


                  <th className="px-6 py-4 text-right">
                    Actions
                  </th>

                </tr>

              </thead>



              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">


                {offers.length === 0 ? (

                  <tr>

                    <td
                      colSpan="5"
                      className="px-6 py-20 text-center text-zinc-500"
                    >

                      No pending offers found.

                    </td>

                  </tr>


                ) : (


                  offers.map((offer) => (

                    <tr key={offer.id}>


                      <td className="px-6 py-4">

                        {offer.image ? (

                          <img
                            src={offer.image}
                            alt="Offer"
                            className="w-20 h-20 rounded-xl object-cover"
                          />

                        ) : (

                          <div className="w-20 h-20 rounded-xl bg-zinc-100 flex items-center justify-center text-xs text-zinc-400">
                            No Image
                          </div>

                        )}

                      </td>




                      <td className="px-6 py-4">

                        <p className="font-bold">
                          {offer.title || offer.name}
                        </p>


                        <p className="text-sm text-zinc-500 mt-1">
                          {offer.description}
                        </p>


                      </td>




                      <td className="px-6 py-4">

                        {offer.vendor?.outletName ||
                         offer.vendor?.name ||
                         'Unknown'}

                      </td>




                      <td className="px-6 py-4">

                        <Badge>
                          Pending
                        </Badge>

                      </td>




                      <td className="px-6 py-4 text-right">

                        <div className="flex justify-end gap-3">


                          <Button
                            onClick={() => handleApprove(offer.id)}
                          >
                            Approve
                          </Button>



                          <Button
                            onClick={() => handleReject(offer.id)}
                          >
                            Reject
                          </Button>


                        </div>

                      </td>



                    </tr>

                  ))

                )}


              </tbody>


            </table>

          </div>


        </Card>


      </div>


    </AdminLayout>
  );
}
