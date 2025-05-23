import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";
import getImageUrl from "../../Utils/imageUrl";

const ProductList = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);

      const { data } = await createProduct(productData);

      if (data.error) {
        toast.error("Product create failed. Try Again.");
      } else {
        toast.success(`${data.name} is created`);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Product create failed. Try Again.");
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
      setImageUrl(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <div className="md:w-3/4 w-full p-3">
          <div className="text-xl font-bold mb-4">Create Product</div>

          {imageUrl && (
            <div className="text-center">
              <img
                // src={imageUrl}
                src={getImageUrl(imageUrl)}//new11
                alt="product"
                className="block mx-auto max-h-[200px]"
              />
            </div>
          )}

          <div className="mb-3">
            <label className="border text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-6">
              {image ? image.name : "Upload Image"}

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={uploadFileHandler}
                className={!image ? "hidden" : "text-white"}
              />
            </label>
          </div>

          <div className="p-3">
            <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
              <div className="w-full md:w-[calc(50%-1rem)]">
                <label htmlFor="name" className="block mb-1">Name</label>
                <input
                  type="text"
                  className="p-3 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="w-full md:w-[calc(50%-1rem)]">
                <label htmlFor="price" className="block mb-1">Price</label>
                <input
                  type="number"
                  className="p-3 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
              <div className="w-full md:w-[calc(50%-1rem)]">
                <label htmlFor="quantity" className="block mb-1">Quantity</label>
                <input
                  type="number"
                  className="p-3 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="w-full md:w-[calc(50%-1rem)]">
                <label htmlFor="brand" className="block mb-1">Brand</label>
                <input
                  type="text"
                  className="p-3 mb-3 w-full border rounded-lg bg-[#09090a] text-white"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block mb-1">Description</label>
              <textarea
                type="text"
                className="p-3 mb-3 bg-[#101011] border rounded-lg w-full text-white min-h-[120px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
              <div className="w-full md:w-[calc(50%-1rem)]">
                <label htmlFor="stock" className="block mb-1">Count In Stock</label>
                <input
                  type="text"
                  className="p-3 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>

              <div className="w-full md:w-[calc(50%-1rem)]">
                <label htmlFor="category" className="block mb-1">Category</label>
                <select
                  placeholder="Choose Category"
                  className="p-3 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select a category</option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="py-3 px-8 mt-4 rounded-lg text-lg font-bold bg-pink-600 text-white w-full md:w-auto"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;


