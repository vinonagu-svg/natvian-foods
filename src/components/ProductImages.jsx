import { useState } from "react";

export default function ProductImages({
  images
}) {

  // =========================
  // DEFAULT IMAGE
  // =========================
  const [selectedImage,
    setSelectedImage] =
    useState(images?.[0]);

  // =========================
  // FULLSCREEN GALLERY
  // =========================
  const [showGallery,
    setShowGallery] =
    useState(false);

  // =========================
  // ZOOM STATE
  // =========================
  const [zoom,
    setZoom] =
    useState(1);

  // =========================
  // NEXT IMAGE
  // =========================
  const nextImage = () => {

    const currentIndex =
      images.indexOf(
        selectedImage
      );

    const nextIndex =
      (currentIndex + 1) %
      images.length;

    setSelectedImage(
      images[nextIndex]
    );

    setZoom(1);
  };

  // =========================
  // PREVIOUS IMAGE
  // =========================
  const prevImage = () => {

    const currentIndex =
      images.indexOf(
        selectedImage
      );

    const prevIndex =
      (currentIndex - 1 +
        images.length) %
      images.length;

    setSelectedImage(
      images[prevIndex]
    );

    setZoom(1);
  };

  return (

    <div>

      {/* MAIN IMAGE */}

      <div className="overflow-hidden rounded-lg border">

        <img
          src={
            selectedImage ||
            "https://via.placeholder.com/500"
          }
          alt="Product"
          onClick={() => {

            setShowGallery(true);

            setZoom(1);
          }}
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
            bg-black/95
            z-50
            flex
            items-center
            justify-center
            overflow-hidden
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
              text-5xl
              font-bold
              z-50
            "
          >
            ×
          </button>

          {/* LEFT BUTTON */}

          {images?.length > 1 && (

            <button
              onClick={prevImage}
              className="
                absolute
                left-5
                top-1/2
                -translate-y-1/2
                bg-white/20
                text-white
                text-4xl
                px-4
                py-2
                rounded-full
                z-50
              "
            >
              ‹
            </button>
          )}

          {/* RIGHT BUTTON */}

          {images?.length > 1 && (

            <button
              onClick={nextImage}
              className="
                absolute
                right-5
                top-1/2
                -translate-y-1/2
                bg-white/20
                text-white
                text-4xl
                px-4
                py-2
                rounded-full
                z-50
              "
            >
              ›
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

            {/* ZOOM IN */}

            <button
              onClick={() =>
                setZoom(
                  (prev) =>
                    prev + 0.2
                )
              }
              className="
                bg-white
                text-black
                px-4
                py-2
                rounded-lg
                text-2xl
                font-bold
              "
            >
              +
            </button>

            {/* ZOOM OUT */}

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
                bg-white
                text-black
                px-4
                py-2
                rounded-lg
                text-2xl
                font-bold
              "
            >
              -
            </button>

          </div>

          {/* IMAGE CONTAINER */}

          <div
            className="
              overflow-auto
              w-full
              h-full
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
                duration-200
                cursor-grab
              "
            />

          </div>

          {/* BOTTOM THUMBNAILS */}

          <div
            className="
              absolute
              bottom-5
              left-0
              right-0
              flex
              justify-center
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
                onClick={() => {

                  setSelectedImage(img);

                  setZoom(1);
                }}
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