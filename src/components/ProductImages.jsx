import { useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

export default function ProductImages({
  images
}) {

  // =========================
  // STATES
  // =========================

  const [selectedImage,
    setSelectedImage] =
    useState(images?.[0]);

  const [showGallery,
    setShowGallery] =
    useState(false);

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

    <div className="w-full">

      {/* MAIN IMAGE */}

      <div
        className="
          relative
          overflow-hidden
          rounded-3xl
          bg-gray-100
          group
          shadow-lg
        "
      >

        <img
          src={
            selectedImage ||
            "https://via.placeholder.com/600"
          }
          alt="Product"
          onClick={() => {

            setShowGallery(true);

            setZoom(1);
          }}
          className="
            w-full
            h-[450px]
            object-cover
            cursor-pointer
            transition-transform
            duration-500
            group-hover:scale-105
          "
        />

        {/* VIEW BUTTON */}

        <button
          onClick={() => {

            setShowGallery(true);

            setZoom(1);
          }}
          className="
            absolute
            bottom-4
            right-4
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
          View Gallery
        </button>

      </div>

      {/* THUMBNAILS */}

      <div
        className="
          flex
          gap-4
          mt-5
          overflow-x-auto
          pb-2
        "
      >

        {images?.map((img, index) => (

          <div
            key={index}
            onClick={() =>
              setSelectedImage(img)
            }
            className={`
              relative
              min-w-[90px]
              h-[90px]
              rounded-2xl
              overflow-hidden
              cursor-pointer
              transition-all
              duration-300
              border-2

              ${
                selectedImage === img
                  ? "border-black scale-105 shadow-lg"
                  : "border-transparent opacity-70 hover:opacity-100"
              }
            `}
          >

            <img
              src={img}
              alt="thumb"
              className="
                w-full
                h-full
                object-cover
              "
            />

          </div>

        ))}

      </div>

      {/* FULLSCREEN GALLERY */}

      {showGallery && (

        <div
          className="
            fixed
            inset-0
            bg-black/95
            backdrop-blur-lg
            z-50
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

          {images?.length > 1 && (

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
                transition
              "
            >
              <ChevronLeft size={35} />
            </button>
          )}

          {/* RIGHT */}

          {images?.length > 1 && (

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
                transition
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
                transition
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
                transition
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

            {images?.map((img, index) => (

              <div
                key={index}
                onClick={() => {

                  setSelectedImage(img);

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
                    selectedImage === img
                      ? "border-white scale-105"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }
                `}
              >

                <img
                  src={img}
                  alt="gallery-thumb"
                  className="
                    w-full
                    h-full
                    object-cover
                  "
                />

              </div>

            ))}

          </div>

        </div>
      )}

    </div>
  );
}