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
}) {

  // =========================
  // FORM STATE
  // =========================

  const [form, setForm] =
    useState({

      ...product,

      images:
        product.images || [],

      variants:
        product.variants || [],
    });

  // =========================
  // IMAGE GALLERY STATE
  // =========================

  const [selectedImage,
    setSelectedImage] =
    useState(
      product.images?.[0] || ""
    );

  const [showGallery,
    setShowGallery] =
    useState(false);

  const [zoom,
    setZoom] =
    useState(1);

  // =========================
  // HANDLE BASIC FIELDS
  // =========================

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value,
    });
  };

  // =========================
  // HANDLE IMAGE URL CHANGE
  // =========================

  const handleImageChange = (
    index,
    value
  ) => {

    const updatedImages =
      [...form.images];

    updatedImages[index] =
      value;

    setForm({

      ...form,

      images:
        updatedImages,
    });

    if (
      selectedImage ===
      form.images[index]
    ) {

      setSelectedImage(
        value
      );
    }
  };

  // =========================
  // ADD IMAGE FIELD
  // =========================

  const addImageField = () => {

    setForm({

      ...form,

      images: [

        ...form.images,
        "",
      ],
    });
  };

  // =========================
  // REMOVE IMAGE
  // =========================

  const removeImage = (
    index
  ) => {

    const updatedImages =
      form.images.filter(
        (_, i) =>
          i !== index
      );

    setForm({

      ...form,

      images:
        updatedImages,
    });

    if (
      selectedImage ===
      form.images[index]
    ) {

      setSelectedImage(
        updatedImages[0] || ""
      );
    }
  };

  // =========================
  // HANDLE VARIANTS
  // =========================

  const handleVariantChange = (
    index,
    field,
    value
  ) => {

    const updatedVariants =
      [...form.variants];

    updatedVariants[index][field] =
      value;

    setForm({

      ...form,

      variants:
        updatedVariants,
    });
  };

  // =========================
  // ADD VARIANT
  // =========================

  const addVariant = () => {

    setForm({

      ...form,

      variants: [

        ...form.variants,

        {
          weight: "",
          price: "",
          stock: "",
        }

      ]
    });
  };

  // =========================
  // REMOVE VARIANT
  // =========================

  const removeVariant = (
    index
  ) => {

    const updatedVariants =
      form.variants.filter(
        (_, i) =>
          i !== index
      );

    setForm({

      ...form,

      variants:
        updatedVariants,
    });
  };

  // =========================
  // NEXT IMAGE
  // =========================

  const nextImage = () => {

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

  // =========================
  // PREVIOUS IMAGE
  // =========================

  const prevImage = () => {

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

  // =========================
  // UPDATE PRODUCT
  // =========================

  const handleUpdate =
    async () => {

      try {

        const cleanVariants =
          form.variants.map(
            (variant) => ({

              weight:
                variant.weight,

              price:
                Number(
                  variant.price
                ),

              stock:
                Number(
                  variant.stock
                ),
            })
          );

        const cleanImages =
          form.images.filter(
            (img) =>
              img.trim() !== ""
          );

        const productRef =
          doc(
            db,
            "products",
            product.id
          );

        await updateDoc(
          productRef,
          {

            name:
              form.name,

            category:
              form.category,

            description:
              form.description,

            images:
              cleanImages,

            variants:
              cleanVariants,
          }
        );

        alert(
          "Updated Successfully"
        );

        refreshProducts();

        closeModal();

      } catch (err) {

        console.error(err);

        alert(
          "Update Failed"
        );
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

        {/* TITLE */}

        <div className="flex justify-between items-center mb-8">

          <h2
            className="
              text-4xl
              font-bold
              text-gray-900
            "
          >
            Edit Product
          </h2>

          <button
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

        {/* IMAGE PREVIEW */}

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
                onClick={() => {

                  setShowGallery(true);

                  setZoom(1);
                }}
                className="
                  absolute
                  bottom-5
                  right-5
                  bg-black/70
                  backdrop-blur-md
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

        {/* THUMBNAILS */}

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
            (
              image,
              index
            ) => (

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
                    duration-300

                    ${
                      selectedImage === image
                        ? "border-black scale-105 shadow-lg"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }
                  `}
                >

                  <img
                    src={image}
                    alt="thumb"
                    className="
                      w-full
                      h-full
                      object-cover
                    "
                  />

                </div>

              )
            )
          )}

        </div>

        {/* BASIC INFO */}

        <div className="grid gap-5 mb-8">

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="
              border
              border-gray-200
              p-4
              rounded-2xl
              focus:outline-none
              focus:ring-2
              focus:ring-black
            "
          />

          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="
              border
              border-gray-200
              p-4
              rounded-2xl
              focus:outline-none
              focus:ring-2
              focus:ring-black
            "
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            rows="4"
            className="
              border
              border-gray-200
              p-4
              rounded-2xl
              focus:outline-none
              focus:ring-2
              focus:ring-black
            "
          />

        </div>

        {/* PRODUCT IMAGES */}

        <h3
          className="
            text-2xl
            font-bold
            mb-5
          "
        >
          Product Images
        </h3>

        <div className="space-y-4 mb-8">

          {form.images?.map(
            (
              image,
              index
            ) => (

              <div
                key={index}
                className="flex gap-4"
              >

                <input
                  type="text"
                  placeholder={`Image URL ${index + 1}`}
                  value={image}
                  onChange={(e) =>
                    handleImageChange(
                      index,
                      e.target.value
                    )
                  }
                  className="
                    border
                    border-gray-200
                    p-4
                    rounded-2xl
                    w-full
                    focus:outline-none
                    focus:ring-2
                    focus:ring-black
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
                    transition
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
              transition
            "
          >
            + Add Image
          </button>

        </div>

        {/* VARIANTS */}

        <h3
          className="
            text-2xl
            font-bold
            mb-5
          "
        >
          Variants
        </h3>

        <div className="space-y-4">

          {form.variants?.map(
            (
              variant,
              index
            ) => (

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
                  placeholder="Weight"
                  value={
                    variant.weight
                  }
                  onChange={(e) =>
                    handleVariantChange(
                      index,
                      "weight",
                      e.target.value
                    )
                  }
                  className="
                    border
                    border-gray-200
                    p-4
                    rounded-2xl
                  "
                />

                <input
                  type="number"
                  placeholder="Price"
                  value={
                    variant.price
                  }
                  onChange={(e) =>
                    handleVariantChange(
                      index,
                      "price",
                      e.target.value
                    )
                  }
                  className="
                    border
                    border-gray-200
                    p-4
                    rounded-2xl
                  "
                />

                <input
                  type="number"
                  placeholder="Stock"
                  value={
                    variant.stock
                  }
                  onChange={(e) =>
                    handleVariantChange(
                      index,
                      "stock",
                      e.target.value
                    )
                  }
                  className="
                    border
                    border-gray-200
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
                    transition
                  "
                >
                  Remove
                </button>

              </div>
            )
          )}

        </div>

        {/* ADD VARIANT */}

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
            transition
          "
        >
          + Add Variant
        </button>

        {/* ACTIONS */}

        <div className="flex gap-4 mt-10">

          <button
            onClick={handleUpdate}
            className="
              bg-black
              hover:bg-gray-800
              text-white
              p-4
              rounded-2xl
              w-full
              font-semibold
              transition
            "
          >
            Save Changes
          </button>

          <button
            onClick={closeModal}
            className="
              bg-gray-200
              hover:bg-gray-300
              p-4
              rounded-2xl
              w-full
              transition
            "
          >
            Cancel
          </button>

        </div>

      </div>

      {/* FULLSCREEN GALLERY */}

      {showGallery && (

        <div
          className="
            fixed
            inset-0
            bg-black/95
            backdrop-blur-lg
            z-[100]
            flex
            items-center
            justify-center
          "
        >

          {/* CLOSE */}

          <button
            onClick={() =>
              setShowGallery(false)
            }
            className="
              absolute
              top-5
              right-5
              bg-white/10
              hover:bg-white/20
              backdrop-blur-md
              p-3
              rounded-full
              text-white
              z-50
              transition
            "
          >
            <X size={28} />
          </button>

          {/* LEFT */}

          {form.images?.length > 1 && (

            <button
              onClick={prevImage}
              className="
                absolute
                left-5
                top-1/2
                -translate-y-1/2
                bg-white/10
                hover:bg-white/20
                backdrop-blur-md
                p-4
                rounded-full
                text-white
                z-50
              "
            >
              <ChevronLeft size={35} />
            </button>
          )}

          {/* RIGHT */}

          {form.images?.length > 1 && (

            <button
              onClick={nextImage}
              className="
                absolute
                right-5
                top-1/2
                -translate-y-1/2
                bg-white/10
                hover:bg-white/20
                backdrop-blur-md
                p-4
                rounded-full
                text-white
                z-50
              "
            >
              <ChevronRight size={35} />
            </button>
          )}

          {/* ZOOM CONTROLS */}

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
              onClick={() =>
                setZoom(
                  (prev) =>
                    prev + 0.2
                )
              }
              className="
                bg-white/10
                hover:bg-white/20
                backdrop-blur-md
                p-3
                rounded-full
                text-white
              "
            >
              <ZoomIn size={24} />
            </button>

            <button
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
                backdrop-blur-md
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
                transition-transform
                duration-300
                rounded-2xl
                shadow-2xl
              "
            />

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
              backdrop-blur-md
              px-5
              py-3
              rounded-2xl
              overflow-x-auto
              max-w-[90%]
            "
          >

            {form.images?.map(
              (
                image,
                index
              ) => (

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
                      transition-all

                      ${
                        selectedImage === image
                          ? "border-white scale-105"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }
                    `}
                  >

                    <img
                      src={image}
                      alt="thumb"
                      className="
                        w-full
                        h-full
                        object-cover
                      "
                    />

                  </div>

                )
              )
            )}

          </div>

        </div>
      )}

    </div>
  );
}