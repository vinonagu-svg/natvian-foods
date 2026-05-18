export default function RightHero({
  MurungabannerImage,
  BananabannerImage,
}) {
  return (
    <div className="relative flex flex-col gap-6 items-end w-full">

      {/* MURUNGA */}
      <div className="relative w-full max-w-[520px]">
        <img
          src={MurungabannerImage}
          alt="Murunga Banner"
          className="w-full rounded-[28px] shadow-2xl"
        />

        <div className="absolute top-4 right-4 bg-white rounded-full shadow-lg px-4 py-3 hidden md:block">
          <p className="text-[#31572C] font-bold text-sm text-center leading-tight">
            Strength <br /> & Naturally
          </p>
        </div>
      </div>

      {/* BANANA BLOOM */}
      <div className="relative w-full max-w-[520px]">
        <img
          src={BananabannerImage}
          alt="Banana Bloom Banner"
          className="w-full rounded-[28px] shadow-2xl"
        />

        <div className="absolute bottom-4 right-4 bg-[#31572C] text-white px-4 py-2 rounded-full shadow-lg text-sm font-bold">
          Best Seller
        </div>
      </div>
    </div>
  )
}