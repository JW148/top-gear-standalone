import ListstingCard from "../Components/cards/listingCard";
import { getShowroomDataSQL } from "../lib/data";

export default async function Page() {
  const carData = await getShowroomDataSQL();
  return (
    <main className="flex min-h-screen flex-col  items-center m-10">
      <h1 className="text-4xl font-light text-gray-700">Showroom</h1>
      <div className="flex flex-row flex-wrap justify-center">
        {carData.map((el) => (
          <ListstingCard details={el} key={el.listingID} />
        ))}
      </div>
    </main>
  );
}
