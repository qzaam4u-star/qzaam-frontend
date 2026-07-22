import generalImage from "../../assets/categoryImages/general.png";
import hairImage from "../../assets/categoryImages/hair.png";
import skinImage from "../../assets/categoryImages/skin.png";
import nailsImage from "../../assets/categoryImages/nails.jpg";
import massageImage from "../../assets/categoryImages/massage.png";
import makeupImage from "../../assets/categoryImages/makeup.png";
import beardImage from "../../assets/categoryImages/beard.png";
/**
 * Category Data Configuration
 * Contains category names and placeholder image URLs
 * Images can be replaced with local images by updating the imagePath
 */

export const SALON_CATEGORIES = [
  {
    id: "general",
    name: "General",
    emoji: "💆",
    color: "from-blue-500 to-blue-600",
    image: generalImage,
  },
  {
    id: "hair",
    name: "Hair",
    emoji: "✂️",
    color: "from-amber-500 to-amber-600",
    image: hairImage,
  },
  {
    id: "skin",
    name: "Skin",
    emoji: "🧴",
    color: "from-pink-500 to-pink-600",
    image: skinImage,
  },
  {
    id: "nails",
    name: "Nails",
    emoji: "💅",
    color: "from-red-500 to-red-600",
    image: nailsImage,
  },
  {
    id: "massage",
    name: "Massage",
    emoji: "💆‍♂️",
    color: "from-purple-500 to-purple-600",
    image: massageImage,
  },
  {
    id: "makeup",
    name: "Makeup",
    emoji: "💄",
    color: "from-rose-500 to-rose-600",
    image: makeupImage,
  },
  {
    id: "beard",
    name: "Beard",
    emoji: "🧔",
    color: "from-gray-700 to-gray-800",
    image: beardImage,
  },
];

export default SALON_CATEGORIES;
