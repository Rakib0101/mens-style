"use client";

import content from "@/data/site.json";
import { formatPrice, toBanglaDigits } from "@/lib/format";
import type { OrderPayload } from "@/lib/types";
import type { Product } from "@/lib/db/schema";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

const BD_PHONE_RE = /^01[3-9]\d{8}$/;

const DISTRICTS = [
	"ঢাকা",
	"গাজীপুর",
	"নারায়ণগঞ্জ",
	"চট্টগ্রাম",
	"সিলেট",
	"রাজশাহী",
	"খুলনা",
	"বরিশাল",
	"রংপুর",
	"ময়মনসিংহ",
	"কুমিল্লা",
	"ফেনী",
	"ব্রাহ্মণবাড়িয়া",
	"নোয়াখালী",
	"চাঁদপুর",
	"লক্ষ্মীপুর",
	"কক্সবাজার",
	"বান্দরবান",
	"রাঙ্গামাটি",
	"খাগড়াছড়ি",
	"হবিগঞ্জ",
	"মৌলভীবাজার",
	"সুনামগঞ্জ",
	"নরসিংদী",
	"মুন্সীগঞ্জ",
	"মানিকগঞ্জ",
	"টাঙ্গাইল",
	"কিশোরগঞ্জ",
	"নেত্রকোণা",
	"শেরপুর",
	"জামালপুর",
	"ফরিদপুর",
	"মাদারীপুর",
	"শরীয়তপুর",
	"রাজবাড়ী",
	"গোপালগঞ্জ",
	"যশোর",
	"সাতক্ষীরা",
	"মাগুরা",
	"নড়াইল",
	"বাগেরহাট",
	"ঝিনাইদহ",
	"কুষ্টিয়া",
	"চুয়াডাঙ্গা",
	"মেহেরপুর",
	"পাবনা",
	"সিরাজগঞ্জ",
	"বগুড়া",
	"জয়পুরহাট",
	"নাটোর",
	"নওগাঁ",
	"চাঁপাইনবাবগঞ্জ",
	"দিনাজপুর",
	"কুড়িগ্রাম",
	"গাইবান্ধা",
	"লালমনিরহাট",
	"নীলফামারী",
	"পঞ্চগড়",
	"ঠাকুরগাঁও",
	"ভোলা",
	"পটুয়াখালী",
	"ঝালকাঠি",
	"পিরোজপুর",
	"বরগুনা",
];

type FbqFn = (...args: unknown[]) => void;

function trackLead(value: number) {
	if (typeof window === "undefined") return;
	const fbq = (window as unknown as { fbq?: FbqFn }).fbq;
	fbq?.("track", "Lead", { value, currency: "BDT" });
}

export default function OrderExperience({
	flagship,
	related,
}: {
	flagship: Product;
	related: Product[];
}) {
	const router = useRouter();
	const [selected, setSelected] = useState<Product>(flagship);
	const [size, setSize] = useState(flagship.sizes[0] ?? "M");
	const [color, setColor] = useState(flagship.colors[0]?.name ?? "কালো");
	const [qty, setQty] = useState(1);
	const [district, setDistrict] = useState("");
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");
	const [address, setAddress] = useState("");
	const [honeypot, setHoneypot] = useState("");
	const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	function selectProduct(product: Product) {
		setSelected(product);
		setSize(product.sizes[0] ?? "M");
		setColor(product.colors[0]?.name ?? "কালো");
		setQty(1);
		document
			.getElementById("order")
			?.scrollIntoView({ behavior: "smooth", block: "start" });
	}

	// Delivery charge is 80 by default (Dhaka), or 120 outside Dhaka
	const deliveryCharge = district && district !== "ঢাকা" ? 120 : 80;
	const subtotal = selected.price * qty;
	const total = subtotal + deliveryCharge;

	const isFormFilled = Boolean(
		name.trim() && phone.trim() && address.trim() && district.trim(),
	);

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (honeypot) return;

		if (!name.trim() || !phone.trim() || !address.trim() || !district.trim()) {
			setErrorMsg("অনুগ্রহ করে সব প্রয়োজনীয় তথ্য পূরণ করুন।");
			setStatus("error");
			return;
		}

		if (!BD_PHONE_RE.test(phone.trim())) {
			setErrorMsg("সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)।");
			setStatus("error");
			return;
		}

		setStatus("submitting");
		setErrorMsg(null);

		const payload: OrderPayload = {
			productSlug: selected.slug,
			productTitle: selected.title,
			size,
			color,
			qty,
			unitPrice: selected.price,
			deliveryZoneLabel: district === "ঢাকা" ? "ঢাকা" : "ঢাকার বাইরে",
			deliveryCharge,
			totalPrice: total,
			name: name.trim(),
			phone: phone.trim(),
			address: `${address.trim()}, জেলা: ${district}${email.trim() ? ` (ইমেইল: ${email.trim()})` : ""}`,
			honeypot,
		};

		try {
			const res = await fetch("/api/checkout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			const data = await res.json();
			if (!res.ok || !data.ok) throw new Error(data.error || "failed");

			trackLead(total);
			router.push("/order-success");
		} catch {
			setStatus("error");
			setErrorMsg("দুঃখিত, অর্ডারটি সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।");
		}
	}

	return (
		<>
			{/* Related styles section */}
			<section id="related" className="py-16 sm:py-20 bg-white">
				<div className="container-page text-center">
					<p className="text-sm font-semibold uppercase tracking-wide text-brand">
						{content.relatedSection.eyebrow}
					</p>
					<h2 className="mt-2 text-2xl font-bold sm:text-3xl text-ink">
						{content.relatedSection.title}
					</h2>

					<div className="mt-8 grid grid-cols-2 gap-4 text-left lg:grid-cols-4">
						{related.map((product) => (
							<button
								key={product.slug}
								type="button"
								onClick={() => selectProduct(product)}
								className={`overflow-hidden rounded-xl border bg-white text-left transition-all ${
									selected.slug === product.slug
										? "border-brand ring-2 ring-brand/20"
										: "border-[#E5E5E5] hover:border-ink/40"
								}`}
							>
								<Image
									src={product.images[0]}
									alt={product.title}
									width={600}
									height={750}
									className="aspect-4/5 w-full object-cover"
								/>
								<div className="p-3">
									<p className="line-clamp-2 text-base font-bold text-ink">
										{product.title}
									</p>
									<div className="mt-1 flex items-center justify-between gap-2">
										<span className="text-lg font-bold text-brand">
											{formatPrice(product.price)}
										</span>
										<div className="flex gap-1">
											{product.colors.map((c) => (
												<span
													key={c.name}
													className="h-3 w-3 rounded-full border border-black/10"
													style={{ background: c.hex }}
												/>
											))}
										</div>
									</div>
								</div>
							</button>
						))}
					</div>
				</div>
			</section>

			{/* 100% Figma Match Checkout Form Section */}
			<section id="order" className="scroll-mt-10 py-10 sm:py-16 bg-[#F7F7F5]">
				<div className="container-page">
					<form
						onSubmit={handleSubmit}
						className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start"
					>
						{/* Left Column: 2 Cards */}
						<div className="space-y-5">
							{/* Card 1: আপনার প্রোডাক্ট */}
							<div className="bg-white border border-[#E5E5E5] p-6 sm:p-7">
								<h2 className="text-xl font-bold text-ink mb-6">
									আপনার প্রোডাক্ট
								</h2>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
									{/* Product Main Showcase Image */}
									<div className="relative aspect-472/567 w-full overflow-hidden bg-surface-muted">
										<Image
											src={
												selected.images[0] || "/images/products/t-shirt/1.png"
											}
											alt={selected.title}
											fill
											sizes="(max-width: 768px) 100vw, 480px"
											className="object-cover object-top"
											priority
										/>
									</div>

									{/* Product Details & Selection Options */}
									<div>
										<span className="inline-block bg-[#FDEFED] text-brand text-xs font-semibold px-2.5 py-1 mb-2.5">
											নতুন কালেকশন
										</span>

										<h3 className="text-2xl sm:text-3xl font-bold text-ink leading-tight">
											{selected.title}
										</h3>

										<p className="mt-2 text-sm text-[#666666] leading-relaxed">
											{selected.subtitle || flagship.subtitle}
										</p>

										{/* Rating */}
										<div className="mt-3.5 flex items-center gap-2 text-sm">
											<div className="flex text-[#F59E0B] tracking-tight">
												★★★★★
											</div>
											<span className="font-bold text-ink">
												{toBanglaDigits(selected.ratingValue.toFixed(1))}
											</span>
											<span className="text-[#737373] text-xs font-normal">
												({toBanglaDigits(selected.ratingCount)} রিভিউ)
											</span>
										</div>

										{/* Price */}
										<div className="mt-4 flex items-baseline gap-3">
											<span className="text-3xl font-bold text-brand">
												৳{selected.price.toLocaleString("en-US")}
											</span>
											{selected.comparePrice ? (
												<span className="text-base text-[#8C8C8C] line-through">
													৳{selected.comparePrice.toLocaleString("en-US")}
												</span>
											) : null}
										</div>

										{/* Color Selector */}
										<div className="mt-5">
											<p className="text-xs font-semibold text-[#666666] mb-2.5">
												রঙ নির্বাচন করুন
											</p>
											<div className="flex items-center gap-3">
												{selected.colors.map((c) => (
													<button
														key={c.name}
														type="button"
														onClick={() => setColor(c.name)}
														className={`relative h-9 w-9 rounded-full transition-all flex items-center justify-center ${
															color === c.name
																? "ring-2 ring-brand ring-offset-2"
																: "hover:scale-105"
														}`}
														aria-label={c.name}
													>
														<span
															className="h-full w-full rounded-full border border-black/10"
															style={{ backgroundColor: c.hex }}
														/>
													</button>
												))}
											</div>
										</div>

										{/* Size Selector */}
										<div className="mt-5">
											<p className="text-xs font-semibold text-[#666666] mb-2.5">
												সাইজ নির্বাচন করুন <span className="text-brand">*</span>
											</p>
											<div className="flex items-center gap-2.5">
												{selected.sizes.map((s) => (
													<button
														key={s}
														type="button"
														onClick={() => setSize(s)}
														className={`h-12 w-12 sm:w-14 rounded-xl border text-sm font-semibold transition-all ${
															size === s
																? "border-ink bg-white text-ink ring-1 ring-ink"
																: "border-[#E5E5E5] bg-white text-ink hover:border-ink/40"
														}`}
													>
														{s}
													</button>
												))}
											</div>
										</div>

										{/* Quantity Selector */}
										<div className="mt-5 flex items-center gap-4">
											<span className="text-xs font-semibold text-[#666666]">
												পরিমাণ
											</span>
											<div className="flex items-center justify-between w-36 h-11 px-3.5 rounded-xl border border-[#E5E5E5] bg-white">
												<button
													type="button"
													onClick={() => setQty((q) => Math.max(1, q - 1))}
													className="text-lg text-[#666666] hover:text-ink transition-colors p-1"
													aria-label="Decrease quantity"
												>
													−
												</button>
												<span className="font-bold text-sm text-ink">
													{qty}
												</span>
												<button
													type="button"
													onClick={() => setQty((q) => Math.min(10, q + 1))}
													className="text-lg text-[#666666] hover:text-ink transition-colors p-1"
													aria-label="Increase quantity"
												>
													+
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Card 2: আপনার তথ্য */}
							<div className="bg-white border border-[#E5E5E5] p-6 sm:p-7">
								<h2 className="text-xl font-bold text-ink mb-5">আপনার তথ্য</h2>

								<div className="space-y-4">
									{/* Name field */}
									<div>
										<label className="block text-xs font-semibold text-[#333333] mb-1.5">
											আপনার নাম <span className="text-brand">*</span>
										</label>
										<input
											required
											type="text"
											value={name}
											onChange={(e) => setName(e.target.value)}
											placeholder="আপনার সম্পূর্ণ নাম লিখুন"
											className="w-full h-12 px-3.5 rounded-none border border-[#E5E5E5] text-sm text-ink placeholder-[#9CA3AF] outline-none focus:border-ink transition-colors"
										/>
									</div>

									{/* Phone & Email fields */}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div>
											<label className="block text-xs font-semibold text-[#333333] mb-1.5">
												মোবাইল নম্বর <span className="text-brand">*</span>
											</label>
											<input
												required
												type="tel"
												inputMode="numeric"
												value={phone}
												onChange={(e) => setPhone(e.target.value)}
												placeholder="01XXXXXXXXX"
												className="w-full h-12 px-3.5 rounded-none border border-[#E5E5E5] text-sm text-ink placeholder-[#9CA3AF] outline-none focus:border-ink transition-colors"
											/>
										</div>

										<div>
											<label className="block text-xs font-semibold text-[#333333] mb-1.5">
												ইমেইল
											</label>
											<input
												type="email"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												placeholder="আপনার ইমেইল ঠিকানা"
												className="w-full h-12 px-3.5 rounded-none border border-[#E5E5E5] text-sm text-ink placeholder-[#9CA3AF] outline-none focus:border-ink transition-colors"
											/>
										</div>
									</div>

									{/* Full Address field */}
									<div>
										<label className="block text-xs font-semibold text-[#333333] mb-1.5">
											সম্পূর্ণ ঠিকানা <span className="text-brand">*</span>
										</label>
										<textarea
											required
											rows={2}
											value={address}
											onChange={(e) => setAddress(e.target.value)}
											placeholder="বাসা/রোড, এলাকা, থানা ও জেলা লিখুন"
											className="w-full py-3 px-3.5 rounded-none border border-[#E5E5E5] text-sm text-ink placeholder-[#9CA3AF] outline-none focus:border-ink transition-colors resize-none"
										/>
									</div>

									{/* District Select field */}
									<div>
										<label className="block text-xs font-semibold text-[#333333] mb-1.5">
											জেলা <span className="text-brand">*</span>
										</label>
										<div className="relative">
											<select
												required
												value={district}
												onChange={(e) => setDistrict(e.target.value)}
												className={`w-full h-12 px-3.5 pr-10 rounded-none border border-[#E5E5E5] text-sm bg-white outline-none focus:border-ink transition-colors appearance-none cursor-pointer ${
													!district ? "text-[#9CA3AF]" : "text-ink"
												}`}
											>
												<option value="" disabled>
													জেলা নির্বাচন করুন
												</option>
												{DISTRICTS.map((d) => (
													<option key={d} value={d} className="text-ink">
														{d}
													</option>
												))}
											</select>
											<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-[#666666]">
												<svg
													className="w-4 h-4 fill-current"
													viewBox="0 0 20 20"
												>
													<path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
												</svg>
											</div>
										</div>
									</div>

									{/* Honeypot anti-spam field */}
									<input
										type="text"
										name="company"
										value={honeypot}
										onChange={(e) => setHoneypot(e.target.value)}
										tabIndex={-1}
										autoComplete="off"
										aria-hidden="true"
										className="hidden"
									/>
								</div>
							</div>
						</div>

						{/* Right Column: Card 3 - আপনার অর্ডার */}
						<div className="bg-white border border-[#E5E5E5] p-6 sm:p-7 lg:sticky lg:top-24">
							<h2 className="text-lg font-bold text-ink pb-4 border-b border-[#E5E5E5]">
								আপনার অর্ডার
							</h2>

							{/* Product row */}
							<div className="py-4 flex items-center gap-3.5">
								<div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-surface-muted">
									<Image
										src={selected.images[0] || "/images/products/t-shirt/1.png"}
										alt={selected.title}
										fill
										sizes="56px"
										className="object-cover"
									/>
								</div>
								<div className="min-w-0 flex-1">
									<p className="text-sm font-bold text-ink truncate">
										{selected.title}
									</p>
									<p className="text-xs text-[#737373] mt-0.5">
										{color || "কালো"}
									</p>
								</div>
							</div>

							{/* Price breakdown */}
							<div className="space-y-3 pt-2 pb-4 text-sm">
								<div className="flex justify-between items-center text-[#4B5563]">
									<span>প্রোডাক্ট মূল্য</span>
									<span className="font-bold text-ink">
										৳{subtotal.toLocaleString("en-US")}
									</span>
								</div>
								<div className="flex justify-between items-center text-[#4B5563]">
									<span>পরিমাণ</span>
									<span className="font-bold text-ink">× {qty}</span>
								</div>
								<div className="flex justify-between items-center text-[#4B5563]">
									<span>ডেলিভারি চার্জ</span>
									<span className="font-bold text-ink">৳{deliveryCharge}</span>
								</div>
							</div>

							{/* Total */}
							<div className="pt-4 pb-5 border-t border-[#E5E5E5] flex justify-between items-center">
								<span className="text-lg font-bold text-ink">মোট</span>
								<span className="text-2xl font-bold text-brand">
									৳{total.toLocaleString("en-US")}
								</span>
							</div>

							{/* Cash on Delivery option box */}
							<div className="border-2 border-brand rounded-none p-3.5 bg-white mb-5">
								<div className="flex items-center gap-2.5">
									<div className="w-4 h-4 rounded-full border-2 border-brand flex items-center justify-center shrink-0">
										<div className="w-2 h-2 rounded-full bg-brand" />
									</div>
									<span className="text-sm font-bold text-ink">
										ক্যাশ অন ডেলিভারি
									</span>
								</div>
								<p className="mt-1 ml-6.5 text-xs text-[#737373]">
									পণ্য হাতে পাওয়ার পর মূল্য পরিশোধ করুন।
								</p>
							</div>

							{errorMsg ? (
								<p className="mb-4 text-xs text-brand font-medium" role="alert">
									{errorMsg}
								</p>
							) : null}

							{/* Submit Button */}
							<button
								type="submit"
								disabled={status === "submitting"}
								className={`w-full py-3.5 font-bold text-base text-white rounded-none transition-all ${
									isFormFilled
										? "bg-brand hover:bg-brand-dark shadow-md cursor-pointer"
										: "bg-[#BCBCBC] hover:bg-[#A8A8A8] cursor-pointer"
								} disabled:opacity-60`}
							>
								{status === "submitting"
									? "অর্ডার হচ্ছে..."
									: `অর্ডার নিশ্চিত করুন — ৳${total.toLocaleString("en-US")}`}
							</button>

							{/* Trust & Delivery badge */}
							<div className="mt-4 text-center">
								<div className="flex items-center justify-center gap-1.5 text-xs text-[#4B5563]">
									<svg
										className="w-4 h-4 text-[#10B981] shrink-0"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clipRule="evenodd"
										/>
									</svg>
									<span>আপনার তথ্য নিরাপদ ও সুরক্ষিত</span>
								</div>
								<p className="mt-1 text-xs text-[#9CA3AF]">
									সাধারণত ২-৪ কার্যদিবসের মধ্যে ডেলিভারি।
								</p>
							</div>
						</div>
					</form>
				</div>
			</section>
		</>
	);
}
