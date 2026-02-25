import React, { useState } from "react";
import { colors } from "../common/Colors";

type Category = {
  id: number;
  name: string;
};

type Dish = {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  image: string;
  available: boolean;
};

type DishForm = {
  name: string;
  description: string;
  price: number | "";
  categoryId: number | "";
  image: string;
};

const defaultImage = "/foodimage.jpg";

const MenuManagement: React.FC = () => {
  /* -------------------- STATES -------------------- */

  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Starters" },
    { id: 2, name: "Main Course" },
    { id: 3, name: "Beverages" },
  ]);

  const [dishes, setDishes] = useState<Dish[]>([
    {
      id: 1,
      name: "Paneer Tikka",
      description: "Delicious grilled paneer cubes",
      price: 250,
      categoryId: 1,
      image: defaultImage,
      available: true,
    },
    {
      id: 2,
      name: "Veg Biryani",
      description: "Aromatic basmati rice with spices",
      price: 180,
      categoryId: 2,
      image: defaultImage,
      available: false,
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState("");

  const [editingDishId, setEditingDishId] = useState<number | null>(null);

  /* -------------------- FILTER LOGIC -------------------- */

  const filteredDishes = React.useMemo(() => {
    return dishes.filter((dish) => {
      const matchesCategory = selectedCategory
        ? dish.categoryId === selectedCategory
        : true;

      const matchesSearch = dish.name
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [dishes, selectedCategory, search]);

  /* -------------------- ACTIONS -------------------- */

  const toggleAvailability = (id: number) => {
    setDishes((prev) =>
      prev.map((dish) =>
        dish.id === id ? { ...dish, available: !dish.available } : dish,
      ),
    );
  };

  const deleteDish = (id: number) => {
    setDishes((prev) => prev.filter((dish) => dish.id !== id));
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newDish, setNewDish] = useState<DishForm>({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    image: "",
  });

  const handleSaveDish = () => {
    if (
      newDish.name.trim() === "" ||
      newDish.price === "" ||
      newDish.categoryId === ""
    ) {
      return;
    }

    if (editingDishId) {
      // 🔁 UPDATE EXISTING DISH
      setDishes((prev) =>
        prev.map((dish) =>
          dish.id === editingDishId
            ? {
                ...dish,
                name: newDish.name,
                description: newDish.description,
                price: Number(newDish.price),
                categoryId: Number(newDish.categoryId),
                image: newDish.image || defaultImage,
              }
            : dish,
        ),
      );
    } else {
      // ➕ ADD NEW DISH
      const dishToAdd: Dish = {
        id: Date.now(),
        name: newDish.name,
        description: newDish.description,
        price: Number(newDish.price),
        categoryId: Number(newDish.categoryId),
        image: newDish.image || defaultImage,
        available: true,
      };

      setDishes((prev) => [...prev, dishToAdd]);
    }

    // Reset form
    setNewDish({
      name: "",
      description: "",
      price: "",
      categoryId: "",
      image: "",
    });

    setEditingDishId(null);
    setIsModalOpen(false);
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      setNewDish((prev) => ({
        ...prev,
        image: reader.result as string,
      }));
    };

    reader.readAsDataURL(file);
  };

  // Add Category:
  const handleAddCategory = () => {
    if (newCategoryName.trim() === "") {
      setCategoryError("Category name is required.");
      return;
    }

    const alreadyExists = categories.some(
      (cat) => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase(),
    );

    if (alreadyExists) {
      setCategoryError("Category already exists.");
      return;
    }

    const newCategory: Category = {
      id: Date.now(),
      name: newCategoryName.trim(),
    };

    setCategories((prev) => [...prev, newCategory]);

    setNewCategoryName("");
    setCategoryError("");
    setIsCategoryModalOpen(false);
  };

  const handleDeleteCategory = (categoryId: number) => {
    // Check if category has dishes
    const hasDishes = dishes.some((dish) => dish.categoryId === categoryId);

    if (hasDishes) {
      alert("Cannot delete category with existing dishes.");
      return;
    }

    setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));

    // Reset filter if deleted category was selected
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    }
  };
  /* -------------------- UI -------------------- */

  return (
    <div
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6"
      style={{ backgroundColor: colors.background }}
    >
      {/* HEADER */}
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        {/* LEFT SIDE */}
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: colors.textPrimary }}
          >
            Menu Management
          </h1>
          <p style={{ color: colors.textSecondary }}>
            Manage dishes, categories & availability
          </p>
        </div>

        {/* RIGHT SIDE BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="w-full sm:w-auto px-5 py-2 rounded-3xl border text-white font-medium"
            style={{
              borderColor: colors.primary,
              color: colors.primary,
            }}
          >
            + Add Category
          </button>

          <button
            onClick={() => {
              setEditingDishId(null);
              setNewDish({
                name: "",
                description: "",
                price: "",
                categoryId: "",
                image: "",
              });
              setIsModalOpen(true);
            }}
            className="w-full sm:w-auto px-5 py-2 rounded-3xl border text-white font-medium"
            style={{ backgroundColor: colors.primary }}
          >
            + Add New Dish
          </button>
        </div>
      </div>

      {/* SEARCH + FILTER */}
      {/* SEARCH */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search dishes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-3xl border w-full sm:w-80"
          style={{ borderColor: colors.neutral[500] }}
        />
      </div>

      {/* CATEGORY FILTERS */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setSelectedCategory(null)}
          className="px-4 py-1 rounded-full text-sm"
          style={{
            backgroundColor: !selectedCategory
              ? colors.primaryLight
              : colors.cardSoft,
            color: !selectedCategory ? colors.white : colors.textSecondary,
          }}
        >
          All
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className="px-4 py-1 rounded-full text-sm"
            style={{
              backgroundColor:
                selectedCategory === cat.id
                  ? colors.primaryLight
                  : colors.cardSoft,
              color:
                selectedCategory === cat.id
                  ? colors.white
                  : colors.textSecondary,
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {selectedCategory && (
        <div className="flex justify-end mb-6">
          <button
            onClick={() => handleDeleteCategory(selectedCategory)}
            className="px-4 py-1 rounded-3xl text-sm border"
            style={{
              borderColor: colors.danger,
              color: colors.danger,
            }}
          >
            Delete Category
          </button>
        </div>
      )}

      {/* DISH GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {filteredDishes.map((dish) => (
          <div
            key={dish.id}
            className="rounded-xl p-5 transition hover:shadow-lg"
            style={{
              backgroundColor: colors.card,
              boxShadow: colors.shadow,
            }}
          >
            <img
              src={dish.image}
              alt={dish.name}
              className="w-full aspect-[4/3] object-cover rounded-lg mb-4"
            />

            <h3
              className="font-semibold text-lg"
              style={{ color: colors.textPrimary }}
            >
              {dish.name}
            </h3>

            <p className="text-sm mt-1" style={{ color: colors.textMuted }}>
              {dish.description}
            </p>

            <div className="flex justify-between items-center mt-4">
              <span className="font-semibold" style={{ color: colors.primary }}>
                ₹{dish.price}
              </span>

              <button
                onClick={() => toggleAvailability(dish.id)}
                className="px-3 py-1 text-xs rounded-full"
                style={{
                  backgroundColor: dish.available ? "#E6F4EA" : "#FCE8E6",
                  color: dish.available ? colors.success : colors.danger,
                }}
              >
                {dish.available ? "Available" : "Unavailable"}
              </button>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-between mt-4 text-sm">
              <button
                onClick={() => {
                  const dishToEdit = dishes.find((d) => d.id === dish.id);
                  if (!dishToEdit) return;

                  setNewDish({
                    name: dishToEdit.name,
                    description: dishToEdit.description,
                    price: dishToEdit.price,
                    categoryId: dishToEdit.categoryId,
                    image: dishToEdit.image,
                  });

                  setEditingDishId(dishToEdit.id);
                  setIsModalOpen(true);
                }}
                style={{ color: colors.primary }}
              >
                Edit
              </button>

              <button
                onClick={() => deleteDish(dish.id)}
                style={{ color: colors.danger }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDishes.length === 0 && (
        <div
          className="mt-10 text-center py-10 rounded-xl"
          style={{
            backgroundColor: colors.cardSoft,
            color: colors.textMuted,
          }}
        >
          No dishes found.
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div
            className="w-full max-w-lg mx-4 sm:mx-auto rounded-xl p-6"
            style={{
              backgroundColor: colors.card,
              boxShadow: colors.shadow,
            }}
          >
            <h2
              className="text-xl font-semibold mb-6"
              style={{ color: colors.textPrimary }}
            >
              {editingDishId ? "Update Dish" : "Add New Dish"}
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Dish Name"
                value={newDish.name}
                onChange={(e) =>
                  setNewDish({ ...newDish, name: e.target.value })
                }
                className="w-full px-4 py-2 rounded-3xl border placeholder-gray-400"
                style={{
                  backgroundColor: colors.white,
                  color: colors.textPrimary,
                  borderColor: colors.neutral[700],
                }}
              />

              <textarea
                placeholder="Description"
                value={newDish.description}
                onChange={(e) =>
                  setNewDish({ ...newDish, description: e.target.value })
                }
                className="w-full px-4 py-2 rounded-3xl border placeholder-gray-400"
                style={{
                  backgroundColor: colors.white,
                  color: colors.textPrimary,
                  borderColor: colors.neutral[700],
                }}
              />

              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Price"
                value={newDish.price}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setNewDish({
                    ...newDish,
                    price: value === "" ? "" : Number(value),
                  });
                }}
                className="w-full px-4 py-2 rounded-3xl border"
                style={{
                  backgroundColor: colors.white,
                  color: colors.textPrimary,
                  borderColor: colors.neutral[700],
                }}
              />
              <select
                value={newDish.categoryId}
                onChange={(e) =>
                  setNewDish({ ...newDish, categoryId: e.target.value })
                }
                className="w-full px-4 py-2 rounded-3xl border"
                style={{
                  backgroundColor: colors.white,
                  color: colors.textPrimary,
                  borderColor: colors.neutral[700],
                }}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <div>
                <label
                  className="block mt-2 mb-2 text-[20px] font-medium"
                  style={{ color: colors.textSecondary }}
                >
                  Upload Image
                </label>

                <div
                  className="border-2 border-dashed p-6 text-center rounded-3xl cursor-pointer hover:bg-gray-300 transition"
                  style={{ borderColor: colors.neutral[400] }}
                  onClick={() =>
                    document.getElementById("dishImageInput")?.click()
                  }
                >
                  <p style={{ color: colors.textSecondary }}>
                    Click to upload image
                  </p>

                  <input
                    id="dishImageInput"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleImageUpload(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                </div>
              </div>

              {newDish.image && (
                <img
                  src={newDish.image}
                  alt="preview"
                  className="w-full h-40 object-cover rounded-lg"
                />
              )}

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border"
                  style={{
                    borderColor: colors.border,
                    color: colors.textSecondary,
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={handleSaveDish}
                  className="px-4 py-2 text-white rounded-3xl"
                  style={{ backgroundColor: colors.primary }}
                >
                  {editingDishId ? "Update Dish" : "Save Dish"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div
            className="w-full max-w-md mx-4 sm:mx-auto rounded-xl p-6"
            style={{
              backgroundColor: colors.card,
              boxShadow: colors.shadow,
            }}
          >
            <h2
              className="text-xl font-semibold mb-6"
              style={{ color: colors.textPrimary }}
            >
              Add Category
            </h2>

            <input
              type="text"
              placeholder="Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border"
              style={{
                backgroundColor: colors.white,
                color: colors.textPrimary,
                borderColor: colors.border,
              }}
            />

            {categoryError && (
              <p className="text-sm mt-2" style={{ color: colors.danger }}>
                {categoryError}
              </p>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-4 py-2 rounded-lg border"
                style={{
                  borderColor: colors.border,
                  color: colors.textSecondary,
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleAddCategory}
                className="px-4 py-2 text-white rounded-lg"
                style={{ backgroundColor: colors.primary }}
              >
                Save Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
