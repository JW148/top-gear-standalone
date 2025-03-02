"use client";

import { Button } from "@nextui-org/react";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { IoMenu } from "react-icons/io5";

export default function NavBar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <>
      <div className="w-full grid grid-cols-6 py-4 items-center text-center text-lg shadow-md text-gray-700 font-normal bg-gradient-to-t to-60% from-gray-300 z-10 relative">
        <p className="md:flex md:justify-self-center hidden">01501 763 800</p>
        <div className=" flex col-start-2 col-span-4 justify-center items-center ">
          <Image
            src={"/NavBar/TopGearLogoShadowLight.png"}
            alt="Top Gear logo"
            priority={true}
            width={300}
            height={140}
          />
        </div>
        <p className="md:flex md:justify-self-center hidden">
          info@topgear-cars.co.uk
        </p>
        <div className="flex md:hidden justify-center">
          {menuOpen ? (
            <Button
              isIconOnly
              className="bg-transparent"
              onClick={() => setMenuOpen(false)}
              disableRipple={true}
            >
              <IoMdClose size={25} className="text-gray-700" />
            </Button>
          ) : (
            <Button
              isIconOnly
              className="bg-transparent"
              onClick={() => setMenuOpen(true)}
              disableRipple={true}
            >
              <IoMenu size={25} className="text-gray-700" />
            </Button>
          )}
        </div>
      </div>
      <div className="flex relative">
        {menuOpen && (
          <div
            id="dropdown"
            className="flex flex-col font-light text-start text-gray-100 bg-black/65 backdrop-blur-2xl shadow-md w-full z-10 absolute top-0"
          >
            <div className="w-full flex h-[2px] bg-slate-700 mx-auto"></div>
            <Link
              className={clsx("pl-5 pt-5", {
                "font-bold": pathname === "/",
              })}
              href="/"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              className={clsx("pl-5 pt-5", {
                "font-bold": pathname.includes("/showroom"),
              })}
              href="/showroom"
              onClick={() => setMenuOpen(false)}
            >
              Showroom
            </Link>
            <Link
              className={clsx("pl-5 pt-5", {
                "font-bold": pathname === "/contact",
              })}
              href="/contact"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
            {session && (
              <Link
                className={clsx("pl-5 py-5", {
                  "font-bold": pathname === "/admin",
                })}
                href="/admin"
                onClick={() => setMenuOpen(false)}
              >
                Admin
              </Link>
            )}
          </div>
        )}
      </div>

      <div className="w-full md:flex h-[2px] bg-slate-700 mx-auto hidden"></div>
      <div className="md:flex md:flex-row sticky justify-center items-center top-0 bg-slate-100 h-14 text-2xl font-light text-gray-800 shadow-xl z-10 hidden">
        <Link
          className={clsx("px-20 hover:underline", {
            "font-normal underline": pathname === "/",
          })}
          href="/"
        >
          Home
        </Link>
        <Link
          className={clsx("px-20 hover:underline", {
            "font-normal underline": pathname.includes("/showroom"),
          })}
          href="/showroom"
        >
          Showroom
        </Link>
        <Link
          className={clsx("px-20 hover:underline", {
            "font-normal underline": pathname === "/contact",
          })}
          href="/contact"
        >
          Contact
        </Link>
        {session && (
          <Link
            className={clsx("px-20 hover:underline", {
              "font-normal underline": pathname === "/admin",
            })}
            href="/admin"
          >
            Admin
          </Link>
        )}
      </div>
    </>
  );
}
