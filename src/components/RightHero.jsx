export default function RightHero({
  HeroProductsImage,
}) {
  return (
    <div className="relative w-full flex justify-center lg:justify-end">
      <div className="relative w-full max-w-[950px]">

        <img
  src={HeroProductsImage}
  alt="Natvian Foods Products"
  className="w-full h-auto rounded-[40px] object-cover shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
/>

      </div>
    </div>
  );
}