"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { motion } from "framer-motion";
import { inter } from "../fonts";
import { urlForImage } from "@/lib/utils";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
  hasElements,
  link,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  hasElements: boolean;
  link: string;
  children?: React.ReactNode;
}) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <Link href={link || "#"}>
        <motion.p
          transition={{ duration: 0.3 }}
          className={`cursor-pointer flex ${inter.className} py-5 text-md px-6 text-white hover:text-secondary duration-[0.1s]`}
        >
          {item}
        </motion.p>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: -25 }}
            transition={transition}
          >
            {active === item && hasElements && (
              <div className="absolute top-[calc(100%_+_1.7rem)] left-1/2 transform -translate-x-1/2">
                <motion.div
                  transition={transition}
                  layoutId="active" // layoutId ensures smooth animation
                  className="bg-white dark:bg-black backdrop-blur-sm rounded-2xl overflow-hidden border border-black/[0.2] dark:border-white/[0.2] shadow-xl"
                >
                  <motion.div
                    layout // layout ensures smooth animation
                    className="w-max h-full p-4"
                  >
                    {children}
                  </motion.div>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}
      </Link>
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
  active,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
  active: boolean;
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)} // resets the state
      className={`relative ${active ? "pl-10" : "pl-5"} z-10 list-none flex justify-evenly`}
    >
      {children}
    </nav>
  );
};

export const HoveredLink = ({ children, ...rest }: any) => {
  return (
    <Link
      {...rest}
      className="text-neutral-700 dark:text-neutral-200 hover:text-secondary"
    >
      {children}
    </Link>
  );
};
const TopHeader = ({ clubs }: any) => {
  return (
    <section className="flex p-8 justify-between items-center">
      <div className="flex">
        <div className="font-bold leading-[150%] text-md pr-4">
          Explore our league's football clubs
        </div>
        <Image src={"/cta-icon.svg"} alt={"cta-icon"} width={20} height={20} />
      </div>

      <div className="flex justify-evenly items-center group">
        {clubs.map((club: any) => (
          <div key={club.title}>
            {club.name === "Ikoyi FC" ? (
              <a href={club.link || "#"} target={"_blank"} rel={"noopener"}>
                <Image
                  className="cursor-pointer duration-[0.1s] hover:scale-125"
                  src={club.image && urlForImage(club.image)?.url()}
                  alt={`${club.name}_Logo`}
                  title={club.name}
                  width={45}
                  height={45}
                />
              </a>
            ) : (
              <a href={club.link || "#"} target={"_blank"} rel={"noopener"}>
                <Image
                  className="cursor-pointer duration-[0.1s] hover:scale-125"
                  src={club.image && urlForImage(club.image)?.url()}
                  alt={`${club.name}_Logo`}
                  title={club.name}
                  width={50}
                  height={50}
                />
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

const MainHeader = ({
  paddingResize,
  menuItems,
  logo,
  title,
  second_logo,
}: any) => {
  const [showSubMenu, setShowSubMenu] = useState<string | null>(null); // State to control submenu visibility
  const logoRef = useRef(null);
  const logoRef2 = useRef(null);

  const handleMouseEnter = (logo: string) => {
    if (
      typeof window !== "undefined" &&
      window.innerWidth > 1024 &&
      window.scrollY <= 350
    ) {
      const tl = gsap.timeline();

      if (logo == "1") {
        tl.to(logoRef.current, { y: -10, duration: 0.2, ease: "power1.inOut" })
          .to(logoRef.current, { y: 0, duration: 0.2, ease: "power1.inOut" })
          .to(logoRef.current, { y: -5, duration: 0.1, ease: "power1.inOut" })
          .to(logoRef.current, { y: 0, duration: 0.1, ease: "power1.inOut" })
          .to(logoRef.current, { y: -2, duration: 0.1, ease: "power1.inOut" })
          .to(logoRef.current, { y: 0, duration: 0.1, ease: "power1.inOut" });
      } else {
        tl.to(logoRef2.current, { y: -10, duration: 0.2, ease: "power1.inOut" })
          .to(logoRef2.current, { y: 0, duration: 0.2, ease: "power1.inOut" })
          .to(logoRef2.current, { y: -5, duration: 0.1, ease: "power1.inOut" })
          .to(logoRef2.current, { y: 0, duration: 0.1, ease: "power1.inOut" })
          .to(logoRef2.current, { y: -2, duration: 0.1, ease: "power1.inOut" })
          .to(logoRef2.current, { y: 0, duration: 0.1, ease: "power1.inOut" });
      }
    }
  };
  return (
    <section className="flex z-10 py-0 px-16 bg-black justify-between items-center">
      <div className="flex justify-center items-center">
        <Link href={"/"}>
          <Image
            id={"logo"}
            ref={logoRef}
            className="scale-125"
            src={logo && urlForImage(logo)?.url()}
            alt={`${title}_Logo`}
            title={title}
            width={100}
            height={100}
            onMouseEnter={() => {
              handleMouseEnter("1");
            }}
            quality={100}
            loading={"lazy"}
          />
        </Link>
        <Menu active={paddingResize} setActive={setShowSubMenu}>
          {menuItems.pages.map((page: any) => (
            <div key={page.title}>
              {page.visible ? (
                <MenuItem
                  hasElements={page.page_submenu}
                  link={page.link || "#"}
                  setActive={setShowSubMenu}
                  active={showSubMenu}
                  item={page.title}
                >
                  {!page.page_submenu ? (
                    <div></div>
                  ) : (
                    <div className={"flex"}>
                      {page?.page_submenu && page?.page_submenu?.clubs && (
                        <div className="grid grid-cols-5 gap-4 space-y-0 text-sm z-10">
                          {page.page_submenu?.clubs.map((club: any) => (
                            <a
                              key={club.name}
                              target="_blank"
                              href={club.link}
                              rel={"noreferrer"}
                            >
                              <div className="flex mt-4 items-center justify-center flex-col">
                                <Image
                                  loading={"lazy"}
                                  src={
                                    club.image &&
                                    urlForImage(club?.image)?.url()
                                  }
                                  alt={"Agege_LoGo"}
                                  width={50}
                                  height={50}
                                />
                                <HoveredLink href={club.link || "#"}>
                                  {club.name}
                                </HoveredLink>
                              </div>
                            </a>
                          ))}
                        </div>
                      )}
                      {page?.page_submenu && page?.page_submenu.links && (
                        <div
                          className={
                            "flex flex-col justify-around items-center p-2"
                          }
                        >
                          {page.page_submenu.links.map((link: any) => (
                            <HoveredLink
                              key={link.title}
                              href={link.url || "#"}
                            >
                              {link.title}
                            </HoveredLink>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </MenuItem>
              ) : (
                <></>
              )}
            </div>
          ))}
        </Menu>
      </div>
      <Link href={"/"}>
        <Image
          id={"logo-2"}
          ref={logoRef2}
          className="scale-75 mx-5 sm:hidden md:block lg:block xl:block"
          src={second_logo && urlForImage(second_logo)?.url()}
          alt={`${title}_Logo`}
          title={title}
          width={100}
          height={100}
          onMouseEnter={() => {
            handleMouseEnter("2");
          }}
          quality={100}
          loading={"lazy"}
        />
      </Link>
      <div className="flex justify-center items-center w-[45%]">
        {menuItems?.cta.map((cta: any) => (
          <Link key={cta.href} href={cta.link}>
            <button
              className={`text-white mx-2 min-w-[100px] border-amber-50 text-sm border-2 rounded-[4px] px-2 py-2 outline-none hover:bg-white hover:text-black hover:border-black duration-[0.1s]`}
            >
              {cta.title}
            </button>
          </Link>
        ))}
      </div>
    </section>
  );
};
const MobileMainHeader = ({ menuItems, logo, title }: any) => {
  const [open, isOpen] = useState(false);
  const [toggle, setToggle] = useState("Clubs");
  const [toggleOpened, setToggleOpened] = useState(false);
  useEffect(() => {
    if (open) {
      gsap.fromTo(
        ".mobile-content",
        { y: "100%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 0.2, ease: "power2.out" },
      );
    } else {
      gsap.to(".mobile-content", {
        y: "-100%",
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [open]);
  const onToggle = () => {
    if (toggleOpened && toggle.length) {
      gsap.to(`.${toggle}`, {
        rotation: "-90",
        ease: "bounce.out",
        duration: 0.5,
      });
      setToggleOpened(false);
    } else {
      gsap.to(`.${toggle}`, {
        rotation: "30",
        ease: "bounce.out",
        duration: 0.5,
      });
      setToggleOpened(true);
    }
  };
  return (
    <section
      className={`flex flex-col justify-start items-center w-full max-h-screen ${open ? "overflow-y-auto" : "overflow-y-hidden"}`}
    >
      <div className="w-full flex justify-between bg-black px-10 relative">
        <Link href={"/"}>
          <Image
            loading={"lazy"}
            className="scale-105"
            src={logo && urlForImage(logo)?.url()}
            alt={`${title}_Logo`}
            title={title}
            width={80}
            height={80}
            quality={100}
          />
        </Link>
        {!open && (
          <Image
            onClick={() => isOpen(true)}
            src="/bars-icon.svg"
            alt="bars-icon"
            width={30}
            height={30}
          />
        )}
        {open && (
          <Image
            onClick={() => isOpen(false)}
            src="/cross-icon.svg"
            alt="cross-icon"
            width={30}
            height={30}
          />
        )}
      </div>
      {open && (
        <div
          className={`mobile-content flex flex-col bg-white z-10 w-full px-10 py-5 overflow-x-hidden h-screen  duration-[0.2s]`}
        >
          <nav>
            <ul className="list-none flex flex-col">
              {menuItems.pages.map((page: any) => (
                <div key={page.title}>
                  {page.visible && page.page_submenu ? (
                    <details
                      onClick={() => {
                        setToggle(page.title);
                        onToggle();
                      }}
                      className="toggle-arrow"
                    >
                      <summary
                        className={`flex justify-between  ${inter.className} text-lg py-3 `}
                      >
                        <Link href={page.link || "#"}>{page.title}</Link>
                        <Image
                          className={`-rotate-90 ${page.title}`}
                          src={"/black-arrow-down.svg"}
                          alt={"arrow-down"}
                          width={15}
                          height={15}
                        />
                      </summary>
                      {page.page_submenu.clubs && (
                        <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">
                          <div className="flex flex-wrap justify-center bg-white">
                            {page.page_submenu.clubs.map((club: any) => (
                              <a
                                key={club.title}
                                href={club.link || "#"}
                                target={"_blank"}
                                rel={"noreferrer"}
                              >
                                <Image
                                  className="cursor-pointer duration-[0.1s] hover:scale-125"
                                  src={
                                    club.image && urlForImage(club.image)?.url()
                                  }
                                  alt={`${club.name}_Logo`}
                                  title={club.name}
                                  width={100}
                                  height={100}
                                />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      {page.page_submenu.links && (
                        <div>
                          {page.page_submenu.links.map((link: any) => (
                            <Link key={link.url} href={link.url || "#"}>
                              <div
                                className={`flex text-md underline pl-4 py-3 ${inter.className}`}
                              >
                                {link.title}
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </details>
                  ) : (
                    page.visible && (
                      <Link href={page.link || "#"}>
                        <li className={`flex text-lg py-3 ${inter.className}`}>
                          {page.title}
                        </li>
                      </Link>
                    )
                  )}
                </div>
              ))}
            </ul>
          </nav>
{/* 
          <div className="bg-[#EEEEEE] px-5 py-5 mt-10">
            <div className="pb-2">Want to see more?</div>
            <div className="underline underline-offset-[1.5px]">
              Subscribe our social media
            </div>
          </div> */}
          <div className="mt-5 py-5 flex flex-col">
            {menuItems?.cta.map((cta: any) => (
              <Link key={cta.href} href={cta.link}>
                <button className="text-center mb-5 text-white w-full bg-black border-white border-2 outline-none duration-[0.1s] active:text-black active:bg-white active:border-black text-md font-sans-['Inter'] min-w-[250px] py-2">
                  {cta.title}
                </button>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
const SubHeader = (props: { els: any }) => {
  return (
    <section className="flex z-10 bg-white xl:px-5 xl:pl-16 lg:px-5 lg:pl-16 md:px-0 sm:px-0">
      <div className="w-[100px] xl:block lg:block md:hidden sm:hidden" />
      <div className="overflow-x-auto overflow-y-hidden flex xl:w-fit lg:w-fit xl:justify-evenly lg:justify-evenly md:justify-center sm:justify-start sm:w-full md:w-full items-center pl-4">
        {props.els?.map((el: any) => (
          <div
            key={el.href}
            className="px-8 sm:text-sm md:text-md lg:text-md xl:text-md cursor-pointer text-center py-5 relative font-sans-['Inter'] group"
          >
            <a
              href={`${el.section_reference ? "#" + el.section_reference : "#"}`}
              className="font-medium text-md"
            >
              {el.title}
            </a>
            <div className="w-full px-5 h-1.5 absolute bottom-[-10%] opacity-0 left-0 duration-[0.2s] bg-primary group-hover:opacity-100 group-hover:bottom-0" />
          </div>
        ))}
      </div>
    </section>
  );
};

const Header = (props: {
  menuItems: any;
  clubs: any;
  logo: any;
  pageId: string;
}) => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth < 950,
  );
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [active, setActive] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleResize() {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 950);
      }
    }
    function debounce(func: Function, delay: number) {
      let timeoutId: NodeJS.Timeout;
      return (...args: any) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func(...args);
        }, delay);
      };
    }
    function handleScroll() {
      if (typeof window !== "undefined") {
        const currentScrollY = window.scrollY;
        if (!isMobile) {
          if (currentScrollY > prevScrollY && currentScrollY > 350) {
            // Adjust the scroll position threshold as needed
            gsap.to("#header", {
              y: -115, // Adjust this value according to the height of your header
              duration: 0.5,
              ease: "back.out",
              className: "fixed w-full z-10 max-h-[180px] drop-shadow-md",
            });
            setActive(true);
            gsap.to("#logo", {
              scale: "1",
              duration: 0.1,
              ease: "power1.in",
              width: 80,
              height: 80,
            });
            gsap.to("#logo-2", {
              scale: "1",
              duration: 0.1,
              ease: "power1.in",
              width: 70,
              height: 70,
            });
          } else if (currentScrollY < prevScrollY || currentScrollY <= 350) {
            gsap.to("#header", {
              y: 0,
              duration: 0.2,
              ease: "power1.inOut",
              className: "w-full absolute z-10 max-h-[180px]",
            });
            gsap.to("#logo", {
              duration: 0.2,
              ease: "power1.out",
              scale: "1.25",
              width: 100,
              height: 100,
            });
            gsap.to("#logo-2", {
              scale: "0.80",
              duration: 0.2,
              ease: "power1.out",
              width: 90,
              height: 90,
            });
            setActive(false);
          }
          setPrevScrollY(currentScrollY);
        }
      }
    }
    const debouncedHandleScroll = debounce(handleScroll, 100);
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", debouncedHandleScroll);
      window.addEventListener("resize", handleResize);
    }
    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", debouncedHandleScroll);
    };
  }, [isMobile]);

  const subnav =
    props.menuItems?.pages?.find((p: any) => p.id === props.pageId)
      ?.page_subnav || [];

  return (
    // fixed here
    <header>
      <div className={"sm:block md:block lg:hidden xl:hidden"}>
        <div id="header" className="w-full fixed top-0 z-10 drop-shadow-md">
          <MobileMainHeader
            title={props.logo.title}
            logo={props.logo.logo}
            menuItems={props.menuItems}
          />
          <SubHeader els={subnav} />
        </div>
      </div>
      <div className={"sm:hidden md:hidden lg:block xl:block"}>
        <>
          <TopHeader clubs={props.clubs} />
          <div
            ref={headerRef}
            className="w-full z-10 absolute max-h-[180px]"
            id="header"
          >
            <MainHeader
              title={props.logo.title}
              logo={props.logo.logo}
              second_logo={props.logo.second_logo}
              menuItems={props.menuItems}
              paddingResize={active}
            />
            <SubHeader els={subnav} />
          </div>
        </>
      </div>
    </header>
  );
};

export default Header;
