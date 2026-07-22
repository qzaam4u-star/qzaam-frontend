import React, { useEffect, useState } from "react";
import SliderObject from "react-slick";
import { SALON_CATEGORIES } from "./categoryData";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./SalonCategorySlider.css";

const Slider = SliderObject.default || SliderObject; // Handle default export for react-slick

function getSlidesToShow(width) {
  if (width <= 480) return 2;
  if (width <= 768) return 2.5;
  if (width <= 1024) return 3;
  return 4;
}

export default function SalonCategorySlider({
  selectedCategory,
  onCategoryChange,
}) {
  // react-slick's built-in `responsive` breakpoints don't reliably apply on
  // the very first render (e.g. on a hard page refresh), so slidesToShow is
  // computed from the actual window width up front instead.
  const [slidesToShow, setSlidesToShow] = useState(() =>
    typeof window !== "undefined" ? getSlidesToShow(window.innerWidth) : 4
  );

  useEffect(() => {
    const handleResize = () => setSlidesToShow(getSlidesToShow(window.innerWidth));
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <div className="mb-8">
      <div className="mb-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">
          Filter by Category
        </h3>
      </div>

      <Slider key={slidesToShow} {...settings} className="salon-category-slider">
        {SALON_CATEGORIES.map((category) => (
          <div key={category.id} className="px-1">
            <button
              onClick={() => onCategoryChange(category.id)}
              className={`w-full rounded-2xl overflow-hidden transition-all transform hover:scale-105 border-2 ${
                selectedCategory === category.id
                  ? "border-[#d4ff00] shadow-[0_0_20px_rgba(212,255,0,0.3)]"
                  : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              {/* Image Background */}
              <div className="relative h-28 overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800">
                {/* Placeholder Image with Gradient Overlay */}
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />

                {/* Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.color} ${
                    selectedCategory === category.id
                      ? "opacity-0"
                      : "opacity-40"
                  } mix-blend-multiply`}
                />

                {/* Content */}
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-center text-white ${
                    selectedCategory === category.id
                      ? "backdrop-blur-none"
                      : "backdrop-blur-[2px]"
                  }`}
                >
                  <span
                    className={`text-2xl mb-1 transition-opacity duration-300 ${
                      selectedCategory === category.id
                        ? "opacity-0"
                        : "opacity-100"
                    }`}
                  >
                    {category.emoji}
                  </span>
                  <span
                    className={`text-xs font-black uppercase tracking-wider text-center px-2 transition-opacity duration-300 ${
                      selectedCategory === category.id
                        ? "opacity-0"
                        : "opacity-100"
                    }`}
                  >
                    {category.name}
                  </span>
                </div>

                {/* Selected Indicator */}
                {selectedCategory === category.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-[#d4ff00] rounded-full flex items-center justify-center text-xs font-black text-black">
                    ✓
                  </div>
                )}
              </div>
            </button>
          </div>
        ))}
      </Slider>
    </div>
  );
}
