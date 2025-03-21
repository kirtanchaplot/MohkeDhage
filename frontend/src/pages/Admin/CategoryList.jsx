import { useState } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";

import { toast } from "react-toastify";
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";
import AdminMenu from "./AdminMenu";
import Loader from "../../components/Loader";

const CategoryList = () => {
  const { data: categories, isLoading } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!name) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await createCategory({ name }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        setName("");
        toast.success(`${result.name} is created.`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Creating category failed, try again.");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!updatingName) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: {
          name: updatingName,
        },
      }).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is updated`);
        setSelectedCategory(null);
        setUpdatingName("");
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      const result = await deleteCategory(selectedCategory._id).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is deleted.`);
        setSelectedCategory(null);
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Category deletion failed. Try again.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <AdminMenu />
      
      <div className="w-full px-4 py-4 md:p-6">
        <div className="border-b pb-3 mb-4">
          <h1 className="text-xl font-bold">Manage Categories</h1>
        </div>
        
        <div className="bg-grey rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-lg font-medium mb-3">Add New Category</h2>
          <CategoryForm
            value={name}
            setValue={setName}
            handleSubmit={handleCreateCategory}
            buttonText="Add Category"
          />
        </div>
        
        <div className="bg-grey rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-medium mb-3">Existing Categories</h2>
          
          {isLoading ? (
            <div className="flex justify-center my-4">
              <Loader />
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories?.map((category) => (
                <button
                  key={category._id}
                  className="bg-white border border-pink-500 text-pink-500 py-2 px-4 rounded-md text-sm hover:bg-pink-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 transition-colors"
                  onClick={() => {
                    setModalVisible(true);
                    setSelectedCategory(category);
                    setUpdatingName(category.name);
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
          
          {categories?.length === 0 && !isLoading && (
            <p className="text-gray-500 text-center py-4">No categories found. Add your first category above.</p>
          )}
        </div>

        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <div className="p-1">
            <h2 className="text-lg font-medium mb-4">Update Category</h2>
            <CategoryForm
              value={updatingName}
              setValue={(value) => setUpdatingName(value)}
              handleSubmit={handleUpdateCategory}
              buttonText="Update"
              handleDelete={handleDeleteCategory}
            />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default CategoryList;









// import { useState } from "react";
// import {
//   useCreateCategoryMutation,
//   useUpdateCategoryMutation,
//   useDeleteCategoryMutation,
//   useFetchCategoriesQuery,
// } from "../../redux/api/categoryApiSlice";

// import { toast } from "react-toastify";
// import CategoryForm from "../../components/CategoryForm";
// import Modal from "../../components/Modal";
// import AdminMenu from "./AdminMenu";

// const CategoryList = () => {
//   const { data: categories } = useFetchCategoriesQuery();
//   const [name, setName] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [updatingName, setUpdatingName] = useState("");
//   const [modalVisible, setModalVisible] = useState(false);

//   const [createCategory] = useCreateCategoryMutation();
//   const [updateCategory] = useUpdateCategoryMutation();
//   const [deleteCategory] = useDeleteCategoryMutation();

//   const handleCreateCategory = async (e) => {
//     e.preventDefault();

//     if (!name) {
//       toast.error("Category name is required");
//       return;
//     }

//     try {
//       const result = await createCategory({ name }).unwrap();
//       if (result.error) {
//         toast.error(result.error);
//       } else {
//         setName("");
//         toast.success(`${result.name} is created.`);
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Creating category failed, try again.");
//     }
//   };

//   const handleUpdateCategory = async (e) => {
//     e.preventDefault();

//     if (!updatingName) {
//       toast.error("Category name is required");
//       return;
//     }

//     try {
//       const result = await updateCategory({
//         categoryId: selectedCategory._id,
//         updatedCategory: {
//           name: updatingName,
//         },
//       }).unwrap();

//       if (result.error) {
//         toast.error(result.error);
//       } else {
//         toast.success(`${result.name} is updated`);
//         setSelectedCategory(null);
//         setUpdatingName("");
//         setModalVisible(false);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleDeleteCategory = async () => {
//     try {
//       const result = await deleteCategory(selectedCategory._id).unwrap();

//       if (result.error) {
//         toast.error(result.error);
//       } else {
//         toast.success(`${result.name} is deleted.`);
//         setSelectedCategory(null);
//         setModalVisible(false);
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Category delection failed. Tray again.");
//     }
//   };

//   return (
//     <div className="ml-[10rem] flex flex-col md:flex-row">
//       <AdminMenu />
//       <div className="md:w-3/4 p-3">
//         <div className="h-12">Manage Categories</div>
//         <CategoryForm
//           value={name}
//           setValue={setName}
//           handleSubmit={handleCreateCategory}
//         />
//         <br />
//         <hr />

//         <div className="flex flex-wrap">
//           {categories?.map((category) => (
//             <div key={category._id}>
//               <button
//                 className="bg-white border border-pink-500 text-pink-500 py-2 px-4 rounded-lg m-3 hover:bg-pink-500 hover:text-white focus:outline-none foucs:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
//                 onClick={() => {
//                   {
//                     setModalVisible(true);
//                     setSelectedCategory(category);
//                     setUpdatingName(category.name);
//                   }
//                 }}
//               >
//                 {category.name}
//               </button>
//             </div>
//           ))}
//         </div>

//         <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
//           <CategoryForm
//             value={updatingName}
//             setValue={(value) => setUpdatingName(value)}
//             handleSubmit={handleUpdateCategory}
//             buttonText="Update"
//             handleDelete={handleDeleteCategory}
//           />
//         </Modal>
//       </div>
//     </div>
//   );
// };

// export default CategoryList;