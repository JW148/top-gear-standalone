"use client";

import { Button, Card, Switch } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { PiMinusCircleFill } from "react-icons/pi";
import { editListingSQL } from "@/app/lib/actions";
import SortableGrid from "../dnd/SortableGrid";

export default function EditListing({ details }) {
  const [files, setFiles] = useState(details.images);
  const [newFiles, setNewFiles] = useState(null);
  const [isSelected, setIsSelected] = useState(details.available);
  const ref = useRef(null);

  return (
    <Card className=" m-4 md:w-[500px] w-[90vw] p-4 rounded-sm">
      <form
        className="flex flex-col items-center text-gray-600"
        action={editListingSQL}
        ref={ref}
      >
        <input
          className="w-full p-4 bg-slate-200 m-2 mb-6 h-12 rounded-sm border-1.5 text-gray-400"
          type="text"
          name="listingID"
          defaultValue={details.listingID}
          readOnly
        />
        <input
          className="w-full p-4 bg-slate-200 m-2 mb-6 h-12 rounded-sm border-1.5 text-gray-400"
          type="text"
          name="date"
          defaultValue={details.date}
          readOnly
          hidden
        />
        <input
          className="w-full p-4 bg-slate-200 m-2 mb-6 h-12 rounded-sm border-1.5 text-gray-400"
          type="text"
          name="files_to_delete"
          defaultValue={details.images.filter((x) => !files.includes(x))}
          readOnly
          hidden
        />
        <input
          className="w-full p-4 bg-slate-200 m-2 mb-6 h-12 rounded-sm border-1.5 text-gray-400"
          type="text"
          name="files_to_keep"
          value={files}
          readOnly
          hidden
        />
        <input
          className="w-full mb-2
          file:py-3 
          file:rounded-sm file:border-1 file:border-slate-400
          file:text-base file:font-medium
          file:bg-white file:text-slate-700
          hover:file:bg-slate-100 file:w-full"
          type="file"
          name="files"
          multiple
          accept=".jpg, .jpeg, .png"
          onChange={(e) => {
            setNewFiles(e.target.files);
          }}
        />

        <h4 className="self-start font-semibold text-slate-500">
          Existing Files
        </h4>
        <SortableGrid items={files} setItems={setFiles} />
        {newFiles && (
          <h4 className="self-start font-semibold text-slate-500">New Files</h4>
        )}
        <ul className="self-start list-disc ml-5 text-slate-400">
          {newFiles &&
            Array.from(newFiles).map((file) => (
              <li key={file.name}>
                {file.name} - {file.size} bytes
              </li>
            ))}
        </ul>
        <input
          className="w-full p-4 bg-slate-200 m-2 mt-6 h-12 rounded-sm border-1.5"
          type="text"
          name="model"
          placeholder="Enter car model"
          defaultValue={details.model}
        />
        <input
          className="w-full p-4 bg-slate-200 m-2 mt-4 h-12 rounded-sm border-1.5"
          type="number"
          name="price"
          placeholder="Enter car price"
          defaultValue={details.price}
        />
        <input
          className="w-full p-4 bg-slate-200 m-2 mt-4 h-12 rounded-sm border-1.5"
          type="text"
          name="colour"
          placeholder="Enter car colour"
          title="Please enter car colour"
          defaultValue={details.colour}
        />
        <input
          className="w-full p-4 bg-slate-200 m-2 mt-4 h-12 rounded-sm border-1.5"
          type="number"
          name="year"
          placeholder="Enter car production year"
          defaultValue={details.year}
        />
        <input
          className="w-full p-4 bg-slate-200 m-2 mt-4 h-12 rounded-sm border-1.5"
          type="number"
          name="mileage"
          placeholder="Enter car mileage"
          defaultValue={details.mileage}
        />
        <textarea
          className="w-full h-40 p-4 bg-slate-200 m-2 mt-4 rounded-sm border-1.5"
          type="text"
          name="description"
          placeholder="Enter a description"
          defaultValue={details.description}
        />
        <h4 className="font-medium m-2 text-slate-500">Sold | Available</h4>
        <Switch
          color="success"
          className="m-2"
          name="available"
          isSelected={isSelected}
          onValueChange={setIsSelected}
          value={isSelected}
        />
        <div className="flex flex-row w-full">
          <Button
            as={Link}
            href="/admin"
            className="flex m-2 flex-1 text-base text-red-600 bg-white border-1 border-red-600 hover:bg-slate-100"
            radius="none"
          >
            Cancel
          </Button>
          <Button
            className="flex m-2 flex-1 text-base text-slate-600 bg-white border-1 border-slate-400 hover:bg-slate-100"
            type="submit"
            radius="none"
          >
            Update
          </Button>
        </div>
      </form>
    </Card>
  );
}
