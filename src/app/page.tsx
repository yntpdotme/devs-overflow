import Navbar from "@/components/navigation/navbar";

const Home = () => {
  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8 pb-20 sm:p-20">
        <h1 className="text-4xl font-semibold">Devs Overflow</h1>
        <p className="text-center">
          Ask, Answer, and Accelerate your developer journey.
        </p>
      </main>
    </>
  );
};

export default Home;
