import Image from "next/image";

export default function Footer({
	phones,
	address,
	facebookUrl,
}: {
	phones: string[];
	address: string;
	facebookUrl: string;
}) {
	return (
		<footer className="bg-[#212121] text-white">
			<div className="container-page flex flex-col md:flex-row items-center justify-between gap-8 py-8 md:py-10">
				{/* Left Group: Logo + Divider + Phone + Address */}
				<div className="flex flex-col sm:flex-row items-center gap-6 lg:gap-8 text-center sm:text-left">
					{/* Brand Logo */}
					<div className="shrink-0">
						<Image
							src="/images/footer-logo.png"
							alt="Mens Style Logo"
							width={85}
							height={65}
							className="h-auto w-[75px] sm:w-[85px] object-contain"
						/>
					</div>

					{/* Vertical divider */}
					<div className="hidden sm:block h-10 w-[1px] bg-white/20" />

					{/* Phone block */}
					<div className="flex items-center gap-3">
						<div className="w-8 h-8 rounded-none bg-[#E21C34] flex items-center justify-center text-white shrink-0">
							<svg
								className="w-4 h-4"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
							</svg>
						</div>
						<div className="text-sm font-medium leading-snug tracking-wide text-white">
							{phones.map((phone) => (
								<p key={phone}>{phone}</p>
							))}
						</div>
					</div>

					{/* Address block */}
					<div className="flex items-center gap-3">
						<div className="w-8 h-8 rounded-none bg-[#E21C34] flex items-center justify-center text-white shrink-0">
							<svg
								className="w-4 h-4"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
								<circle cx="12" cy="10" r="3" />
							</svg>
						</div>
						<div className="max-w-55 text-sm font-medium leading-snug tracking-wide text-white">
							<p>{address}</p>
						</div>
					</div>
				</div>

				{/* Right Group: Social Media Icons */}
				<div className="flex items-center gap-3 shrink-0">
					{/* Facebook */}
					<a
						href={facebookUrl}
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Facebook"
						className="w-10 h-10 rounded-xl bg-[#3D3D3D] hover:bg-[#4D4D4D] flex items-center justify-center text-white transition-colors"
					>
						<svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
							<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
						</svg>
					</a>
				</div>
			</div>
		</footer>
	);
}
