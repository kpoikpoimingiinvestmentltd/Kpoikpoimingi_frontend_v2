import type React from "react";
import { twMerge } from "tailwind-merge";

export const IconWrapper = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
	<span className={`${twMerge("text-lg", className)} flex items-center justify-center`}>{children}</span>
);

export const DashboardIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<path
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={1.5}
			d="M8.557 2.75H4.682A1.93 1.93 0 0 0 2.75 4.682v3.875a1.94 1.94 0 0 0 1.932 1.942h3.875a1.94 1.94 0 0 0 1.942-1.942V4.682A1.94 1.94 0 0 0 8.557 2.75m10.761 0h-3.875a1.94 1.94 0 0 0-1.942 1.932v3.875a1.943 1.943 0 0 0 1.942 1.942h3.875a1.94 1.94 0 0 0 1.932-1.942V4.682a1.93 1.93 0 0 0-1.932-1.932m0 10.75h-3.875a1.94 1.94 0 0 0-1.942 1.933v3.875a1.94 1.94 0 0 0 1.942 1.942h3.875a1.94 1.94 0 0 0 1.932-1.942v-3.875a1.93 1.93 0 0 0-1.932-1.932M8.557 13.5H4.682a1.943 1.943 0 0 0-1.932 1.943v3.875a1.93 1.93 0 0 0 1.932 1.932h3.875a1.94 1.94 0 0 0 1.942-1.932v-3.875a1.94 1.94 0 0 0-1.942-1.942"></path>
	</svg>
);

export const UserIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
			<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
			<circle cx={12} cy={7} r={4}></circle>
		</g>
	</svg>
);
export const UsersIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<path
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M5 7a4 4 0 1 0 8 0a4 4 0 1 0-8 0M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2m1-17.87a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.85"></path>
	</svg>
);

export const CustomersIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 36 36">
		<path
			fill="currentColor"
			d="M17.9 17.3c2.7 0 4.8-2.2 4.8-4.9s-2.2-4.8-4.9-4.8S13 9.8 13 12.4c0 2.7 2.2 4.9 4.9 4.9m-.1-7.7q.15 0 0 0c1.6 0 2.9 1.3 2.9 2.9s-1.3 2.8-2.9 2.8S15 14 15 12.5c0-1.6 1.3-2.9 2.8-2.9"
			className="clr-i-outline clr-i-outline-path-1"
			strokeWidth={0.4}
			stroke="currentColor"></path>
		<path
			fill="currentColor"
			d="M32.7 16.7c-1.9-1.7-4.4-2.6-7-2.5h-.8q-.3 1.2-.9 2.1c.6-.1 1.1-.1 1.7-.1c1.9-.1 3.8.5 5.3 1.6V25h2v-8z"
			className="clr-i-outline clr-i-outline-path-2"
			strokeWidth={0.4}
			stroke="currentColor"></path>
		<path
			fill="currentColor"
			d="M23.4 7.8c.5-1.2 1.9-1.8 3.2-1.3c1.2.5 1.8 1.9 1.3 3.2c-.4.9-1.3 1.5-2.2 1.5c-.2 0-.5 0-.7-.1c.1.5.1 1 .1 1.4v.6c.2 0 .4.1.6.1c2.5 0 4.5-2 4.5-4.4c0-2.5-2-4.5-4.4-4.5c-1.6 0-3 .8-3.8 2.2c.5.3 1 .7 1.4 1.3"
			className="clr-i-outline clr-i-outline-path-3"
			strokeWidth={0.4}
			stroke="currentColor"></path>
		<path
			fill="currentColor"
			d="M12 16.4q-.6-.9-.9-2.1h-.8c-2.6-.1-5.1.8-7 2.4L3 17v8h2v-7.2c1.6-1.1 3.4-1.7 5.3-1.6c.6 0 1.2.1 1.7.2"
			className="clr-i-outline clr-i-outline-path-4"
			strokeWidth={0.4}
			stroke="currentColor"></path>
		<path
			fill="currentColor"
			d="M10.3 13.1c.2 0 .4 0 .6-.1v-.6c0-.5 0-1 .1-1.4c-.2.1-.5.1-.7.1c-1.3 0-2.4-1.1-2.4-2.4S9 6.3 10.3 6.3c1 0 1.9.6 2.3 1.5c.4-.5 1-1 1.5-1.4c-1.3-2.1-4-2.8-6.1-1.5s-2.8 4-1.5 6.1c.8 1.3 2.2 2.1 3.8 2.1"
			className="clr-i-outline clr-i-outline-path-5"
			strokeWidth={0.4}
			stroke="currentColor"></path>
		<path
			fill="currentColor"
			d="m26.1 22.7l-.2-.3c-2-2.2-4.8-3.5-7.8-3.4c-3-.1-5.9 1.2-7.9 3.4l-.2.3v7.6c0 .9.7 1.7 1.7 1.7h12.8c.9 0 1.7-.8 1.7-1.7v-7.6zm-2 7.3H12v-6.6c1.6-1.6 3.8-2.4 6.1-2.4c2.2-.1 4.4.8 6 2.4z"
			className="clr-i-outline clr-i-outline-path-6"
			strokeWidth={0.4}
			stroke="currentColor"></path>
		<path fill="none" d="M0 0h36v36H0z"></path>
	</svg>
);

export const ContractIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<g fill="none" stroke="currentColor" strokeWidth={1.5}>
			<path d="m18.18 8.04l.463-.464a1.966 1.966 0 1 1 2.781 2.78l-.463.464M18.18 8.04s.058.984.927 1.853s1.854.927 1.854.927M18.18 8.04l-4.26 4.26c-.29.288-.434.433-.558.592q-.22.282-.374.606c-.087.182-.151.375-.28.762l-.413 1.24l-.134.401m8.8-5.081l-4.26 4.26c-.29.29-.434.434-.593.558q-.282.22-.606.374c-.182.087-.375.151-.762.28l-1.24.413l-.401.134m0 0l-.401.134a.53.53 0 0 1-.67-.67l.133-.402m.938.938l-.938-.938"></path>
			<path
				strokeLinecap="round"
				d="M8 13h2.5M8 9h6.5M8 17h1.5M19.828 3.172C18.657 2 16.771 2 13 2h-2C7.229 2 5.343 2 4.172 3.172S3 6.229 3 10v4c0 3.771 0 5.657 1.172 6.828S7.229 22 11 22h2c3.771 0 5.657 0 6.828-1.172c.944-.943 1.127-2.348 1.163-4.828"></path>
		</g>
	</svg>
);

export const PropertiesIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256">
		<path
			fill="currentColor"
			d="M240 208h-16V96a16 16 0 0 0-16-16h-64V32a16 16 0 0 0-24.88-13.32L39.12 72A16 16 0 0 0 32 85.34V208H16a8 8 0 0 0 0 16h224a8 8 0 0 0 0-16M208 96v112h-64V96ZM48 85.34L128 32v176H48ZM112 112v16a8 8 0 0 1-16 0v-16a8 8 0 1 1 16 0m-32 0v16a8 8 0 0 1-16 0v-16a8 8 0 1 1 16 0m0 56v16a8 8 0 0 1-16 0v-16a8 8 0 0 1 16 0m32 0v16a8 8 0 0 1-16 0v-16a8 8 0 0 1 16 0"></path>
	</svg>
);

export const WarnIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256">
		<path
			fill="currentColor"
			d="M120 136V80a8 8 0 0 1 16 0v56a8 8 0 0 1-16 0m112-44.45v72.9a15.86 15.86 0 0 1-4.69 11.31l-51.55 51.55a15.86 15.86 0 0 1-11.31 4.69h-72.9a15.86 15.86 0 0 1-11.31-4.69l-51.55-51.55A15.86 15.86 0 0 1 24 164.45v-72.9a15.86 15.86 0 0 1 4.69-11.31l51.55-51.55A15.86 15.86 0 0 1 91.55 24h72.9a15.86 15.86 0 0 1 11.31 4.69l51.55 51.55A15.86 15.86 0 0 1 232 91.55m-16 0L164.45 40h-72.9L40 91.55v72.9L91.55 216h72.9L216 164.45ZM128 160a12 12 0 1 0 12 12a12 12 0 0 0-12-12"
			strokeWidth={5}
			stroke="currentColor"></path>
	</svg>
);

export const ReportIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32">
		<path fill="currentColor" d="M15 20h2v4h-2zm5-2h2v6h-2zm-10-4h2v10h-2z" strokeWidth={0.4} stroke="currentColor"></path>
		<path
			fill="currentColor"
			d="M25 5h-3V4a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v1H7a2 2 0 0 0-2 2v21a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2M12 4h8v4h-8Zm13 24H7V7h3v3h12V7h3Z"
			strokeWidth={0.4}
			stroke="currentColor"></path>
	</svg>
);

export const CardIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<g fill="none">
			<path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path>
			<path
				fill="currentColor"
				d="M19 4a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3zm1 6H4v7a1 1 0 0 0 .883.993L5 18h14a1 1 0 0 0 .993-.883L20 17zm-3 3a1 1 0 0 1 .117 1.993L17 15h-3a1 1 0 0 1-.117-1.993L14 13zm2-7H5a1 1 0 0 0-1 1v1h16V7a1 1 0 0 0-1-1"></path>
		</g>
	</svg>
);

export const CalculatorIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="0.75em" height="1em" viewBox="0 0 384 512">
		<path
			fill="currentColor"
			d="M64 0C28.7 0 0 28.7 0 64v384c0 35.3 28.7 64 64 64h256c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64zm32 64h192c17.7 0 32 14.3 32 32v32c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V96c0-17.7 14.3-32 32-32m16 168a24 24 0 1 1-48 0a24 24 0 1 1 48 0m80 24a24 24 0 1 1 0-48a24 24 0 1 1 0 48m128-24a24 24 0 1 1-48 0a24 24 0 1 1 48 0M88 352a24 24 0 1 1 0-48a24 24 0 1 1 0 48m128-24a24 24 0 1 1-48 0a24 24 0 1 1 48 0m80 24a24 24 0 1 1 0-48a24 24 0 1 1 0 48M64 424c0-13.3 10.7-24 24-24h112c13.3 0 24 10.7 24 24s-10.7 24-24 24H88c-13.3 0-24-10.7-24-24m232-24c13.3 0 24 10.7 24 24s-10.7 24-24 24s-24-10.7-24-24s10.7-24 24-24"
			strokeWidth={13}
			stroke="currentColor"></path>
	</svg>
);

export const AuditIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
		<g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth={4}>
			<path d="m8 36l.005-7.957a1 1 0 0 1 1-1h10.002c.922 0 .917-.818.917-2.764s-4.902-3.585-4.902-10.426S20.1 5 24.32 5s8.817 2.012 8.817 8.853s-4.876 7.929-4.876 10.426s0 2.764.78 2.764h9.96a1 1 0 0 1 1 1V36z"></path>
			<path strokeLinecap="round" d="M8 42h32"></path>
		</g>
	</svg>
);

export const PayoutIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9}>
			<path d="M.75 14.25v9m0-1.5h16.5a3 3 0 0 0-3-3H10.5a3 3 0 0 0-3-3H.75m6 3h3.75M6.63.75h15.24a1.4 1.4 0 0 1 1.38 1.41v8.68a1.4 1.4 0 0 1-1.38 1.41H6.63a1.4 1.4 0 0 1-1.38-1.41V2.16A1.4 1.4 0 0 1 6.63.75"></path>
			<path d="M12 6.5a2.25 2.25 0 1 0 4.5 0a2.25 2.25 0 0 0-4.5 0M8 4h1.5M19 9h1.5"></path>
		</g>
	</svg>
);

export const LogoutIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<path fill="currentColor" d="m17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5M4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4z"></path>
	</svg>
);

export const SettingIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 24 24">
		<g fill="none" stroke="currentColor" strokeWidth={1.5}>
			<circle cx={12} cy={12} r={3}></circle>
			<path d="M13.765 2.152C13.398 2 12.932 2 12 2s-1.398 0-1.765.152a2 2 0 0 0-1.083 1.083c-.092.223-.129.484-.143.863a1.62 1.62 0 0 1-.79 1.353a1.62 1.62 0 0 1-1.567.008c-.336-.178-.579-.276-.82-.308a2 2 0 0 0-1.478.396C4.04 5.79 3.806 6.193 3.34 7s-.7 1.21-.751 1.605a2 2 0 0 0 .396 1.479c.148.192.355.353.676.555c.473.297.777.803.777 1.361s-.304 1.064-.777 1.36c-.321.203-.529.364-.676.556a2 2 0 0 0-.396 1.479c.052.394.285.798.75 1.605c.467.807.7 1.21 1.015 1.453a2 2 0 0 0 1.479.396c.24-.032.483-.13.819-.308a1.62 1.62 0 0 1 1.567.008c.483.28.77.795.79 1.353c.014.38.05.64.143.863a2 2 0 0 0 1.083 1.083C10.602 22 11.068 22 12 22s1.398 0 1.765-.152a2 2 0 0 0 1.083-1.083c.092-.223.129-.483.143-.863c.02-.558.307-1.074.79-1.353a1.62 1.62 0 0 1 1.567-.008c.336.178.579.276.819.308a2 2 0 0 0 1.479-.396c.315-.242.548-.646 1.014-1.453s.7-1.21.751-1.605a2 2 0 0 0-.396-1.479c-.148-.192-.355-.353-.676-.555A1.62 1.62 0 0 1 19.562 12c0-.558.304-1.064.777-1.36c.321-.203.529-.364.676-.556a2 2 0 0 0 .396-1.479c-.052-.394-.285-.798-.75-1.605c-.467-.807-.7-1.21-1.015-1.453a2 2 0 0 0-1.479-.396c-.24.032-.483.13-.82.308a1.62 1.62 0 0 1-1.566-.008a1.62 1.62 0 0 1-.79-1.353c-.014-.38-.05-.64-.143-.863a2 2 0 0 0-1.083-1.083Z"></path>
		</g>
	</svg>
);

export const BlockedUserIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
			<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
			<circle cx={9} cy={7} r={4}></circle>
			<path d="m17 8l5 5m0-5l-5 5"></path>
		</g>
	</svg>
);

export const ActiveUserIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
			<path d="m16 11l2 2l4-4m-6 12v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
			<circle cx={9} cy={7} r={4}></circle>
		</g>
	</svg>
);

export const InactiveUserIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
			<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
			<circle cx={9} cy={7} r={4}></circle>
			<path d="M22 11h-6"></path>
		</g>
	</svg>
);

export const EditIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<path
			fill="currentColor"
			d="m19.71 8.04l-2.34 2.33l-3.75-3.75l2.34-2.33c.39-.39 1.04-.39 1.41 0l2.34 2.34c.39.37.39 1.02 0 1.41M3 17.25L13.06 7.18l3.75 3.75L6.75 21H3zM16.62 5.04l-1.54 1.54l2.34 2.34l1.54-1.54zM15.36 11L13 8.64l-9 9.02V20h2.34z"
			strokeWidth="0.5"
			stroke="currentColor"
		/>
	</svg>
);

export const SuspendUserIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<path
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0-8 0M6 21v-2a4 4 0 0 1 4-4h3.5m3.5 2v5m4-5v5"></path>
	</svg>
);

export const WarnUserIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<g fill="none" fillRule="evenodd">
			<path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"></path>
			<path
				fill="currentColor"
				d="M11 2a5 5 0 1 0 0 10a5 5 0 0 0 0-10M8 7a3 3 0 1 1 6 0a3 3 0 0 1-6 0M4 18.5c0-.18.09-.489.413-.899c.316-.4.804-.828 1.451-1.222C7.157 15.589 8.977 15 11 15q.563 0 1.105.059a1 1 0 1 0 .211-1.99A13 13 0 0 0 11 13c-2.395 0-4.575.694-6.178 1.672c-.8.488-1.484 1.064-1.978 1.69C2.358 16.976 2 17.713 2 18.5c0 .845.411 1.511 1.003 1.986c.56.45 1.299.748 2.084.956C6.665 21.859 8.771 22 11 22l.685-.005a1 1 0 1 0-.027-2L11 20c-2.19 0-4.083-.143-5.4-.492c-.663-.175-1.096-.382-1.345-.582C4.037 18.751 4 18.622 4 18.5m12-.5a1 1 0 0 1 1-1h.99c.558 0 1.01.452 1.01 1.01v2.124A1 1 0 0 1 18.5 22h-.49A1.01 1.01 0 0 1 17 20.99V19a1 1 0 0 1-1-1m2-4a1 1 0 0 0-.117 1.993l.119.007a1 1 0 0 0 .117-1.993z"
				strokeWidth={0.1}
				stroke="currentColor"></path>
		</g>
	</svg>
);

export const ChevronDownIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<path
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={1.9}
			d="m4 8.417l6.587 6.587a2.013 2.013 0 0 0 2.826 0L20 8.417"></path>
	</svg>
);

export const EmptyBoxIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32">
		<path
			fill="currentColor"
			d="M20 21h-8a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2m-8-4v2h8v-2Z"
			strokeWidth={0.2}
			stroke="currentColor"></path>
		<path
			fill="currentColor"
			d="M28 4H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2v16a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m-2 24H6V12h20Zm2-18H4V6h24z"
			strokeWidth={0.2}
			stroke="currentColor"></path>
	</svg>
);

export const UploadImageIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth={1.5}>
			<path strokeLinejoin="round" d="M21.25 13V8.5a5 5 0 0 0-5-5h-8.5a5 5 0 0 0-5 5v7a5 5 0 0 0 5 5h6.26"></path>
			<path
				strokeLinejoin="round"
				d="m3.01 17l2.74-3.2a2.2 2.2 0 0 1 2.77-.27a2.2 2.2 0 0 0 2.77-.27l2.33-2.33a4 4 0 0 1 5.16-.43l2.47 1.91M8.01 10.17a1.66 1.66 0 1 0-.02-3.32a1.66 1.66 0 0 0 .02 3.32"></path>
			<path strokeMiterlimit={10} d="M18.707 15v5"></path>
			<path strokeLinejoin="round" d="m21 17.105l-1.967-1.967a.46.46 0 0 0-.652 0l-1.967 1.967"></path>
		</g>
	</svg>
);

export const DebtIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
			<path d="M3 10V8a2 2 0 0 1 2-2h2m-4 4c1.333 0 4-.8 4-4m-4 4v4m18-4V8a2 2 0 0 0-2-2h-2m4 4c-1.333 0-4-.8-4-4m4 4v4M7 6h10M3 14v2a2 2 0 0 0 2 2h2m-4-4c1.333 0 4 .8 4 4m0 0h4"></path>
			<circle cx={12} cy={12} r={2}></circle>
			<path d="M15 18h6"></path>
		</g>
	</svg>
);

export const AllSubscriptionIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<path fill="currentColor" d="M20 8H4V6h16Zm-2-6H6v2h12Zm-7.688 19.1l-3.3-3.3l1.4-1.4l1.9 1.9l5.3-5.3l1.4 1.4Z"></path>
		<path fill="currentColor" d="M22 10H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V12a2 2 0 0 0-2-2m0 12H2V12h20Z"></path>
	</svg>
);

export const ActiveSubscriptionIcon = () => (
	// 	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
	// 	<path fill="currentColor" d="m11.602 13.76l1.412 1.412l8.466-8.466l1.414 1.415l-9.88 9.88l-6.364-6.365l1.414-1.414l2.125 2.125zm.002-2.828l4.952-4.953l1.41 1.41l-4.952 4.953zm-2.827 5.655L7.364 18L1 11.636l1.414-1.414l1.413 1.413l-.001.001z"></path>
	// </svg>
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<g fill="none" stroke="currentColor" strokeWidth={2}>
			<path strokeLinecap="round" strokeLinejoin="round" d="m8 12.5l3 3l5-6"></path>
			<circle cx={12} cy={12} r={10}></circle>
		</g>
	</svg>
);

export const InactiveSubscriptionIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<path
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0m2.7-6.3l12.6 12.6"></path>
	</svg>
);

export const CancelledSubscriptionIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<g fill="none" stroke="currentColor" strokeWidth={1.9}>
			<circle cx={12} cy={12} r={9.25}></circle>
			<path strokeLinecap="round" d="m8.875 8.875l6.25 6.25m0-6.25l-6.25 6.25"></path>
		</g>
	</svg>
);

export const SearchIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<path
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeMiterlimit={10}
			strokeWidth={1.9}
			d="m21 21l-4-4m2-6a8 8 0 1 1-16 0a8 8 0 0 1 16 0"></path>
	</svg>
);

export const NotificationIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<path
			fill="currentColor"
			fillRule="evenodd"
			d="M12 1.25A7.75 7.75 0 0 0 4.25 9v.704a3.53 3.53 0 0 1-.593 1.958L2.51 13.385c-1.334 2-.316 4.718 2.003 5.35q1.133.309 2.284.523l.002.005C7.567 21.315 9.622 22.75 12 22.75s4.433-1.435 5.202-3.487l.002-.005a29 29 0 0 0 2.284-.523c2.319-.632 3.337-3.35 2.003-5.35l-1.148-1.723a3.53 3.53 0 0 1-.593-1.958V9A7.75 7.75 0 0 0 12 1.25m3.376 18.287a28.5 28.5 0 0 1-6.753 0c.711 1.021 1.948 1.713 3.377 1.713s2.665-.692 3.376-1.713M5.75 9a6.25 6.25 0 1 1 12.5 0v.704c0 .993.294 1.964.845 2.79l1.148 1.723a2.02 2.02 0 0 1-1.15 3.071a26.96 26.96 0 0 1-14.187 0a2.02 2.02 0 0 1-1.15-3.07l1.15-1.724a5.03 5.03 0 0 0 .844-2.79z"
			clipRule="evenodd"
			strokeWidth="0.1"
			stroke="currentColor"
		/>
	</svg>
);

export const EyeIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<g fill="none" stroke="currentColor" strokeWidth={1.9}>
			<path d="M3.275 15.296C2.425 14.192 2 13.639 2 12c0-1.64.425-2.191 1.275-3.296C4.972 6.5 7.818 4 12 4s7.028 2.5 8.725 4.704C21.575 9.81 22 10.361 22 12c0 1.64-.425 2.191-1.275 3.296C19.028 17.5 16.182 20 12 20s-7.028-2.5-8.725-4.704Z"></path>
			<path d="M15 12a3 3 0 1 1-6 0a3 3 0 0 1 6 0Z"></path>
		</g>
	</svg>
);

export const ThreeDotsIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
		<path
			fill="currentColor"
			d="M9.5 13a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0"></path>
	</svg>
);

export const PastIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<path fill="currentColor" d="M2 2h5v2H4v3H2zm9 0h5v5h-2V4h-3zM9 9h13v13H9zm2 2v9h9v-9zm-7-1v3h3v2H2v-5z"></path>
	</svg>
);

export const LiveIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<path
			fill="currentColor"
			d="M6.343 4.938a1 1 0 0 1 0 1.415a8.003 8.003 0 0 0 0 11.317a1 1 0 1 1-1.414 1.414c-3.907-3.906-3.907-10.24 0-14.146a1 1 0 0 1 1.414 0m12.732 0c3.906 3.907 3.906 10.24 0 14.146a1 1 0 0 1-1.415-1.414a8.003 8.003 0 0 0 0-11.317a1 1 0 0 1 1.415-1.415M9.31 7.812a1 1 0 0 1 0 1.414a3.92 3.92 0 0 0 0 5.544a1 1 0 1 1-1.415 1.414a5.92 5.92 0 0 1 0-8.372a1 1 0 0 1 1.415 0m6.958 0a5.92 5.92 0 0 1 0 8.372a1 1 0 0 1-1.414-1.414a3.92 3.92 0 0 0 0-5.544a1 1 0 0 1 1.414-1.414m-4.186 2.77a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3"></path>
	</svg>
);

export const UpcomingIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<path
			fill="currentColor"
			d="M4 21q-.825 0-1.412-.587T2 19v-5q0-.825.588-1.412T4 12h4.15q.375 0 .65.25t.325.6q.125.85 1 1.5T12 15t1.875-.65t1-1.5q.05-.35.325-.6t.65-.25H20q.825 0 1.413.588T22 14v5q0 .825-.587 1.413T20 21zm0-2h16v-5h-3.4q-.625 1.375-1.862 2.188T12 17t-2.738-.812T7.4 14H4zm12.9-8.9q-.275-.275-.275-.7t.275-.7l2.15-2.15q.275-.275.7-.275t.7.275t.275.7t-.275.7L18.3 10.1q-.275.275-.7.275t-.7-.275m-9.8 0q-.275.275-.7.275t-.7-.275L3.55 7.95q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275L7.1 8.7q.275.275.275.7t-.275.7M12 8q-.425 0-.713-.288T11 7V4q0-.425.288-.712T12 3t.713.288T13 4v3q0 .425-.288.713T12 8M4 19h16z"></path>
	</svg>
);

export const FilterIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 12 12">
		<path
			fill="currentColor"
			d="M1 2.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m2 3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5M5 8a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z"
			strokeWidth={0.2}
			stroke="currentColor"></path>
	</svg>
);

export const CloseIcon = () => (
	<svg width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
		<line x1="18" y1="6" x2="6" y2="18" />
		<line x1="6" y1="6" x2="18" y2="18" />
	</svg>
);

export const MenuIcon = () => (
	<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
		<line x1="3" y1="12" x2="21" y2="12" />
		<line x1="3" y1="6" x2="21" y2="6" />
		<line x1="3" y1="18" x2="21" y2="18" />
	</svg>
);

export const ReceiptIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
		<path
			fill="currentColor"
			d="M6 10.25A4.25 4.25 0 0 1 10.25 6h19.5A4.25 4.25 0 0 1 34 10.25V28h8v7.75A6.25 6.25 0 0 1 35.75 42h-23.5A6.25 6.25 0 0 1 6 35.75zM34 39.5h1.75a3.75 3.75 0 0 0 3.75-3.75V30.5H34zm-2.5-29.25a1.75 1.75 0 0 0-1.75-1.75h-19.5a1.75 1.75 0 0 0-1.75 1.75v25.5a3.75 3.75 0 0 0 3.75 3.75H31.5zM14.25 14a1.25 1.25 0 1 0 0 2.5h11.5a1.25 1.25 0 1 0 0-2.5zM13 24.25c0-.69.56-1.25 1.25-1.25h11.5a1.25 1.25 0 1 1 0 2.5h-11.5c-.69 0-1.25-.56-1.25-1.25M14.25 32a1.25 1.25 0 1 0 0 2.5h5.5a1.25 1.25 0 1 0 0-2.5z"
			strokeWidth="1"
			stroke="currentColor"
		/>
	</svg>
);

export const ReceiptPlusIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20">
		<path
			fill="currentColor"
			d="M4 5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v7h3v2a3 3 0 0 1-3 3h-4.6q.244-.476.393-1H14V5a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v4.022a5.5 5.5 0 0 0-1 .185zm7.5 5H8.663a5.5 5.5 0 0 0-1.584-.77A.5.5 0 0 1 7.5 9h4a.5.5 0 0 1 0 1m3.5 6a2 2 0 0 0 2-2v-1h-2zM7 6.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m3 8a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0m-4-2a.5.5 0 0 0-1 0V14H3.5a.5.5 0 0 0 0 1H5v1.5a.5.5 0 0 0 1 0V15h1.5a.5.5 0 0 0 0-1H6z"
			strokeWidth="0.5"
			stroke="currentColor"
		/>
	</svg>
);

export const CartIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
			<circle cx="9.549" cy="19.049" r="1.701" />
			<circle cx="16.96" cy="19.049" r="1.701" />
			<path d="m5.606 5.555l2.01 6.364c.309.978.463 1.467.76 1.829c.26.32.599.567.982.72c.435.173.947.173 1.973.173h3.855c1.026 0 1.538 0 1.972-.173c.384-.153.722-.4.983-.72c.296-.362.45-.851.76-1.829l.409-1.296l.24-.766l.331-1.05a2.5 2.5 0 0 0-2.384-3.252zm0 0l-.011-.037a7 7 0 0 0-.14-.42a2.92 2.92 0 0 0-2.512-1.84C2.84 3.25 2.727 3.25 2.5 3.25" />
		</g>
	</svg>
);

export const ArrowLeftIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<path
			fill="currentColor"
			fillRule="evenodd"
			d="M10.53 5.47a.75.75 0 0 1 0 1.06l-4.72 4.72H20a.75.75 0 0 1 0 1.5H5.81l4.72 4.72a.75.75 0 1 1-1.06 1.06l-6-6a.75.75 0 0 1 0-1.06l6-6a.75.75 0 0 1 1.06 0"
			clipRule="evenodd"
			strokeWidth={0.5}
			stroke="currentColor"></path>
	</svg>
);

export const ChevronLeftIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
		<path
			fill="currentColor"
			d="M9.78 12.78a.75.75 0 0 1-1.06 0L4.47 8.53a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.042.018a.75.75 0 0 1 .018 1.042L6.06 8l3.72 3.72a.75.75 0 0 1 0 1.06"
			strokeWidth={0.5}
			stroke="currentColor"></path>
	</svg>
);

export const MoneyIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 15 15">
		<path
			fill="none"
			stroke="currentColor"
			d="M0 12.5h15m-15 2h15M2.5 4V2.5H4m7 0h1.5V4m-10 3v1.5H4m7 0h1.5V7m-5 .5a2 2 0 1 1 0-4a2 2 0 0 1 0 4Zm-6-7h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-12a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Z"
			strokeWidth={1}></path>
	</svg>
);

export const HoldingMoney = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<g fill="currentColor" fillRule="evenodd" clipRule="evenodd" strokeWidth={0.5} stroke="currentColor">
			<path d="M7.36 13.855a.33.33 0 0 0-.4-.24H4.885a4.4 4.4 0 0 0-1.537.26a.28.28 0 0 0-.232.225a.3.3 0 0 0 .003.114a.28.28 0 0 0 .329.24a6 6 0 0 1 1.198.239q.289.024.579 0q.297-.002.589-.06q.673-.136 1.307-.4a.34.34 0 0 0 .24-.379m8.513 2.626a4.6 4.6 0 0 0-1.657-.06c0-.22-.05-.44-.08-.66c-.05-.398-.12-.788-.18-1.187h1.218a.28.28 0 0 0 .32-.25a.29.29 0 0 0-.25-.329l-1.177-.09h-.2c0-.27-.08-.529-.11-.798a.3.3 0 0 0-.294-.354a.3.3 0 0 0-.295.354c0 .3 0 .599-.05.898a4.6 4.6 0 0 0-2.126.929a1.43 1.43 0 0 0-.36 1.696c.16.35.44.63.79.789a3.1 3.1 0 0 0 1.387.24h.429c0 .18 0 .359.07.529c.07.399.16.798.24 1.187h-.53a4.3 4.3 0 0 1-2.016-.778a.334.334 0 0 0-.42.519a5.3 5.3 0 0 0 2.347.998c.289.05.579.07.858.09l.15.619a.33.33 0 0 0 .379.28a.34.34 0 0 0 .28-.39v-.52q.475-.02.938-.139a3.1 3.1 0 0 0 1.567-.998a1.39 1.39 0 0 0 .17-1.527a1.94 1.94 0 0 0-1.398-1.048m-3.124.09a2.2 2.2 0 0 1-.769-.05a.66.66 0 0 1-.449-.3c-.19-.37 0-.649.35-.878a4.1 4.1 0 0 1 1.207-.57v1.767zm3.324 1.996a2.4 2.4 0 0 1-.889.549q-.36.12-.738.16c0-.42 0-.839-.08-1.258v-.52q.474-.036.948 0a1.1 1.1 0 0 1 .998.52c.02.21-.09.4-.24.569z"></path>
			<path d="M20.576 16.12a5.4 5.4 0 0 0-.71-1.487a16 16 0 0 0-1.207-1.507c.402-.15.737-.436.948-.809a1.94 1.94 0 0 0 .07-1.677q.233-.1.43-.26a1.996 1.996 0 0 0 .09-2.594a1.32 1.32 0 0 0 .678-1.328a2.44 2.44 0 0 0-1.457-1.437a3 3 0 0 0-.61-.22q-.307-.09-.628-.12q-.96-.013-1.917.07l-.658.06a1 1 0 0 0-.19-.09l-.928-.24c-.26 0-.52-.11-.789-.14a4 4 0 0 0-.609 0a4.3 4.3 0 0 0-1.627.68c-1.108.738-2.455 1.856-2.864 2.206c-.29.213-.639.335-.999.349H5.693a.28.28 0 0 0-.3.27a.29.29 0 0 0 .28.309c.774.103 1.556.136 2.336.1a2.4 2.4 0 0 0 1.068-.38c.409-.27 1.507-1.068 2.525-1.706c.468-.36 1-.627 1.567-.789q.2-.022.4 0c.239 0 .479.09.708.13l.719.21c.28.1.479.209.519.389s-.1.29-.33.449a2.6 2.6 0 0 1-.888.439q-.541.13-1.098.17a.49.49 0 0 0-.46.509q.015.12 0 .24a2.7 2.7 0 0 1-.588 1.906a3.25 3.25 0 0 1-2.096.998a.33.33 0 0 0-.29.37a.32.32 0 0 0 .3.289c-.42.549-.809 1.108-1.178 1.687q-.675 1.063-1.228 2.196a11 11 0 0 0-.649 1.747a6.6 6.6 0 0 0-.24 1.267a4.18 4.18 0 0 0 1.468 3.384a9 9 0 0 0 4.851 2.166a8.47 8.47 0 0 0 5.24-.998a5.36 5.36 0 0 0 2.556-4.672a5.7 5.7 0 0 0-.06-1.088a9 9 0 0 0-.25-1.048m-1.717-4.272a1 1 0 0 1-1.148.32a3.85 3.85 0 0 1-1.837-.66a.84.84 0 0 1-.42-.808a.84.84 0 0 1 .2-.38l.08-.059q.324.17.67.29a6.7 6.7 0 0 0 1.666.339q.503.027.998-.06a1.18 1.18 0 0 1-.21 1.018m.609-2.236a1.1 1.1 0 0 1-.44.14q-.444.045-.888 0a8 8 0 0 1-1.417-.26a4.6 4.6 0 0 1-.73-.22c.17-.149-.049-.688.1-.997q.086-.256.25-.47c.371.213.777.358 1.198.43a4.8 4.8 0 0 0 1.897 0l.14-.05c.132.186.214.402.239.629a1 1 0 0 1-.35.798M17.99 5.65l.998.369c.315.124.589.335.789.609c.09.13 0 .26-.23.409l-.339.18c-.492.16-1.01.224-1.527.19a3.1 3.1 0 0 1-.889-.2a.3.3 0 0 0-.299-.19l-.12-.08c.222-.282.322-.641.28-.998a1.7 1.7 0 0 0-.14-.37q.74.003 1.477.08m-.25 16.39a7.5 7.5 0 0 1-4.59.778a8.14 8.14 0 0 1-4.213-1.827a3.32 3.32 0 0 1-1.258-2.535a5.6 5.6 0 0 1 .23-1.377q.201-.704.509-1.368q.473-1.12 1.078-2.176a23 23 0 0 1 1.337-1.996a.3.3 0 0 0 0-.12a3.66 3.66 0 0 0 1.907-.998c.577-.62.904-1.43.918-2.276a5.7 5.7 0 0 0 1.108-.18q.42-.128.799-.35a2.6 2.6 0 0 0-.36.6c-.177.39-.25.82-.21 1.248q.02.176.11.329l-.09.06c-.168.16-.295.358-.369.579a1.63 1.63 0 0 0 .52 1.856a4.6 4.6 0 0 0 2.305.999q.2.015.4 0c.459.588.948 1.147 1.337 1.766c.25.402.439.84.559 1.298q.125.491.17.998q.037.469 0 .938a4.52 4.52 0 0 1-2.156 3.753zM11.652 3.114l.459.889a.29.29 0 0 0 .4.11a.3.3 0 0 0 .12-.4l-.34-.818l-.11-.58c0-.409 0-.598.19-.648c.247-.022.496.012.728.1c.375.114.767.161 1.158.14q.276-.057.52-.2c.199-.12.398-.29.608-.43s.14-.15.22-.13s.13.14.2.22q.142.215.309.41q.167.185.389.3c.52.133 1.072.057 1.537-.21c.17-.07.33-.15.49-.2h.11q.06.25.059.509l-.14.679l-.39.838a.34.34 0 0 0 .09.46a.318.318 0 0 0 .46-.13l.529-.919l.26-.858a1.49 1.49 0 0 0-.23-1.298a1.34 1.34 0 0 0-1.368-.09l-.638.17c-.11 0-.2.08-.28 0s-.16-.21-.25-.34a2 2 0 0 0-.399-.459a1.2 1.2 0 0 0-.469-.2a1.13 1.13 0 0 0-.699.06q-.395.181-.728.46q-.174.169-.4.26a3.4 3.4 0 0 1-.998-.08a2.1 2.1 0 0 0-.998.06c-.43.17-.818.558-.659 1.577z"></path>
		</g>
	</svg>
);

export const DownloadReceiptIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
			<path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
			<path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2m-5-4v-6"></path>
			<path d="M9.5 14.5L12 17l2.5-2.5"></path>
		</g>
	</svg>
);

export const PropertyRequestIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<path
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={1.5}
			d="M3 21h9M9 8h1m-1 4h1m-1 4h1m4-8h1m-1 4h1M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7m-3 7h6m-3-3v6"></path>
	</svg>
);

export const SendEmailIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
		<path
			fill="currentColor"
			fillRule="evenodd"
			d="M5.254 8.521L9.61 5.86a.75.75 0 0 1 .782 1.28L6.586 9.465L9.77 12.65a1.2 1.2 0 0 0 1.973-.433l2.692-7.308a1.045 1.045 0 0 0-.98-1.408h-.105q-.151 0-.298.04L2.022 6.509a.707.707 0 0 0 .046 1.375zm-3.48.834L5 10l3.71 3.71a2.7 2.7 0 0 0 4.44-.976l2.693-7.308A2.544 2.544 0 0 0 13.454 2h-.104c-.232 0-.464.03-.688.091l-11.03 2.97a2.207 2.207 0 0 0 .142 4.294"
			clipRule="evenodd"
			strokeWidth={0.1}
			stroke="currentColor"></path>
	</svg>
);

export const PlusIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<path
			fill="currentColor"
			d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2"
			strokeWidth={0.1}
			stroke="currentColor"></path>
	</svg>
);

export const MinusIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<g className="minus-outline">
			<path
				fill="currentColor"
				fillRule="evenodd"
				d="M21 12a1 1 0 0 1-1 1H4a1 1 0 1 1 0-2h16a1 1 0 0 1 1 1"
				className="Vector"
				clipRule="evenodd"
				strokeWidth={0.5}
				stroke="currentColor"></path>
		</g>
	</svg>
);

export const WhatsappIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<path
			fill="currentColor"
			d="M19.074 4.894A9.93 9.93 0 0 0 12.064 2C6.598 2 2.13 6.437 2.13 11.904c0 1.768.45 3.44 1.318 4.983L2.032 22l5.306-1.35c1.447.771 3.087 1.221 4.759 1.221c5.434-.032 9.87-4.47 9.87-9.967c0-2.637-1.028-5.113-2.893-7.01m-7.042 15.273a8.2 8.2 0 0 1-4.212-1.19l-.322-.192l-3.119.803l.869-3.022l-.193-.322A8.53 8.53 0 0 1 3.8 11.84c0-4.534 3.665-8.2 8.231-8.2c2.187 0 4.245.869 5.788 2.412a8.24 8.24 0 0 1 2.412 5.852c.064 4.599-3.666 8.264-8.2 8.264m4.534-6.173c-.257-.129-1.447-.74-1.736-.772c-.225-.097-.418-.129-.547.129c-.129.257-.643.771-.772.964c-.128.129-.257.193-.546.032c-.258-.128-1.03-.353-1.994-1.254c-.74-.643-1.254-1.447-1.35-1.736c-.129-.257-.033-.354.128-.515c.129-.128.258-.257.354-.45c.129-.128.129-.257.257-.418c.129-.128.032-.321-.032-.45c-.096-.128-.547-1.35-.772-1.865c-.193-.514-.418-.418-.546-.418h-.45c-.13 0-.45.032-.644.322c-.225.257-.868.868-.868 2.09s.868 2.347 1.03 2.572c.128.129 1.768 2.669 4.212 3.762c.578.257 1.028.418 1.414.547c.579.193 1.126.128 1.544.096c.482-.032 1.447-.579 1.672-1.19c.193-.546.193-1.093.128-1.19c-.064-.063-.257-.16-.482-.256"
			strokeWidth={0.5}
			stroke="currentColor"></path>
	</svg>
);

export const UploadCloudIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
			<path d="M12 12v9m0-9l-2.5 2m2.5-2l2.5 2M5.034 9.117A4.002 4.002 0 0 0 6 17h1"></path>
			<path d="M15.83 7.138a5.5 5.5 0 0 0-10.796 1.98S5.187 10 5.5 10.5"></path>
			<path d="M17 17a5 5 0 1 0-1.17-9.862L14.5 7.5"></path>
		</g>
	</svg>
);

export const DownloadCloudIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
			<path d="M12 22v-9m0 9l-2.5-2m2.5 2l2.5-2M5.034 9.117A4.002 4.002 0 0 0 6 17h1"></path>
			<path d="M15.83 7.138a5.5 5.5 0 0 0-10.796 1.98S5.187 10 5.5 10.5"></path>
			<path d="M17 17a5 5 0 1 0-1.17-9.862L14.5 7.5"></path>
		</g>
	</svg>
);

export const TrashIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<path
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.8"
			d="m14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21q.512.078 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48 48 0 0 0-3.478-.397m-12 .562q.51-.088 1.022-.165m0 0a48 48 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a52 52 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a49 49 0 0 0-7.5 0"
		/>
	</svg>
);

export const ExportFileIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 36 36">
		<path
			fill="currentColor"
			d="M6 13.61h7.61V6H24v8.38h2V6a2 2 0 0 0-2-2H10.87L4 10.87V30a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2H6Zm0-1.92L11.69 6H12v6H6Z"
			className="clr-i-outline clr-i-outline-path-1"
			strokeWidth={1}
			stroke="currentColor"></path>
		<path
			fill="currentColor"
			d="M28.32 16.35a1 1 0 0 0-1.41 1.41L30.16 21H18a1 1 0 0 0 0 2h12.19l-3.28 3.28a1 1 0 1 0 1.41 1.41L34 22Z"
			className="clr-i-outline clr-i-outline-path-2"
			strokeWidth={1}
			stroke="currentColor"></path>
		<path fill="none" d="M0 0h36v36H0z"></path>
	</svg>
);

export const FilePlusIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<path
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={1.9}
			d="M4 12v2.545c0 3.245 0 4.867.886 5.966a4 4 0 0 0 .603.603C6.59 22 8.211 22 11.456 22c.705 0 1.058 0 1.381-.113q.1-.037.197-.082c.31-.148.559-.398 1.058-.896l4.736-4.737c.579-.578.867-.867 1.02-1.235c.152-.367.152-.776.152-1.593V10c0-3.772 0-5.657-1.172-6.829c-1.059-1.06-2.701-1.16-5.793-1.17M13 21.5V21c0-2.829 0-4.243.879-5.122C14.757 15 16.172 15 19 15h.5M12 6H4m4-4v8"></path>
	</svg>
);

export const AddUserIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
			<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
			<circle cx={9} cy={7} r={4}></circle>
			<path d="M19 8v6m3-3h-6"></path>
		</g>
	</svg>
);

export const ShareIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
			<circle cx={18} cy={5} r={3}></circle>
			<circle cx={6} cy={12} r={3}></circle>
			<circle cx={18} cy={19} r={3}></circle>
			<path d="m8.5 13.5l7 4m0-11l-7 4"></path>
		</g>
	</svg>
);

export const PrinterIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<path
			fill="currentColor"
			d="M8 21q-.825 0-1.412-.587T6 19v-2H4q-.825 0-1.412-.587T2 15v-4q0-1.275.875-2.137T5 8h14q1.275 0 2.138.863T22 11v4q0 .825-.587 1.413T20 17h-2v2q0 .825-.587 1.413T16 21zm-4-6h2q0-.825.588-1.412T8 13h8q.825 0 1.413.588T18 15h2v-4q0-.425-.288-.712T19 10H5q-.425 0-.712.288T4 11zm12-7V5H8v3H6V5q0-.825.588-1.412T8 3h8q.825 0 1.413.588T18 5v3zm2 4.5q.425 0 .713-.288T19 11.5t-.288-.712T18 10.5t-.712.288T17 11.5t.288.713t.712.287M16 19v-4H8v4zM4 10h16z"></path>
	</svg>
);

export const FileIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
		<path fill="#90caf9" d="M40 45H8V3h22l10 10z" strokeWidth={1} stroke="#90caf9"></path>
		<path fill="#e1f5fe" d="M38.5 14H29V4.5z" strokeWidth={1} stroke="#e1f5fe"></path>
	</svg>
);

export const CheckIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20">
		<path
			fill="currentColor"
			fillRule="evenodd"
			d="M16.403 12.652a3 3 0 0 0 0-5.304a3 3 0 0 0-3.75-3.751a3 3 0 0 0-5.305 0a3 3 0 0 0-3.751 3.75a3 3 0 0 0 0 5.305a3 3 0 0 0 3.75 3.751a3 3 0 0 0 5.305 0a3 3 0 0 0 3.751-3.75m-2.546-4.46a.75.75 0 0 0-1.214-.883L9.16 12.1l-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089z"
			clipRule="evenodd"></path>
	</svg>
);

export const PhoneIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<path
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M13 18.675c1.93.83 4.242 1.325 7 1.325v-4l-4-1zm0 0C9.159 17.023 6.824 14.045 5.5 11m0 0C4.4 8.472 4 5.898 4 4h4l1 4z"></path>
	</svg>
);

export const CalendarIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<g fill="none">
			<path
				stroke="currentColor"
				strokeWidth={1.9}
				d="M2 12c0-3.771 0-5.657 1.172-6.828S6.229 4 10 4h4c3.771 0 5.657 0 6.828 1.172S22 8.229 22 12v2c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.172S2 17.771 2 14z"></path>
			<path stroke="currentColor" strokeLinecap="round" strokeWidth={1.9} d="M7 4V2.5M17 4V2.5M2.5 9h19"></path>
			<path
				fill="currentColor"
				d="M18 17a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-5 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-5 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0"></path>
		</g>
	</svg>
);

export const PercentageIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
		<path
			fill="currentColor"
			d="M13.442 2.558a.625.625 0 0 1 0 .884l-10 10a.625.625 0 1 1-.884-.884l10-10a.625.625 0 0 1 .884 0M4.5 6a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3m0 1a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5m7 6a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3m0 1a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5"
			strokeWidth={0.5}
			stroke="currentColor"></path>
	</svg>
);

export const EmailIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<path
			fill="currentColor"
			d="M19 4H5a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3m-.41 2l-5.88 5.88a1 1 0 0 1-1.42 0L5.41 6ZM20 17a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7.41l5.88 5.88a3 3 0 0 0 4.24 0L20 7.41Z"></path>
	</svg>
);

export const PDFIcon = () => (
	<svg
		height="1em"
		preserveAspectRatio="xMidYMid"
		viewBox="0 0 49 64"
		width="1em"
		xmlns="http://www.w3.org/2000/svg"
		xmlnsXlink="http://www.w3.org/1999/xlink">
		<defs>
			<style
				dangerouslySetInnerHTML={{
					__html:
						"\n      .cls-1 {\n        fill: #cb0606;\n      }\n\n      .cls-1, .cls-2, .cls-3 {\n        fillRule: evenodd;\n      }\n\n      .cls-2 {\n        fill: #fb8d8d;\n      }\n\n      .cls-3 {\n        fill: #fff;\n      }\n    ",
				}}
			/>
		</defs>
		<g>
			<path
				className="cls-1"
				d="M49.000,16.842 L49.000,58.947 C49.000,61.738 46.730,64.000 43.931,64.000 L5.069,64.000 C2.269,64.000 -0.000,61.738 -0.000,58.947 L-0.000,5.053 C-0.000,2.262 2.269,-0.000 5.069,-0.000 L32.103,-0.000 L49.000,16.842 Z"
			/>
			<path
				className="cls-2"
				d="M49.000,15.899 L49.000,17.995 L35.187,17.995 C32.327,17.995 31.008,15.675 31.008,12.814 L31.008,-0.000 L33.100,-0.000 L49.000,15.899 Z"
			/>
			<path
				className="cls-3"
				d="M37.606,34.047 C37.170,33.903 36.750,33.830 36.345,33.830 C35.885,33.830 35.569,33.925 35.396,34.115 C35.224,34.305 35.138,34.641 35.138,35.124 L35.138,36.047 L37.071,36.047 L37.071,37.901 L35.138,37.901 L35.138,45.536 L32.796,45.536 L32.796,37.901 L31.589,37.901 L31.589,36.047 L32.796,36.047 L32.796,35.124 C32.796,33.948 33.088,33.098 33.672,32.573 C34.256,32.048 35.134,31.786 36.308,31.786 C36.859,31.786 37.443,31.861 38.060,32.012 L37.606,34.047 ZM27.796,44.613 C27.360,44.981 26.900,45.274 26.416,45.491 C25.932,45.708 25.382,45.816 24.765,45.816 C23.567,45.816 22.650,45.385 22.015,44.523 C21.379,43.660 21.062,42.442 21.062,40.868 C21.062,39.258 21.411,38.007 22.110,37.114 C22.809,36.222 23.790,35.775 25.055,35.775 C25.503,35.775 25.962,35.867 26.434,36.051 C26.906,36.235 27.297,36.469 27.605,36.752 L27.605,32.066 L29.947,32.066 L29.947,45.536 L27.796,45.536 L27.796,44.613 ZM27.605,38.679 C27.357,38.456 27.050,38.258 26.684,38.086 C26.318,37.915 25.944,37.829 25.563,37.829 C24.934,37.829 24.429,38.099 24.048,38.638 C23.666,39.178 23.476,39.909 23.476,40.832 C23.476,41.743 23.632,42.457 23.943,42.976 C24.255,43.495 24.737,43.754 25.391,43.754 C25.778,43.754 26.173,43.665 26.575,43.487 C26.977,43.309 27.321,43.090 27.605,42.831 L27.605,38.679 ZM17.595,45.201 C17.020,45.611 16.334,45.816 15.535,45.816 C14.482,45.816 13.584,45.488 12.840,44.830 L12.840,49.109 L10.498,49.109 L10.498,36.047 L12.658,36.047 L12.658,36.978 C13.094,36.604 13.552,36.310 14.033,36.096 C14.514,35.882 15.066,35.775 15.689,35.775 C16.893,35.775 17.810,36.197 18.439,37.042 C19.068,37.886 19.383,39.113 19.383,40.723 C19.383,41.743 19.229,42.641 18.920,43.419 C18.611,44.197 18.170,44.791 17.595,45.201 ZM16.488,38.602 C16.167,38.086 15.689,37.829 15.054,37.829 C14.673,37.829 14.281,37.918 13.879,38.095 C13.476,38.273 13.130,38.492 12.840,38.751 L12.840,42.903 C13.088,43.127 13.395,43.324 13.761,43.496 C14.127,43.668 14.503,43.754 14.891,43.754 C15.532,43.754 16.039,43.481 16.411,42.935 C16.783,42.389 16.969,41.664 16.969,40.760 C16.969,39.837 16.808,39.118 16.488,38.602 Z"
			/>
		</g>
	</svg>
);

export const CSVIcon = () => (
	<>
		<svg data-name="Layer 1" id="Layer_1" height="1em" width="1em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<style
					dangerouslySetInnerHTML={{
						__html: ".cls-greenest{fill:#4caf50;}.cls-greener{fill:#b9f6ca;}.cls-green{fill:#e8f5e9;}",
					}}
				/>
			</defs>
			<title />
			<path
				className="cls-greenest"
				d="M16.5,22h-9a3,3,0,0,1-3-3V5a3,3,0,0,1,3-3h6.59a1,1,0,0,1,.7.29l4.42,4.42a1,1,0,0,1,.29.7V19A3,3,0,0,1,16.5,22Z"
			/>
			<path className="cls-greener" d="M18.8,7.74H15.2a1.5,1.5,0,0,1-1.5-1.5V2.64a.55.55,0,0,1,.94-.39L19.19,6.8A.55.55,0,0,1,18.8,7.74Z" />
			<path
				className="cls-green"
				d="M9.19,18.11a1.77,1.77,0,0,1-.82-.17,1.29,1.29,0,0,1-.55-.51,1.54,1.54,0,0,1-.2-.79,1.52,1.52,0,0,1,.2-.79,1.21,1.21,0,0,1,.55-.5,1.77,1.77,0,0,1,.82-.18,1.45,1.45,0,0,1,.35,0,1.47,1.47,0,0,1,.38.11.38.38,0,0,1,.19.16.43.43,0,0,1,.05.23.48.48,0,0,1-.07.21.27.27,0,0,1-.17.13.27.27,0,0,1-.23,0,.92.92,0,0,0-.39-.09.61.61,0,0,0-.47.18.77.77,0,0,0-.16.52.75.75,0,0,0,.16.52.58.58,0,0,0,.47.19l.19,0,.2-.07a.27.27,0,0,1,.23,0,.26.26,0,0,1,.16.13.38.38,0,0,1,.07.21.37.37,0,0,1-.05.23.38.38,0,0,1-.19.16,2.15,2.15,0,0,1-.37.11Z"
			/>
			<path
				className="cls-green"
				d="M11.79,18.11a2.92,2.92,0,0,1-.51,0,1.62,1.62,0,0,1-.47-.13.38.38,0,0,1-.24-.2.39.39,0,0,1,0-.26.35.35,0,0,1,.16-.2.3.3,0,0,1,.28,0,1.93,1.93,0,0,0,.42.12,1.69,1.69,0,0,0,.38,0,.56.56,0,0,0,.3-.06.18.18,0,0,0,.09-.16.15.15,0,0,0-.06-.13A.38.38,0,0,0,12,17l-.63-.11a.91.91,0,0,1-.55-.25.74.74,0,0,1-.2-.53.85.85,0,0,1,.17-.51,1.07,1.07,0,0,1,.46-.33,1.83,1.83,0,0,1,.68-.12,3.17,3.17,0,0,1,.47,0,2,2,0,0,1,.41.13.33.33,0,0,1,.2.2.39.39,0,0,1,0,.26.35.35,0,0,1-.17.19.3.3,0,0,1-.28,0,2.19,2.19,0,0,0-.34-.11,1.36,1.36,0,0,0-.27,0,.62.62,0,0,0-.33.07.18.18,0,0,0-.1.16c0,.1.07.16.21.19l.64.11a1,1,0,0,1,.56.24.7.7,0,0,1,.2.52.83.83,0,0,1-.36.72A1.56,1.56,0,0,1,11.79,18.11Z"
			/>
			<path
				className="cls-green"
				d="M14.84,18.1a.59.59,0,0,1-.57-.4l-.82-1.87a.51.51,0,0,1,0-.45.46.46,0,0,1,.44-.2.44.44,0,0,1,.29.09.63.63,0,0,1,.21.32l.48,1.24.51-1.25a.72.72,0,0,1,.2-.31.53.53,0,0,1,.32-.09.4.4,0,0,1,.27.09.36.36,0,0,1,.13.24.53.53,0,0,1-.05.32l-.84,1.88A.58.58,0,0,1,14.84,18.1Z"
			/>
		</svg>
	</>
);

export const SpinnerIcon = () => (
	<svg className="text-current animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
		<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
	</svg>
);

export const ContractCancelledIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<mask id="SVGOQxyObRQ">
			<g fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
				<path
					strokeDasharray={64}
					strokeDashoffset={64}
					d="M13.5 3l5.5 5.5v11.5c0 0.55 -0.45 1 -1 1h-12c-0.55 0 -1 -0.45 -1 -1v-16c0 -0.55 0.45 -1 1 -1Z">
					<animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0"></animate>
				</path>
				<path d="M14.5 3.5l2.25 2.25l2.25 2.25z" opacity={0}>
					<animate fill="freeze" attributeName="d" begin="0.6s" dur="0.2s" values="M14.5 3.5l2.25 2.25l2.25 2.25z;M14.5 3.5l0 4.5l4.5 0z"></animate>
					<set fill="freeze" attributeName="opacity" begin="0.6s" to={1}></set>
				</path>
				<path strokeDasharray={8} strokeDashoffset={8} d="M9 13h6">
					<animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" values="8;0"></animate>
				</path>
				<path strokeDasharray={4} strokeDashoffset={4} d="M9 17h3">
					<animate fill="freeze" attributeName="stroke-dashoffset" begin="1s" dur="0.2s" values="4;0"></animate>
				</path>
				<path fill="#000" fillOpacity={0} stroke="none" d="M19 13c3.31 0 6 2.69 6 6c0 3.31 -2.69 6 -6 6c-3.31 0 -6 -2.69 -6 -6c0 -3.31 2.69 -6 6 -6Z">
					<set fill="freeze" attributeName="fill-opacity" begin="1.2s" to={1}></set>
				</path>
				<path strokeDasharray={8} strokeDashoffset={8} d="M17 17l4 4">
					<animate fill="freeze" attributeName="stroke-dashoffset" begin="1.2s" dur="0.2s" values="8;0"></animate>
				</path>
				<path strokeDasharray={8} strokeDashoffset={8} d="M21 17l-4 4">
					<animate fill="freeze" attributeName="stroke-dashoffset" begin="1.4s" dur="0.2s" values="8;0"></animate>
				</path>
			</g>
		</mask>
		<rect width={24} height={24} fill="currentColor" mask="url(#SVGOQxyObRQ)"></rect>
	</svg>
);

export const ContractTerminatedIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<mask id="SVG5C9HtdGc">
			<g fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
				<path
					strokeDasharray={64}
					strokeDashoffset={64}
					d="M13.5 3l5.5 5.5v11.5c0 0.55 -0.45 1 -1 1h-12c-0.55 0 -1 -0.45 -1 -1v-16c0 -0.55 0.45 -1 1 -1Z">
					<animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0"></animate>
				</path>
				<path d="M14.5 3.5l2.25 2.25l2.25 2.25z" opacity={0}>
					<animate fill="freeze" attributeName="d" begin="0.6s" dur="0.2s" values="M14.5 3.5l2.25 2.25l2.25 2.25z;M14.5 3.5l0 4.5l4.5 0z"></animate>
					<set fill="freeze" attributeName="opacity" begin="0.6s" to={1}></set>
				</path>
				<path strokeDasharray={8} strokeDashoffset={8} d="M9 13h6">
					<animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" values="8;0"></animate>
				</path>
				<path strokeDasharray={4} strokeDashoffset={4} d="M9 17h3">
					<animate fill="freeze" attributeName="stroke-dashoffset" begin="1s" dur="0.2s" values="4;0"></animate>
				</path>
				<path
					fill="#000"
					fillOpacity={0}
					stroke="#000"
					strokeDasharray={32}
					strokeDashoffset={32}
					strokeWidth={6}
					d="M18.5 14c2.48 0 4.5 2.02 4.5 4.5c0 2.48 -2.02 4.5 -4.5 4.5c-2.48 0 -4.5 -2.02 -4.5 -4.5c0 -2.48 2.02 -4.5 4.5 -4.5Z">
					<set fill="freeze" attributeName="fill-opacity" begin="1.2s" to={1}></set>
					<set fill="freeze" attributeName="stroke-dashoffset" begin="1.2s" to={0}></set>
				</path>
				<path
					strokeDasharray={32}
					strokeDashoffset={32}
					d="M18.5 14c2.48 0 4.5 2.02 4.5 4.5c0 2.48 -2.02 4.5 -4.5 4.5c-2.48 0 -4.5 -2.02 -4.5 -4.5c0 -2.48 2.02 -4.5 4.5 -4.5Z">
					<animate fill="freeze" attributeName="stroke-dashoffset" begin="1.2s" dur="0.4s" values="32;0"></animate>
				</path>
				<path strokeDasharray={10} strokeDashoffset={10} d="M16 16l5 5">
					<animate fill="freeze" attributeName="stroke-dashoffset" begin="1.6s" dur="0.2s" values="10;0"></animate>
				</path>
			</g>
		</mask>
		<rect width={24} height={24} fill="currentColor" mask="url(#SVG5C9HtdGc)"></rect>
	</svg>
);

export const ContractPausedIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<mask id="SVG9Xc9jeKA">
			<g fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
				<path
					strokeDasharray={64}
					strokeDashoffset={64}
					d="M13.5 3l5.5 5.5v11.5c0 0.55 -0.45 1 -1 1h-12c-0.55 0 -1 -0.45 -1 -1v-16c0 -0.55 0.45 -1 1 -1Z">
					<animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0"></animate>
				</path>
				<path d="M14.5 3.5l2.25 2.25l2.25 2.25z" opacity={0}>
					<animate fill="freeze" attributeName="d" begin="0.6s" dur="0.2s" values="M14.5 3.5l2.25 2.25l2.25 2.25z;M14.5 3.5l0 4.5l4.5 0z"></animate>
					<set fill="freeze" attributeName="opacity" begin="0.6s" to={1}></set>
				</path>
				<path strokeDasharray={8} strokeDashoffset={8} d="M9 13h6">
					<animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" values="8;0"></animate>
				</path>
				<path strokeDasharray={4} strokeDashoffset={4} d="M9 17h3">
					<animate fill="freeze" attributeName="stroke-dashoffset" begin="1s" dur="0.2s" values="4;0"></animate>
				</path>
				<path fill="#000" fillOpacity={0} stroke="none" d="M19 13c3.31 0 6 2.69 6 6c0 3.31 -2.69 6 -6 6c-3.31 0 -6 -2.69 -6 -6c0 -3.31 2.69 -6 6 -6Z">
					<set fill="freeze" attributeName="fill-opacity" begin="1.2s" to={1}></set>
				</path>
				<path strokeDasharray={8} strokeDashoffset={8} d="M16 19h6">
					<animate fill="freeze" attributeName="stroke-dashoffset" begin="1.2s" dur="0.2s" values="8;0"></animate>
				</path>
			</g>
		</mask>
		<rect width={24} height={24} fill="currentColor" mask="url(#SVG9Xc9jeKA)"></rect>
	</svg>
);

export const MissedPaymentIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
			<path d="M9.5 3h5A1.5 1.5 0 0 1 16 4.5A3.5 3.5 0 0 1 12.5 8h-1A3.5 3.5 0 0 1 8 4.5A1.5 1.5 0 0 1 9.5 3"></path>
			<path d="M12.5 21H8a4 4 0 0 1-4-4v-1a8 8 0 0 1 15.943-.958M16 19h6"></path>
		</g>
	</svg>
);

export const ReceiptIssuedIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<path
			fill="currentColor"
			d="M10 8h6a1 1 0 0 0 0-2h-6a1 1 0 0 0 0 2m-2 4h8a1 1 0 0 0 0-2H8a1 1 0 0 0 0 2m0 4h8a1 1 0 0 0 0-2H8a1 1 0 0 0 0 2M20 2H4a1 1 0 0 0-1 1v18a1 1 0 0 0 1.6.8l2.07-1.55l2.06 1.55a1 1 0 0 0 1.2 0L12 20.25l2.07 1.55a1 1 0 0 0 1.2 0l2.06-1.55l2.07 1.55a1 1 0 0 0 1.05.09A1 1 0 0 0 21 21V3a1 1 0 0 0-1-1m-1 17l-1.07-.8a1 1 0 0 0-1.2 0l-2.06 1.55l-2.07-1.55a1 1 0 0 0-1.2 0l-2.07 1.55l-2.06-1.55a1 1 0 0 0-1.2 0L5 19V4h14Z"
			strokeWidth={0.2}
			stroke="currentColor"></path>
	</svg>
);

export const NewCustomerAddIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
			<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
			<circle cx={9} cy={7} r={4}></circle>
			<path d="M19 8v6m3-3h-6"></path>
		</g>
	</svg>
);

export const ContractResumedIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<path
			fill="currentColor"
			d="M6 2a2 2 0 0 0-2 2v7.498a6.5 6.5 0 0 1 1.5-.422V4a.5.5 0 0 1 .5-.5h6V8a2 2 0 0 0 2 2h4.5v10a.5.5 0 0 1-.5.5h-5.732A6.5 6.5 0 0 1 11.19 22H18a2 2 0 0 0 2-2V9.828a2 2 0 0 0-.586-1.414l-5.828-5.828A2 2 0 0 0 12.172 2zm11.38 6.5H14a.5.5 0 0 1-.5-.5V4.62zM11.19 13a6.5 6.5 0 0 0-2.186-1.5h6.246a.75.75 0 0 1 0 1.5zm.94 1.25c.27.466.484.97.632 1.5h2.488a.75.75 0 0 0 0-1.5zM13 17.5q0 .51-.076 1h2.326a.75.75 0 0 0 0-1.5h-2.269q.02.248.019.5M6.5 12a5.5 5.5 0 1 1 0 11a5.5 5.5 0 0 1 0-11m.5 2.5a.5.5 0 0 0-1 0v3a.5.5 0 0 0 .5.5H9a.5.5 0 0 0 0-1H7z"
			strokeWidth={0.2}
			stroke="currentColor"></path>
	</svg>
);

export const CameraIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 20 20">
		<path
			fill="currentColor"
			d="M6.783 2.826A1.5 1.5 0 0 1 8.123 2h3.764a1.5 1.5 0 0 1 1.342.83L13.814 4h1.69a2.5 2.5 0 0 1 2.5 2.5v2.195a2.9 2.9 0 0 0-1-.56V6.5a1.5 1.5 0 0 0-1.5-1.5h-2a.5.5 0 0 1-.446-.276l-.723-1.447A.5.5 0 0 0 11.887 3H8.123a.5.5 0 0 0-.447.275l-.728 1.449a.5.5 0 0 1-.446.275H4.504a1.5 1.5 0 0 0-1.5 1.5V14.5a1.5 1.5 0 0 0 1.5 1.5H8.22l-.163.653q-.044.176-.054.347h-3.5a2.5 2.5 0 0 1-2.5-2.5v-8a2.5 2.5 0 0 1 2.5-2.5h1.69zm7.104 6.23A4.002 4.002 0 0 0 6 10c0 1.89 1.31 3.473 3.072 3.892a3 3 0 0 1 .202-.222l.67-.67A3 3 0 1 1 13 9.944zm.922.492l-4.83 4.83a2.2 2.2 0 0 0-.577 1.02l-.375 1.498a.89.89 0 0 0 1.079 1.078l1.498-.374a2.2 2.2 0 0 0 1.02-.578l4.83-4.83a1.87 1.87 0 0 0-2.645-2.644"
			strokeWidth={0.4}
			stroke="currentColor"></path>
	</svg>
);
