import React , {useEffect} from "react";
import { HiOutlineMoon } from "react-icons/hi2";
import { useDarkMode } from "../hooks/userDarkMode";

export const Navbar = () => {
  const [isDark, setIsDark] = useDarkMode();
  useEffect(() => {
   
  }, [isDark])
  
  return (
    <>
      <ul className="flex gap-4 justify-between w-full px-5 mb-5 sm:px-20 dark:text-[#CBE4DE]">
        <div>
          <p>IhsanBacktesting</p>
        </div>
        <div className="flex gap-4 justify-between dark:text-[#CBE4DE]">
          {/* <li>Home</li>
          <li>About</li> */}
          <label className="cursor-pointer">
            <input
              type="checkbox"
              checked={isDark}
              onChange={(e) => setIsDark(e.target.checked)}
              className="hidden"
            />
            <HiOutlineMoon
              size={27}
              id="toggle"
              color={isDark ? "white" : "black"}
            />
          </label>
        </div>
      </ul>
    </>
  );
};
