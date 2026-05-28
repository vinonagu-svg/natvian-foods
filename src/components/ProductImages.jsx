import { useState } from "react";

import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from "lucide-react";

export default function ProductImages({
  images = [],
}) {

  // =========================
  // STATES
  // =========================

  const [selectedImage,
    setSelectedImage] =
    useState(
      images?.[0]
    );

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
      (
        currentIndex - 1 +
        images.length
      ) %
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
          rounded-[32px]
          bg-gradient-to-br
          from-gray-100
          to-gray-200
          group
          shadow-xl
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
            h-[420px]
            md:h-[520px]
            object-cover
            cursor-pointer
            transition-transform
            duration-700
            group-hover:scale-105
          "
        />

        {/* DARK OVERLAY */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/40
            via-transparent
            to-transparent
            opacity-0
            group-hover:opacity-100
            transition
            duration-500
          "
        />

        {/* VIEW GALLERY BUTTON */}

        <button
          onClick={() => {

            setShowGallery(true);

            setZoom(1);
          }}
          className="
            absolute
            bottom-5
            right-5
            bg-white/20
            hover:bg-white/30
            backdrop-blur-xl
            border
            border-white/20
            text-white
            px-5
            py-3
            rounded-full
            flex
            items-center
            gap-2
            opacity-0
            group-hover:opacity-100
            transition-all
            duration-300
          "
        >

          <Maximize2 size={18} />

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

        {images?.map(
          (
            img,
            index
          ) => (

            <div
              key={index}
              onClick={() =>
                setSelectedImage(img)
              }
              className={`
                relative
                min-w-[85px]
                h-[85px]
                rounded-2xl
                overflow-hidden
                cursor-pointer
                border-2
                transition-all
                duration-300

                ${
                  selectedImage === img
                    ? "border-black scale-105 shadow-xl"
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
          )
        )}

      </div>

      {/* FULLSCREEN GALLERY */}

      {showGallery && (

        <div
          className="
            fixed
            inset-0
            z-[999]
            bg-black/95
            backdrop-blur-2xl
            flex
            items-center
            justify-center
            overflow-hidden
          "
        >

          {/* BACKGROUND OVERLAY */}

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-b
              from-black/80
              via-black/95
              to-black/90
            "
          />

          {/* CLOSE BUTTON */}

          <button
            onClick={() =>
              setShowGallery(false)
            }
            className="
              absolute
              top-5
              right-5
              z-50
              w-14
              h-14
              rounded-full
              bg-white/10
              hover:bg-white/20
              backdrop-blur-md
              flex
              items-center
              justify-center
              text-white
              transition-all
              duration-300
            "
          >
            <X size={30} />
          </button>

          {/* LEFT BUTTON */}

          {images?.length > 1 && (

            <button
              onClick={prevImage}
              className="
                absolute
                left-4
                md:left-8
                top-1/2
                -translate-y-1/2
                z-50
                w-14
                h-14
                rounded-full
                bg-white/10
                hover:bg-white/20
                backdrop-blur-md
                flex
                items-center
                justify-center
                text-white
                transition-all
              "
            >
              <ChevronLeft size={34} />
            </button>
          )}

          {/* RIGHT BUTTON */}

          {images?.length > 1 && (

            <button
              onClick={nextImage}
              className="
                absolute
                right-4
                md:right-8
                top-1/2
                -translate-y-1/2
                z-50
                w-14
                h-14
                rounded-full
                bg-white/10
                hover:bg-white/20
                backdrop-blur-md
                flex
                items-center
                justify-center
                text-white
                transition-all
              "
            >
              <ChevronRight size={34} />
            </button>
          )}

          {/* ZOOM CONTROLS */}

          <div
            className="
              absolute
              top-5
              left-5
              z-50
              flex
              gap-3
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
                w-14
                h-14
                rounded-full
                bg-white/10
                hover:bg-white/20
                backdrop-blur-md
                flex
                items-center
                justify-center
                text-white
                transition-all
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
                w-14
                h-14
                rounded-full
                bg-white/10
                hover:bg-white/20
                backdrop-blur-md
                flex
                items-center
                justify-center
                text-white
                transition-all
              "
            >
              <ZoomOut size={24} />
            </button>

          </div>

          {/* IMAGE CONTAINER */}

          <div
            className="
              relative
              z-40
              w-full
              h-full
              flex
              items-center
              justify-center
              p-6
              md:p-14
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
                max-h-[80vh]
                object-contain
                rounded-3xl
                shadow-[0_20px_80px_rgba(0,0,0,0.7)]
                transition-transform
                duration-300
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
              z-50
              flex
              gap-4
              overflow-x-auto
              max-w-[92%]
              px-5
              py-4
              rounded-3xl
              bg-white/10
              backdrop-blur-xl
              border
              border-white/10
            "
          >

            {images?.map(
              (
                img,
                index
              ) => (

                <div
                  key={index}
                  onClick={() => {

                    setSelectedImage(img);

                    setZoom(1);
                  }}
                  className={`
                    min-w-[80px]
                    h-[80px]
                    rounded-2xl
                    overflow-hidden
                    cursor-pointer
                    border-2
                    transition-all
                    duration-300

                    ${
                      selectedImage === img
                        ? "border-white scale-105 shadow-xl"
                        : "border-transparent opacity-60 hover:opacity-100"
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
              )
            )}

          </div>

        </div>
      )}

    </div>
  );
}