import { HomeBg } from "@/components/home-svg/home-bg";
import { HomeSvg } from "@/components/home-svg/home-svg";

export default function Home() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#f5f5f5] text-black">
      <HomeBg />
      <h1 className="fixed top-2 left-2 text-4xl font-semibold">Ruderal</h1>
      <HomeSvg className="absolute top-0 left-1/2 h-full w-auto -translate-x-1/2" />
    </main>
  );
}
