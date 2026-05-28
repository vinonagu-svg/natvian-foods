import { useState } from "react";

export default function ProductImages({
  images
}) {

  const [selectedImage, setSelectedImage] =
    useState(images?.[0]);

  const [showGallery, setShowGallery] =
    useState(false);

  return (

    <div>

      {/* MAIN IMAGE */}

      <div className="overflow-hidden rounded-lg border">

        <img
          src={selectedImage}
          alt="Product"
          onClick={() =>
            setShowGallery(true)
          }
          className="
            w-full
            cursor-pointer
            transition-transform
            duration-300
            hover:scale-110
          "
        />

      </div>

      {/* THUMBNAILS */}

      <div className="flex gap-3 mt-4 flex-wrap">

        {images?.map((img, index) => (

          <img
            key={index}
            src={img}
            alt="thumb"
            onClick={() =>
              setSelectedImage(img)
            }
            className={`
              w-20
              h-20
              object-cover
              border
              rounded
              cursor-pointer
              p-1
              transition

              ${
                selectedImage === img
                  ? "border-black"
                  : "border-gray-300"
              }
            `}
          />

        ))}

      </div>

      {/* FULLSCREEN GALLERY */}

      {showGallery && (

        <div
          className="
            fixed
            inset-0
            bg-black/90
            z-50
            flex
            items-center
            justify-center
            p-4
          "
        >

          {/* CLOSE BUTTON */}

          <button
            onClick={() =>
              setShowGallery(false)
            }
            className="
              absolute
              top-5
              right-5
              text-white
              text-4xl
              font-bold
            "
          >
            ×
          </button>

          {/* LARGE IMAGE */}

          <img
            src={selectedImage}
            alt="Fullscreen"
            className="
              max-w-full
              max-h-[85vh]
              rounded-lg
            "
          />

          {/* BOTTOM THUMBNAILS */}

          <div
            className="
              absolute
              bottom-5
              flex
              gap-3
              overflow-x-auto
              px-4
            "
          >

            {images?.map((img, index) => (

              <img
                key={index}
                src={img}
                alt="gallery-thumb"
                onClick={() =>
                  setSelectedImage(img)
                }
                className={`
                  w-20
                  h-20
                  object-cover
                  rounded
                  cursor-pointer
                  border-2

                  ${
                    selectedImage === img
                      ? "border-white"
                      : "border-gray-500"
                  }
                `}
              />

            ))}

          </div>

        </div>
      )}

    </div>
  );
}