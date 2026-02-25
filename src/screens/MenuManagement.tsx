import React, { useState } from "react";
import { colors } from "../common/colors";

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
      image: "https://source.unsplash.com/200x200/?paneer",
      available: true,
    },
    {
      id: 2,
      name: "Veg Biryani",
      description: "Aromatic basmati rice with spices",
      price: 180,
      categoryId: 2,
      image: "https://source.unsplash.com/200x200/?biryani",
      available: false,
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  /* -------------------- FILTER LOGIC -------------------- */

  const filteredDishes = dishes.filter((dish) => {
    const matchesCategory = selectedCategory
      ? dish.categoryId === selectedCategory
      : true;

    const matchesSearch = dish.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  /* -------------------- ACTIONS -------------------- */

  const toggleAvailability = (id: number) => {
    setDishes((prev) =>
      prev.map((dish) =>
        dish.id === id ? { ...dish, available: !dish.available } : dish
      )
    );
  };

  const deleteDish = (id: number) => {
    setDishes((prev) => prev.filter((dish) => dish.id !== id));
  };


  const [isModalOpen, setIsModalOpen] = useState(false);

const [newDish, setNewDish] = useState({
  name: "",
  description: "",
  price: "",
  categoryId: "",
  image: "",
});
  /* -------------------- UI -------------------- */

  return (
    <div
      className="min-h-screen p-8"
      style={{ backgroundColor: colors.background }}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
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

       <button
  onClick={() => setIsModalOpen(true)}
  className="px-5 py-2 rounded-lg text-white font-medium"
  style={{ backgroundColor: colors.primary }}
>
  + Add New Dish
</button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search dishes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg border w-72"
          style={{
            borderColor: colors.border,
          }}
        />

        <div className="flex gap-3">
          <button
            onClick={() => setSelectedCategory(null)}
            className="px-4 py-1 rounded-full text-sm"
            style={{
              backgroundColor: !selectedCategory
                ? colors.primaryLight
                : colors.cardSoft,
              color: !selectedCategory
                ? colors.white
                : colors.textSecondary,
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
      </div>

      {/* DISH GRID */}
      <div className="grid grid-cols-3 gap-6">
        {filteredDishes.map((dish) => (
          <div
            key={dish.id}
            className="rounded-xl p-5"
            style={{
              backgroundColor: colors.card,
              boxShadow: colors.shadow,
            }}
          >
            <img
              src={dish.image}
              alt={dish.name}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />

            <h3
              className="font-semibold text-lg"
              style={{ color: colors.textPrimary }}
            >
              {dish.name}
            </h3>

            <p
              className="text-sm mt-1"
              style={{ color: colors.textMuted }}
            >
              {dish.description}
            </p>

            <div className="flex justify-between items-center mt-4">
              <span
                className="font-semibold"
                style={{ color: colors.primary }}
              >
                ₹{dish.price}
              </span>

              <button
                onClick={() => toggleAvailability(dish.id)}
                className="px-3 py-1 text-xs rounded-full"
                style={{
                  backgroundColor: dish.available
                    ? "#E6F4EA"
                    : "#FCE8E6",
                  color: dish.available
                    ? colors.success
                    : colors.danger,
                }}
              >
                {dish.available ? "Available" : "Out of Stock"}
              </button>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-between mt-4 text-sm">
              <button
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
      className="w-[500px] rounded-xl p-6"
      style={{
        backgroundColor: colors.card,
        boxShadow: colors.shadow,
      }}
    >
      <h2
        className="text-xl font-semibold mb-6"
        style={{ color: colors.textPrimary }}
      >
        Add New Dish
      </h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Dish Name"
          value={newDish.name}
          onChange={(e) =>
            setNewDish({ ...newDish, name: e.target.value })
          }
          className="w-full px-4 py-2 rounded-lg border placeholder-gray-400"
          style={{
            backgroundColor: colors.white,
            color: colors.textPrimary,
            borderColor: colors.border,
          }}
        />

        <textarea
          placeholder="Description"
          value={newDish.description}
          onChange={(e) =>
            setNewDish({ ...newDish, description: e.target.value })
          }
          className="w-full px-4 py-2 rounded-lg border placeholder-gray-400"
          style={{
            backgroundColor: colors.white,
            color: colors.textPrimary,
            borderColor: colors.border,
          }}
        />

        <input
          type="number"
          placeholder="Price"
          value={newDish.price}
          onChange={(e) =>
            setNewDish({ ...newDish, price: e.target.value })
          }
          className="w-full px-4 py-2 rounded-lg border placeholder-gray-400"
          style={{
            backgroundColor: colors.white,
            color: colors.textPrimary,
            borderColor: colors.border,
          }}
        />

        <select
          value={newDish.categoryId}
          onChange={(e) =>
            setNewDish({ ...newDish, categoryId: e.target.value })
          }
          className="w-full px-4 py-2 rounded-lg border"
          style={{
            backgroundColor: colors.white,
            color: colors.textPrimary,
            borderColor: colors.border,
          }}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Image URL"
          value={newDish.image}
          onChange={(e) =>
            setNewDish({ ...newDish, image: e.target.value })
          }
          className="w-full px-4 py-2 rounded-lg border placeholder-gray-400"
          style={{
            backgroundColor: colors.white,
            color: colors.textPrimary,
            borderColor: colors.border,
          }}
        />

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
            onClick={() => {
              if (!newDish.name || !newDish.price || !newDish.categoryId) {
                alert("Please fill required fields");
                return;
              }

              const dishToAdd = {
                id: Date.now(),
                name: newDish.name,
                description: newDish.description,
                price: Number(newDish.price),
                categoryId: Number(newDish.categoryId),
                image:
                  newDish.image ||
                  "https://source.unsplash.com/200x200/?food",
                available: true,
              };

              setDishes([...dishes, dishToAdd]);

              setNewDish({
                name: "",
                description: "",
                price: "",
                categoryId: "",
                image: "",
              });

              setIsModalOpen(false);
            }}
            className="px-4 py-2 text-white rounded-lg"
            style={{ backgroundColor: colors.primary }}
          >
            Save Dish
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
    
  );
};


export default MenuManagement;