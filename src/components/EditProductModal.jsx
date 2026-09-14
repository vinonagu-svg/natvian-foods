import { useState } from "react";

import {
  doc,
  updateDoc,
} from "firebase/firestore";

import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

import { db } from "../firebase";

export default function EditProductModal({
  product,
  closeModal,
  refreshProducts,
  categories = [],
  subcategories = [],
}) {
  /* =========================================================
     CHECK COMBO
  ========================================================= */
  const isCombo =
    product.isCombo === true ||
    product.type === "combo" ||
    product.productType === "combo";

  /* =========================================================
     INITIAL FORM
  ========================================================= */

  const [form, setForm] = useState({
    ...product,

    name: product.name || "",
    tamilName: product.tamilName || "",

    category: product.category || "",
    categoryId: product.categoryId || "",

    subcategory: product.subcategory || "",
    subcategoryId: product.subcategoryId || "",

    description: product.description || "",

    benefits: Array.isArray(product.benefits)
      ? product.benefits
      : product.benefits
      ? String(product.benefits)
          .split("\n")
          .filter(Boolean)
      : [],

    ingredients: product.ingredients || "",
    usage: product.usage || "",
    shelfLife: product.shelfLife || "",

    images:
      Array.isArray(product.images)
        ? product.images
        : [],

    variants:
      Array.isArray(product.variants)
        ? product.variants
        : [],

    /* COMBO */
    isCombo: isCombo,

    mrp: product.mrp ?? "",

    comboPrice:
      product.comboPrice ??
      product.price ??
      "",

    comboItems:
      Array.isArray(product.comboItems)
        ? product.comboItems
        : [
            {
              name: "",
              weight: "",
            },
          ],
  });

  /* =========================================================
     IMAGE GALLERY STATE
  ========================================================= */

  const [selectedImage, setSelectedImage] =
    useState(
      product.images?.[0] || ""
    );

  const [showGallery, setShowGallery] =
    useState(false);

  const [zoom, setZoom] = useState(1);

  /* =========================================================
     BASIC FIELD CHANGE
  ========================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================================
     CATEGORY CHANGE
  ========================================================= */

  const handleCategoryChange = (e) => {
    const categoryName = e.target.value;

    const category = categories.find(
      (cat) =>
        cat.name === categoryName ||
        cat.id === categoryName
    );

    setForm((prev) => ({
      ...prev,

      category:
        category?.name || categoryName,

      categoryId:
        category?.id || "",

      subcategory: "",
      subcategoryId: "",
    }));
  };

  /* =========================================================
     SUBCATEGORY CHANGE
  ========================================================= */

  const handleSubcategoryChange = (e) => {
    const subcategoryId = e.target.value;

    const subcategory =
      subcategories.find(
        (sub) =>
          sub.id === subcategoryId
      );

    setForm((prev) => ({
      ...prev,

      subcategory:
        subcategory?.name || "",

      subcategoryId:
        subcategoryId,
    }));
  };

  /* =========================================================
     FILTER SUBCATEGORIES
  ========================================================= */

  const filteredSubcategories =
    subcategories.filter((sub) => {
      return (
        sub.category === form.category ||
        sub.categoryId === form.categoryId
      );
    });

  /* =========================================================
     IMAGE CHANGE
  ========================================================= */

  const handleImageChange = (
    index,
    value
  ) => {
    const updatedImages = [
      ...form.images,
    ];

    updatedImages[index] = value;

    setForm((prev) => ({
      ...prev,
      images: updatedImages,
    }));

    if (
      selectedImage ===
      form.images[index]
    ) {
      setSelectedImage(value);
    }
  };

  /* =========================================================
     ADD IMAGE
  ========================================================= */

  const addImageField = () => {
    setForm((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        "",
      ],
    }));
  };

  /* =========================================================
     REMOVE IMAGE
  ========================================================= */

  const removeImage = (index) => {
    const updatedImages =
      form.images.filter(
        (_, i) => i !== index
      );

    setForm((prev) => ({
      ...prev,
      images: updatedImages,
    }));

    if (
      selectedImage ===
      form.images[index]
    ) {
      setSelectedImage(
        updatedImages[0] || ""
      );
    }
  };

  /* =========================================================
     VARIANT CHANGE
  ========================================================= */

  const handleVariantChange = (
    index,
    field,
    value
  ) => {
    const updatedVariants = [
      ...form.variants,
    ];

    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value,
    };

    setForm((prev) => ({
      ...prev,
      variants:
        updatedVariants,
    }));
  };

  /* =========================================================
     ADD VARIANT
  ========================================================= */

  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          weight: "",
          price: "",
          stock: "",
        },
      ],
    }));
  };

  /* =========================================================
     REMOVE VARIANT
  ========================================================= */

  const removeVariant = (index) => {
    setForm((prev) => ({
      ...prev,
      variants:
        prev.variants.filter(
          (_, i) => i !== index
        ),
    }));
  };

  /* =========================================================
     COMBO ITEM CHANGE
  ========================================================= */

  const handleComboItemChange = (
    index,
    field,
    value
  ) => {
    const updatedItems = [
      ...form.comboItems,
    ];

    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };

    setForm((prev) => ({
      ...prev,
      comboItems:
        updatedItems,
    }));
  };

  /* =========================================================
     ADD COMBO ITEM
  ========================================================= */

  const addComboItem = () => {
    setForm((prev) => ({
      ...prev,
      comboItems: [
        ...prev.comboItems,
        {
          name: "",
          weight: "",
        },
      ],
    }));
  };

  /* =========================================================
     REMOVE COMBO ITEM
  ========================================================= */

  const removeComboItem = (index) => {
    setForm((prev) => ({
      ...prev,
      comboItems:
        prev.comboItems.filter(
          (_, i) => i !== index
        ),
    }));
  };

  /* =========================================================
     NEXT IMAGE
  ========================================================= */

  const nextImage = () => {
    if (form.images.length <= 1)
      return;

    const currentIndex =
      form.images.indexOf(
        selectedImage
      );

    const nextIndex =
      (currentIndex + 1) %
      form.images.length;

    setSelectedImage(
      form.images[nextIndex]
    );

    setZoom(1);
  };

  /* =========================================================
     PREVIOUS IMAGE
  ========================================================= */

  const prevImage = () => {
    if (form.images.length <= 1)
      return;

    const currentIndex =
      form.images.indexOf(
        selectedImage
      );

    const prevIndex =
      (currentIndex - 1 +
        form.images.length) %
      form.images.length;

    setSelectedImage(
      form.images[prevIndex]
    );

    setZoom(1);
  };

  /* =========================================================
     UPDATE
  ========================================================= */

  const handleUpdate = async () => {
    try {
      /* -----------------------------------------
         CLEAN IMAGES
      ----------------------------------------- */

      const cleanImages =
        form.images
          .map((img) =>
            String(img).trim()
          )
          .filter(Boolean);

      /* -----------------------------------------
         CLEAN BENEFITS
      ----------------------------------------- */

      const cleanBenefits =
        Array.isArray(form.benefits)
          ? form.benefits
              .map((item) =>
                String(item).trim()
              )
              .filter(Boolean)
          : String(
              form.benefits || ""
            )
              .split("\n")
              .map((item) =>
                item.trim()
              )
              .filter(Boolean);

      /* -----------------------------------------
         CLEAN VARIANTS
      ----------------------------------------- */

      const cleanVariants =
        form.variants
          .filter(
            (variant) =>
              variant.weight ||
              variant.price ||
              variant.stock
          )
          .map((variant) => ({
            weight:
              variant.weight || "",

            price:
              Number(
                variant.price
              ) || 0,

            stock:
              Number(
                variant.stock
              ) || 0,
          }));

      /* -----------------------------------------
         CLEAN COMBO ITEMS
      ----------------------------------------- */

      const cleanComboItems =
        form.comboItems
          .filter(
            (item) =>
              item.name &&
              item.name.trim()
          )
          .map((item) => ({
            name:
              item.name.trim(),

            weight:
              item.weight
                ? item.weight.trim()
                : "",
          }));

      /* -----------------------------------------
         VALIDATE COMBO
      ----------------------------------------- */

      if (form.isCombo) {
        if (!form.comboPrice) {
          alert(
            "Please enter Combo Price"
          );
          return;
        }

        if (
          cleanComboItems.length ===
          0
        ) {
          alert(
            "Please add at least one Combo Item"
          );
          return;
        }
      }

      /* -----------------------------------------
         PRODUCT REF
      ----------------------------------------- */

      const productRef = doc(
        db,
        "products",
        product.id
      );

      /* -----------------------------------------
         UPDATE DATA
      ----------------------------------------- */

      await updateDoc(
        productRef,
        {
          name:
            form.name.trim(),

          tamilName:
            form.tamilName.trim(),

          category:
            form.category || "",

          categoryId:
            form.categoryId || "",

          subcategory:
            form.subcategory || "",

          subcategoryId:
            form.subcategoryId || "",

          description:
            form.description || "",

          benefits:
            cleanBenefits,

          ingredients:
            form.ingredients || "",

          usage:
            form.usage || "",

          shelfLife:
            form.shelfLife || "",

          images:
            cleanImages,

          /* COMBO */
          isCombo:
            form.isCombo,

          comboItems:
            form.isCombo
              ? cleanComboItems
              : [],

          mrp:
            form.isCombo
              ? Number(form.mrp) || 0
              : 0,

          price:
            form.isCombo
              ? Number(
                  form.comboPrice
                ) || 0
              : 0,

          /* NORMAL VARIANTS */
          variants:
            form.isCombo
              ? []
              : cleanVariants,
        }
      );

      alert(
        form.isCombo
          ? "Combo Pack Updated Successfully"
          : "Product Updated Successfully"
      );

      refreshProducts();

      closeModal();

    } catch (err) {
      console.error(
        "Update error:",
        err
      );

      alert("Update Failed");
    }
  };

  return (
    <div
      className="
        fixed
        inset-0
        bg-black/60
        backdrop-blur-sm
        flex
        items-center
        justify-center
        z-50
        overflow-y-auto
        p-4
      "
    >

      <div
        className="
          bg-white
          rounded-3xl
          shadow-2xl
          w-full
          max-w-5xl
          max-h-[95vh]
          overflow-y-auto
          p-8
        "
      >

        {/* =====================================================
            TITLE
        ===================================================== */}

        <div className="flex justify-between items-center mb-8">

          <div>

            <h2
              className="
                text-4xl
                font-bold
                text-gray-900
              "
            >
              {form.isCombo
                ? "Edit Combo Pack"
                : "Edit Product"}
            </h2>

            {form.isCombo && (
              <p className="text-orange-600 font-medium mt-1">
                🎁 Combo Pack
              </p>
            )}

          </div>

          <button
            type="button"
            onClick={closeModal}
            className="
              bg-gray-100
              hover:bg-gray-200
              p-3
              rounded-full
              transition
            "
          >
            <X size={24} />
          </button>

        </div>

        {/* =====================================================
            IMAGE PREVIEW
        ===================================================== */}

        {selectedImage && (
          <div className="mb-8">

            <div
              className="
                relative
                overflow-hidden
                rounded-3xl
                bg-gray-100
                group
              "
            >

              <img
                src={selectedImage}
                alt="Preview"
                onClick={() => {
                  setShowGallery(true);
                  setZoom(1);
                }}
                className="
                  w-full
                  max-h-[450px]
                  object-contain
                  cursor-pointer
                  transition-transform
                  duration-500
                  group-hover:scale-105
                "
              />

              <button
                type="button"
                onClick={() => {
                  setShowGallery(true);
                  setZoom(1);
                }}
                className="
                  absolute
                  bottom-5
                  right-5
                  bg-black/70
                  text-white
                  px-5
                  py-2
                  rounded-full
                  opacity-0
                  group-hover:opacity-100
                  transition
                "
              >
                Open Gallery
              </button>

            </div>

          </div>
        )}

        {/* =====================================================
            THUMBNAILS
        ===================================================== */}

        <div
          className="
            flex
            gap-4
            mb-8
            overflow-x-auto
            pb-2
          "
        >

          {form.images?.map(
            (image, index) =>
              image && (
                <div
                  key={index}
                  onClick={() =>
                    setSelectedImage(
                      image
                    )
                  }
                  className={`
                    min-w-[90px]
                    h-[90px]
                    rounded-2xl
                    overflow-hidden
                    cursor-pointer
                    border-2
                    transition-all
                    ${
                      selectedImage ===
                      image
                        ? "border-black scale-105 shadow-lg"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }
                  `}
                >

                  <img
                    src={image}
                    alt={`thumb-${index}`}
                    className="
                      w-full
                      h-full
                      object-cover
                    "
                  />

                </div>
              )
          )}

        </div>

        {/* =====================================================
            BASIC INFO
        ===================================================== */}

        <div className="grid gap-5 mb-8">

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder={
              form.isCombo
                ? "Combo Pack Name"
                : "Product Name"
            }
            className="
              border
              border-gray-200
              p-4
              rounded-2xl
            "
          />

          <input
            type="text"
            name="tamilName"
            value={form.tamilName}
            onChange={handleChange}
            placeholder="Tamil Name"
            className="
              border
              border-gray-200
              p-4
              rounded-2xl
            "
          />

          {/* CATEGORY */}

          <div>

            <label className="block font-semibold mb-2">
              Category
            </label>

            <select
              value={
                form.category || ""
              }
              onChange={
                handleCategoryChange
              }
              className="
                w-full
                border
                border-gray-200
                p-4
                rounded-2xl
              "
            >

              <option value="">
                Select Category
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={category.id}
                    value={category.name}
                  >
                    {category.name}
                  </option>
                )
              )}

            </select>

          </div>

          {/* SUBCATEGORY */}

          <div>

            <label className="block font-semibold mb-2">
              Subcategory
            </label>

            <select
              value={
                form.subcategoryId ||
                ""
              }
              onChange={
                handleSubcategoryChange
              }
              className="
                w-full
                border
                border-gray-200
                p-4
                rounded-2xl
              "
            >

              <option value="">
                Select Subcategory
              </option>

              {filteredSubcategories.map(
                (subcategory) => (
                  <option
                    key={subcategory.id}
                    value={
                      subcategory.id
                    }
                  >
                    {subcategory.name}
                  </option>
                )
              )}

            </select>

          </div>

          {/* DESCRIPTION */}

          <textarea
            name="description"
            value={
              form.description
            }
            onChange={handleChange}
            placeholder="Description"
            rows="4"
            className="
              border
              border-gray-200
              p-4
              rounded-2xl
            "
          />

          {/* BENEFITS */}

          <textarea
            name="benefits"
            value={
              Array.isArray(
                form.benefits
              )
                ? form.benefits.join(
                    "\n"
                  )
                : form.benefits || ""
            }
            onChange={handleChange}
            placeholder="Benefits (one per line)"
            rows="4"
            className="
              border
              border-gray-200
              p-4
              rounded-2xl
            "
          />

          {/* INGREDIENTS */}

          <input
            type="text"
            name="ingredients"
            value={
              form.ingredients
            }
            onChange={handleChange}
            placeholder="Ingredients"
            className="
              border
              border-gray-200
              p-4
              rounded-2xl
            "
          />

          {/* USAGE */}

          <input
            type="text"
            name="usage"
            value={form.usage}
            onChange={handleChange}
            placeholder="Usage"
            className="
              border
              border-gray-200
              p-4
              rounded-2xl
            "
          />

          {/* SHELF LIFE */}

          <input
            type="text"
            name="shelfLife"
            value={
              form.shelfLife
            }
            onChange={handleChange}
            placeholder="Shelf Life"
            className="
              border
              border-gray-200
              p-4
              rounded-2xl
            "
          />

        </div>

        {/* =====================================================
            COMBO DETAILS
        ===================================================== */}

        {form.isCombo && (
          <div
            className="
              bg-orange-50
              p-6
              rounded-3xl
              mb-8
            "
          >

            <h3 className="text-2xl font-bold mb-5">
              🎁 Combo Pack Details
            </h3>

            {/* MRP / PRICE */}

            <div className="grid md:grid-cols-2 gap-4 mb-6">

              <div>

                <label className="block font-semibold mb-2">
                  MRP
                </label>

                <input
                  type="number"
                  name="mrp"
                  value={form.mrp}
                  onChange={handleChange}
                  min="0"
                  className="
                    border
                    border-gray-200
                    p-4
                    rounded-2xl
                    w-full
                  "
                />

              </div>

              <div>

                <label className="block font-semibold mb-2">
                  Combo Price
                </label>

                <input
                  type="number"
                  name="comboPrice"
                  value={
                    form.comboPrice
                  }
                  onChange={handleChange}
                  min="0"
                  className="
                    border
                    border-gray-200
                    p-4
                    rounded-2xl
                    w-full
                  "
                />

              </div>

            </div>

            {/* COMBO ITEMS */}

            <h4 className="font-bold text-lg mb-4">
              Products Included
            </h4>

            <div className="space-y-4">

              {form.comboItems.map(
                (item, index) => (
                  <div
                    key={index}
                    className="
                      grid
                      grid-cols-1
                      md:grid-cols-3
                      gap-3
                    "
                  >

                    <input
                      type="text"
                      value={
                        item.name
                      }
                      onChange={(e) =>
                        handleComboItemChange(
                          index,
                          "name",
                          e.target.value
                        )
                      }
                      placeholder="Product Name"
                      className="
                        border
                        p-4
                        rounded-2xl
                      "
                    />

                    <input
                      type="text"
                      value={
                        item.weight ||
                        ""
                      }
                      onChange={(e) =>
                        handleComboItemChange(
                          index,
                          "weight",
                          e.target.value
                        )
                      }
                      placeholder="Weight / Quantity"
                      className="
                        border
                        p-4
                        rounded-2xl
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeComboItem(
                          index
                        )
                      }
                      className="
                        bg-red-500
                        hover:bg-red-600
                        text-white
                        rounded-2xl
                      "
                    >
                      Remove
                    </button>

                  </div>
                )
              )}

            </div>

            <button
              type="button"
              onClick={addComboItem}
              className="
                bg-orange-200
                hover:bg-orange-300
                px-6
                py-3
                rounded-2xl
                mt-5
              "
            >
              + Add Combo Item
            </button>

          </div>
        )}

        {/* =====================================================
            PRODUCT IMAGES
        ===================================================== */}

        <h3 className="text-2xl font-bold mb-5">
          Product Images
        </h3>

        <div className="space-y-4 mb-8">

          {form.images?.map(
            (image, index) => (
              <div
                key={index}
                className="flex gap-4"
              >

                <input
                  type="text"
                  value={image}
                  onChange={(e) =>
                    handleImageChange(
                      index,
                      e.target.value
                    )
                  }
                  placeholder={`Image URL ${
                    index + 1
                  }`}
                  className="
                    border
                    border-gray-200
                    p-4
                    rounded-2xl
                    w-full
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    removeImage(
                      index
                    )
                  }
                  className="
                    bg-red-500
                    hover:bg-red-600
                    text-white
                    px-5
                    rounded-2xl
                  "
                >
                  Remove
                </button>

              </div>
            )
          )}

          <button
            type="button"
            onClick={addImageField}
            className="
              bg-gray-100
              hover:bg-gray-200
              px-6
              py-3
              rounded-2xl
            "
          >
            + Add Image
          </button>

        </div>

        {/* =====================================================
            NORMAL PRODUCT VARIANTS
        ===================================================== */}

        {!form.isCombo && (
          <>
            <h3 className="text-2xl font-bold mb-5">
              Variants
            </h3>

            <div className="space-y-4">

              {form.variants?.map(
                (variant, index) => (
                  <div
                    key={index}
                    className="
                      grid
                      grid-cols-1
                      md:grid-cols-4
                      gap-4
                    "
                  >

                    <input
                      type="text"
                      value={
                        variant.weight ||
                        ""
                      }
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "weight",
                          e.target.value
                        )
                      }
                      placeholder="Weight"
                      className="
                        border
                        p-4
                        rounded-2xl
                      "
                    />

                    <input
                      type="number"
                      value={
                        variant.price ??
                        ""
                      }
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "price",
                          e.target.value
                        )
                      }
                      placeholder="Price"
                      className="
                        border
                        p-4
                        rounded-2xl
                      "
                    />

                    <input
                      type="number"
                      value={
                        variant.stock ??
                        ""
                      }
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "stock",
                          e.target.value
                        )
                      }
                      placeholder="Stock"
                      className="
                        border
                        p-4
                        rounded-2xl
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeVariant(
                          index
                        )
                      }
                      className="
                        bg-red-500
                        hover:bg-red-600
                        text-white
                        rounded-2xl
                      "
                    >
                      Remove
                    </button>

                  </div>
                )
              )}

            </div>

            <button
              type="button"
              onClick={addVariant}
              className="
                bg-gray-100
                hover:bg-gray-200
                px-6
                py-3
                rounded-2xl
                mt-5
              "
            >
              + Add Variant
            </button>
          </>
        )}

        {/* =====================================================
            SAVE / CANCEL
        ===================================================== */}

        <div className="flex gap-4 mt-10">

          <button
            type="button"
            onClick={handleUpdate}
            className="
              bg-black
              hover:bg-gray-800
              text-white
              p-4
              rounded-2xl
              w-full
              font-semibold
            "
          >
            {form.isCombo
              ? "🎁 Save Combo Pack"
              : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={closeModal}
            className="
              bg-gray-200
              hover:bg-gray-300
              p-4
              rounded-2xl
              w-full
            "
          >
            Cancel
          </button>

        </div>

      </div>

      {/* =====================================================
          FULLSCREEN GALLERY
      ===================================================== */}

      {showGallery && (
        <div
          className="
            fixed
            inset-0
            bg-black/95
            z-[100]
            flex
            items-center
            justify-center
          "
        >

          {/* CLOSE */}

          <button
            type="button"
            onClick={() =>
              setShowGallery(false)
            }
            className="
              absolute
              top-5
              right-5
              bg-white/10
              hover:bg-white/20
              p-3
              rounded-full
              text-white
              z-50
            "
          >
            <X size={28} />
          </button>

          {/* LEFT */}

          {form.images?.length >
            1 && (
            <button
              type="button"
              onClick={prevImage}
              className="
                absolute
                left-5
                top-1/2
                -translate-y-1/2
                bg-white/10
                hover:bg-white/20
                p-4
                rounded-full
                text-white
                z-50
              "
            >
              <ChevronLeft
                size={35}
              />
            </button>
          )}

          {/* RIGHT */}

          {form.images?.length >
            1 && (
            <button
              type="button"
              onClick={nextImage}
              className="
                absolute
                right-5
                top-1/2
                -translate-y-1/2
                bg-white/10
                hover:bg-white/20
                p-4
                rounded-full
                text-white
                z-50
              "
            >
              <ChevronRight
                size={35}
              />
            </button>
          )}

          {/* ZOOM */}

          <div
            className="
              absolute
              top-5
              left-5
              flex
              gap-3
              z-50
            "
          >

            <button
              type="button"
              onClick={() =>
                setZoom(
                  (prev) =>
                    prev + 0.2
                )
              }
              className="
                bg-white/10
                hover:bg-white/20
                p-3
                rounded-full
                text-white
              "
            >
              <ZoomIn size={24} />
            </button>

            <button
              type="button"
              onClick={() =>
                setZoom(
                  (prev) =>
                    Math.max(
                      1,
                      prev - 0.2
                    )
                )
              }
              className="
                bg-white/10
                hover:bg-white/20
                p-3
                rounded-full
                text-white
              "
            >
              <ZoomOut size={24} />
            </button>

          </div>

          {/* IMAGE */}

          <div
            className="
              w-full
              h-full
              overflow-auto
              flex
              items-center
              justify-center
              p-10
            "
          >

            {selectedImage && (
              <img
                src={selectedImage}
                alt="Fullscreen"
                style={{
                  transform: `scale(${zoom})`,
                }}
                className="
                  max-w-full
                  max-h-[85vh]
                  object-contain
                  rounded-2xl
                  transition-transform
                "
              />
            )}

          </div>

          {/* BOTTOM THUMBNAILS */}

          <div
            className="
              absolute
              bottom-5
              left-1/2
              -translate-x-1/2
              flex
              gap-4
              bg-white/10
              px-5
              py-3
              rounded-2xl
              overflow-x-auto
              max-w-[90%]
            "
          >

            {form.images?.map(
              (image, index) =>
                image && (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedImage(
                        image
                      );
                      setZoom(1);
                    }}
                    className={`
                      min-w-[75px]
                      h-[75px]
                      rounded-xl
                      overflow-hidden
                      cursor-pointer
                      border-2
                      ${
                        selectedImage ===
                        image
                          ? "border-white scale-105"
                          : "border-transparent opacity-70"
                      }
                    `}
                  >

                    <img
                      src={image}
                      alt={`thumb-${index}`}
                      className="
                        w-full
                        h-full
                        object-cover
                      "
                    />

                  </div>
                )
            )}

          </div>

        </div>
      )}

    </div>
  );
}