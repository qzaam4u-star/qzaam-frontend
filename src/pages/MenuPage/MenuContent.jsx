import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils/formatCurrency";
import Button from "../../components/Button";
import QuantityStepper from "../../components/QuantityStepper";

export function MenuItem({ item }) {
  const { addItem, increment, decrement, getItemQuantity } = useCart();
  const qty = getItemQuantity(item.id);

  return (
    <div className="flex gap-4 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 hover:scale-[1.01] group shadow-sm">
      <div className="shrink-0 mt-1">
        <div className="w-5 h-5 rounded border-2 border-emerald-500 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
          <h3 className="font-semibold text-zinc-900 dark:text-white text-sm sm:text-base">
            {item.name}
          </h3>
          <span className="text-xs font-bold text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md shrink-0">
            {item.prepTime || 10} min
          </span>
        </div>
        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2 mb-2">
          {item.description || item.category}
        </p>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <span className="text-zinc-900 dark:text-white font-bold">
            {formatCurrency(item.price)}
          </span>
          {qty === 0 ? (
            <Button
              size="sm"
              onClick={() => addItem(item)}
              className="shrink-0"
            >
              + Add
            </Button>
          ) : (
            <QuantityStepper
              quantity={qty}
              onIncrement={() => increment(item.id)}
              onDecrement={() => decrement(item.id)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function MenuContent({
  items,
  activeCategory,
  onCategoryChange,
  categories,
}) {
  const filtered =
    activeCategory === "All"
      ? items || []
      : (items || []).filter((i) => i.category === activeCategory);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      {items.length === 0 ? (
        <div className="py-20 text-center">
          <div className="text-4xl mb-4">🍽️</div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            Menu not available
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            This vendor hasn't added any items yet.
          </p>
        </div>
      ) : (
        <>
          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={[
                  "shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all",
                  activeCategory === cat
                    ? "bg-[#8cb800] dark:bg-[#d4ff00] text-white dark:text-black shadow-[0_0_20px_rgba(140,184,0,0.2)] dark:shadow-[0_0_20px_rgba(212,255,0,0.2)]"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-700",
                ].join(" ")}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Item List */}
          <p className="text-xs text-zinc-600 mb-4 font-medium uppercase tracking-wider">
            {filtered.length} item{filtered.length !== 1 ? "s" : ""} in{" "}
            {activeCategory}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.length === 0 ? (
              <div className="py-20 text-center col-span-full">
                <p className="text-zinc-500 font-medium">
                  No items found in this category.
                </p>
              </div>
            ) : (
              filtered.map((item) => <MenuItem key={item.id} item={item} />)
            )}
          </div>
        </>
      )}
    </div>
  );
}
