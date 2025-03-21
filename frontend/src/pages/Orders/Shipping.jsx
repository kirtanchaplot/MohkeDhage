import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
 
  const [paymentMethod, setPaymentMethod] = useState("Razorpay");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  // Payment
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  return (
    <div className="container mx-auto px-4 py-6">
      <ProgressSteps step1 step2 />
      <div className="flex justify-center items-center mt-6 md:mt-12">
        <div className="w-full max-w-lg bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-semibold mb-6 text-center text-pink-400">Shipping Details</h1>
          
          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1 text-sm">Address</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors"
                placeholder="Enter address"
                value={address}
                required
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-1 text-sm">City</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors"
                  placeholder="Enter city"
                  value={city}
                  required
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-1 text-sm">Postal Code</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors"
                  placeholder="Enter postal code"
                  value={postalCode}
                  required
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1 text-sm">Country</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors"
                placeholder="Enter country"
                value={country}
                required
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
            
            <div className="mt-6">
              <label className="block text-gray-300 mb-2 text-sm">Payment Method</label>
              <div className="bg-gray-700 p-3 rounded-lg border border-gray-600">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    className="form-radio text-pink-500 h-5 w-5"
                    name="paymentMethod"
                    value="Razorpay"
                    checked={paymentMethod === "Razorpay"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="ml-3">Razorpay or Credit Card</span>
                </label>
              </div>
            </div>

            <button
              className="bg-pink-500 text-white py-3 px-4 rounded-full text-lg w-full mt-6 hover:bg-pink-600 transition-colors font-medium shadow-md"
              type="submit"
            >
              Continue to Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Shipping;












