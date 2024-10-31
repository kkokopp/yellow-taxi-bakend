// controllers/dataController.js
import axios from 'axios';

// All data from API
export const getAllData = async (req, res) => {
  try {
    const response = await axios.get('https://data.cityofnewyork.us/resource/gkne-dk5s.json');
    res.status(200).json({
      success: true,
      message: "Data berhasil ditemukan!",
      data: response.data
    });
  } catch (error) {
    res.status(500).json({
      success: "error",
      message: "Data gagal dimuat!",
    });
  }
};

// Filter trips
export const getDataByFiltered = async(req, res) => {
  const { distanceLessThan, distanceGreaterThan, amountLessThan, amountGreaterThan, pickupTime, paymentMethod } = req.query;
  
  try{
    const response = await axios.get('https://data.cityofnewyork.us/resource/gkne-dk5s.json');

    let filteredTrips = response.data;

    // Filter trip_distance dengan batas minimum dan maksimum
    if (distanceLessThan || distanceGreaterThan) {
        filteredTrips = filteredTrips.filter(trip => {
            const distance = trip.trip_distance;
            return (
                (!distanceLessThan || distance < parseFloat(distanceLessThan)) &&
                (!distanceGreaterThan || distance > parseFloat(distanceGreaterThan))
            );
        });
    }

    // Filter total_amount dengan batas minimum dan maksimum
    if (amountLessThan || amountGreaterThan) {
        filteredTrips = filteredTrips.filter(trip => {
            const totalAmount = trip.total_amount;
            const lessThan = amountLessThan ? parseFloat(amountLessThan) : null;
            const greaterThan = amountGreaterThan ? parseFloat(amountGreaterThan) : null;
            return (
                (!amountLessThan || totalAmount < lessThan) &&
                (!amountGreaterThan || totalAmount > greaterThan)
            );
        });
    }

    // Filter pickup_datetime
    if (pickupTime) {
      filteredTrips = filteredTrips.filter(trip => {
            const targetDate = new Date(pickupTime);
            const pickupDate = new Date(trip.pickup_datetime);
            const targetDateTime = targetDate.toISOString().split('T')[0];
            const pickupDateTime = pickupDate.toISOString().split('T')[0];
            return pickupDateTime === targetDateTime;
        });
    }

    // Filter payment_type
    if (paymentMethod) {
        filteredTrips = filteredTrips.filter(trip => trip.payment_type === paymentMethod);
    }

    // Respon
    if (filteredTrips && filteredTrips.length > 0) {
      res.status(200).json({
        status: "success",
        message: "Data berhasil ditemukan",
        data: filteredTrips
      });
    } else if (filteredTrips && filteredTrips.length === 0) {
      res.status(200).json({
        status: "success",
        message: "Data tidak ditemukan",
        data: [] // Mengirimkan array kosong untuk menunjukkan tidak ada data.
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Kesalahan permintaan",
      });
    }
  }catch(error){
    res.status(500).json({
      status : "error",
      message: "Kesalahan jaringan",
    });
  }
};


export const getAllFilterData = async(req, res) => {
  try{
      const response = await axios.get('https://data.cityofnewyork.us/resource/gkne-dk5s.json');

      const rangeTotalAmount = [20, 40, 80, 100];
      const rangeTripDistance = [1, 3, 5, 8 , 10];
      const paymentType = [...new Set(response.data.map(item => item.payment_type))];
      const dataAll = {
          range_total_amount: rangeTotalAmount,
          range_trip_distance: rangeTripDistance,
          all_payment_type: paymentType
      }

      if(dataAll != null){
          res.status(200).json({
              status: "success",
              message: "Data tarif ditemukan",
              data: dataAll
          });
      }else{
          res.status(404).json({
              status: "error",
              message: "Kesalahan saat mengambil data",
          })
      }
  }catch(error){
      res.status(500).json({
          status : "error",
          message: "Kesalahan jaringan",
      });
  }
};


