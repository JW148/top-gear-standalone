import { Card, CardBody, CardHeader } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";

export default function ListstingCard({ details }) {
  return (
    <Link href={`/showroom/${details.listingID}/details`}>
      <Card
        className="py-4 m-4 md:w-[400px] w-[90vw] -z-10"
        radius="none"
        key={details.listingID}
      >
        <CardHeader className="pb-0 pt-0 px-4 flex-col items-start">
          <Image
            alt="Card background"
            className="object-cover rounded-sm"
            src={`/api/image-endpoint/${details.images[0]}`}
            width={400}
            height={400}
          />
        </CardHeader>
        <CardBody className="overflow-visible px-4 mt-2">
          <div className="flex flex-row pt-2 justify-between text-slate-600">
            <p className="font-semibold">Model</p>

            <p className="truncate max-w-[60%]">{details?.model}</p>
          </div>
          <div className="flex flex-row pt-2  justify-between text-slate-600">
            <p className="font-semibold">Price</p>

            <p>£{parseInt(details?.price).toLocaleString()}</p>
          </div>
          <div className="flex flex-row pt-2  justify-between text-slate-600">
            <p className="font-semibold">Colour</p>

            <p className="truncate max-w-[60%]">{details?.colour}</p>
          </div>
          <div className="flex flex-row pt-2  justify-between text-slate-600">
            <p className="font-semibold">Year</p>

            <p>{details?.year}</p>
          </div>
          <div className="flex flex-row pt-2 justify-between text-slate-600">
            <p className="font-semibold">Mileage</p>

            <p>{parseInt(details?.mileage).toLocaleString()}Km</p>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
