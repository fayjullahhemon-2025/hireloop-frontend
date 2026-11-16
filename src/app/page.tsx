import { Banner } from "@/components/banner";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <main>
        <Banner />
      </main>
    </div>
  );
}
