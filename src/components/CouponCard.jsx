export default function CouponCard({coupon,onApply}){

return(

<div
className="rounded-2xl border border-[#d4ff00] bg-[#d4ff00]/10 p-4 mb-3">

<div className="flex justify-between items-center">

<div>

<p className="font-bold">

{coupon.title}

</p>

<p className="text-xs text-zinc-500">

{coupon.description}

</p>

</div>

<button

onClick={()=>onApply(coupon)}

className="px-4 py-2 rounded-xl bg-[#d4ff00] font-bold"

>

Apply

</button>

</div>

<div className="mt-2">

<span className="font-black text-lg">

{coupon.code}

</span>

</div>

</div>

);

}
