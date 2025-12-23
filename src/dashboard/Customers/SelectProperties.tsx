import React from "react";
import { useNavigate } from "react-router";
import { useGetAllProperties } from "@/api/property";
import { Spinner } from "@/components/ui/spinner";
import PageWrapper from "@/components/common/PageWrapper";
import CustomCard from "@/components/base/CustomCard";
import PageTitles from "@/components/common/PageTitles";
import Image from "@/components/base/Image";
import { IconWrapper, MinusIcon, PlusIcon, EyeIcon } from "@/assets/icons";
import { _router } from "@/routes/_router";
import type { PropertyData } from "@/types/property";
import { RectangleSkeleton } from "@/components/common/Skeleton";
import ActionButton from "@/components/base/ActionButton";
import { twMerge } from "tailwind-merge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SelectedProperty {
	id: string;
	name: string;
	price: string;
	quantity: number;
	media?: string[];
}

export default function SelectProperties() {
	const navigate = useNavigate();
	const { data: propertiesData, isLoading: propertiesLoading } = useGetAllProperties(1, 100);

	const [paymentMethod, setPaymentMethod] = React.useState<"once" | "installment" | null>(null);
	const [selectedProperties, setSelectedProperties] = React.useState<SelectedProperty[]>([]);
	const [detailsOpen, setDetailsOpen] = React.useState(false);
	const [selectedProperty, setSelectedProperty] = React.useState<PropertyData | null>(null);
	const [imageIndex, setImageIndex] = React.useState(0);

	// Parse payment method from URL params and load previously selected properties
	React.useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const method = params.get("paymentMethod");
		if (method === "once" || method === "installment") {
			setPaymentMethod(method);
		}

		// Load previously selected properties from localStorage
		const stored = localStorage.getItem("pendingSelectedProperties");
		if (stored) {
			try {
				const parsed = JSON.parse(stored);
				if (parsed.selectedProperties && Array.isArray(parsed.selectedProperties)) {
					setSelectedProperties(parsed.selectedProperties);
				}
			} catch {
				// ignore parse errors
			}
		}
	}, []);

	React.useEffect(() => {
		if (paymentMethod) {
			if (selectedProperties.length > 0) {
				localStorage.setItem(
					"pendingSelectedProperties",
					JSON.stringify({
						paymentMethod,
						selectedProperties,
					})
				);
			} else {
				localStorage.removeItem("pendingSelectedProperties");
			}
		}
	}, [selectedProperties, paymentMethod]);

	const handleViewDetails = (property: PropertyData) => {
		setSelectedProperty(property);
		setImageIndex(0);
		setDetailsOpen(true);
	};

	const properties: PropertyData[] = React.useMemo(() => {
		if (!propertiesData || typeof propertiesData !== "object") return [];
		if (Array.isArray(propertiesData)) return propertiesData as PropertyData[];
		const dataObj = propertiesData as Record<string, unknown>;
		if (Array.isArray(dataObj.data as unknown)) return dataObj.data as unknown as PropertyData[];
		if (Array.isArray(dataObj.items as unknown)) return dataObj.items as unknown as PropertyData[];
		return [];
	}, [propertiesData]);

	// For hire purchase, only allow one selection
	const handlePropertySelect = (property: PropertyData) => {
		if (paymentMethod === "installment") {
			// Single selection only
			setSelectedProperties([
				{
					id: property.id,
					name: property.name,
					price: property.price,
					quantity: 1,
					media: property.media,
				},
			]);
		} else if (paymentMethod === "once") {
			// Check if already selected
			const isSelected = selectedProperties.find((p) => p.id === property.id);
			if (isSelected) {
				setSelectedProperties(selectedProperties.filter((p) => p.id !== property.id));
			} else {
				// Add to selected
				setSelectedProperties([
					...selectedProperties,
					{
						id: property.id,
						name: property.name,
						price: property.price,
						quantity: 1,
						media: property.media,
					},
				]);
			}
		}
	};

	const handleQuantityChange = (propertyId: string, delta: number) => {
		setSelectedProperties((prev) => {
			const updated = prev
				.map((p) => {
					if (p.id === propertyId) {
						const newQuantity = Math.max(0, p.quantity + delta);
						return { ...p, quantity: newQuantity };
					}
					return p;
				})
				.filter((p) => p.quantity > 0); // Remove if quantity is 0 or less
			return updated;
		});
	};

	const handleProceed = () => {
		if (selectedProperties.length === 0) {
			alert("Please select at least one property");
			return;
		}

		navigate(_router.dashboard.customerAdd, {
			state: {
				paymentMethod,
				selectedProperties,
			},
		});
	};

	const handleBack = () => {
		navigate(-1);
	};

	if (!paymentMethod) {
		return (
			<PageWrapper>
				<div className="text-center">
					<Spinner className="size-8" />
				</div>
			</PageWrapper>
		);
	}

	return (
		<PageWrapper>
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles
					title="Select Properties"
					description={paymentMethod === "installment" ? "Select one property for hire purchase" : "Select properties for full payment"}
				/>
			</div>

			<CustomCard className="p-6">
				{/* Properties Grid */}
				<div>
					{propertiesLoading ? (
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
							{Array.from({ length: 10 }).map((_, i) => (
								<div key={i} className="bg-white rounded-md p-4 border border-gray-100">
									<RectangleSkeleton className="h-32 w-full mb-3" />
									<RectangleSkeleton className="h-4 w-3/4 mb-2" />
									<RectangleSkeleton className="h-4 w-1/2 mb-3" />
									<RectangleSkeleton className="h-9 w-full" />
								</div>
							))}
						</div>
					) : properties.length === 0 ? (
						<div className="text-center py-12 text-muted-foreground">
							<p className="text-lg">No properties available</p>
						</div>
					) : (
						<>
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
								{properties.map((property) => {
									const isSelected = selectedProperties.some((p) => p.id === property.id);
									const selectedItem = selectedProperties.find((p) => p.id === property.id);
									const isDisabled = paymentMethod === "installment" && selectedProperties.length > 0 && !isSelected;
									const imgSrc = property.media?.[0] || "";

									return (
										<div
											key={property.id}
											className={twMerge(
												"bg-white rounded-md p-4 border border-gray-100 transition-all",
												isSelected && "border-primary bg-primary/5 shadow-md",
												isDisabled && "opacity-50 cursor-not-allowed"
											)}>
											{/* Image Container */}
											<div className="h-32 flex items-center justify-center overflow-hidden bg-gray-50 rounded mb-3 relative group">
												<Image src={imgSrc} alt={property.name} className="max-h-full object-contain" />
												<button
													type="button"
													onClick={() => handleViewDetails(property)}
													className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors rounded">
													<button
														type="button"
														className="bg-primary text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
														<IconWrapper className="text-lg">
															<EyeIcon />
														</IconWrapper>
													</button>
												</button>{" "}
											</div>
											{/* Content */}
											<div>
												<h5 className="text-sm font-medium truncate mb-1">{property.name}</h5>
												<p className="text-primary font-bold text-base mb-3">₦{parseFloat(property.price).toLocaleString()}</p>

												{/* Action Buttons/Controls */}
												{isSelected ? (
													<div className="flex items-center gap-1 bg-gray-50 rounded p-1">
														<button
															type="button"
															onClick={() => handleQuantityChange(property.id, -1)}
															className="flex-1 bg-red-500 text-white py-1.5 rounded text-xs hover:bg-red-600 flex items-center justify-center"
															title="Decrease quantity">
															<IconWrapper className="text-sm">
																<MinusIcon />
															</IconWrapper>
														</button>
														<span className="flex-1 text-center text-sm font-semibold">{selectedItem?.quantity || 1}</span>
														<button
															type="button"
															onClick={() => handleQuantityChange(property.id, 1)}
															className="flex-1 bg-blue-500 text-white py-1.5 rounded text-xs hover:bg-blue-600 flex items-center justify-center"
															title="Increase quantity">
															<IconWrapper className="text-sm">
																<PlusIcon />
															</IconWrapper>
														</button>
													</div>
												) : (
													<ActionButton
														type="button"
														onClick={() => handlePropertySelect(property)}
														disabled={isDisabled}
														className="w-full bg-primary text-white text-sm py-2 hover:bg-primary/90">
														Select
													</ActionButton>
												)}
											</div>
										</div>
									);
								})}
							</div>

							{/* Selected Summary and Action Buttons */}
							{selectedProperties.length > 0 && (
								<div className="border-t pt-6 mt-6">
									<h3 className="font-semibold mb-4">Selected Properties ({selectedProperties.length})</h3>
									<div className="bg-gray-50 p-4 rounded-md mb-6 max-h-48 overflow-y-auto">
										{selectedProperties.map((prop) => (
											<div key={prop.id} className="flex justify-between items-center mb-2 pb-2 border-b last:border-b-0">
												<span className="text-sm">
													<span className="font-medium">{prop.name}</span>
													{paymentMethod === "once" && prop.quantity > 1 && <span className="text-gray-600 ml-2">× {prop.quantity}</span>}
												</span>
												<span className="font-semibold text-primary">₦{(parseFloat(prop.price) * prop.quantity).toLocaleString()}</span>
											</div>
										))}
									</div>
								</div>
							)}
						</>
					)}
				</div>

				{/* Action Buttons */}
				<div className="flex gap-4 justify-end mt-8">
					<ActionButton type="button" onClick={handleBack} variant="outline" className="px-6 py-2.5">
						Back
					</ActionButton>
					<ActionButton
						type="button"
						onClick={handleProceed}
						disabled={selectedProperties.length === 0}
						className="px-6 py-2.5 bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed">
						Proceed
					</ActionButton>
				</div>
			</CustomCard>

			{/* Property Details Modal */}
			{selectedProperty && (
				<Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
					<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
						<DialogHeader>
							<DialogTitle className="text-xl font-bold">{selectedProperty.name}</DialogTitle>
						</DialogHeader>

						<div className="space-y-6">
							{/* Image Gallery */}
							{selectedProperty.media && selectedProperty.media.length > 0 && (
								<div className="space-y-3">
									<div className="w-full h-80 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
										<Image src={selectedProperty.media[imageIndex]} alt={selectedProperty.name} className="max-h-full object-contain" />
									</div>
									{selectedProperty.media.length > 1 && (
										<div className="flex gap-2 overflow-x-auto pb-2">
											{selectedProperty.media.map((img, idx) => (
												<button
													key={idx}
													type="button"
													onClick={() => setImageIndex(idx)}
													className={twMerge(
														"w-16 h-16 flex-shrink-0 rounded border-2 overflow-hidden bg-gray-50 transition-colors",
														idx === imageIndex ? "border-primary" : "border-gray-200 hover:border-gray-300"
													)}>
													<Image src={img} alt="Thumbnail" className="w-full h-full object-contain" />
												</button>
											))}
										</div>
									)}
								</div>
							)}

							{/* Price and Basic Info */}
							<div className="bg-gray-50 rounded-lg p-4">
								<div className="text-3xl font-bold text-primary mb-3">₦{parseFloat(selectedProperty.price).toLocaleString()}</div>
								<div className="grid grid-cols-2 gap-4 text-sm">
									<div>
										<span className="text-gray-600">Condition</span>
										<p className="font-semibold">{selectedProperty.condition || "N/A"}</p>
									</div>
									<div>
										<span className="text-gray-600">Status</span>
										<p className="font-semibold">{selectedProperty.status?.status || "N/A"}</p>
									</div>
									<div>
										<span className="text-gray-600">Available</span>
										<p className="font-semibold">{selectedProperty.quantityAvailable}</p>
									</div>
									<div>
										<span className="text-gray-600">Assigned</span>
										<p className="font-semibold">{selectedProperty.quantityAssigned}</p>
									</div>
								</div>
							</div>

							{/* Description */}
							{selectedProperty.description && (
								<div>
									<h3 className="font-semibold text-sm mb-2">Description</h3>
									<p className="text-gray-700 text-sm leading-relaxed">{selectedProperty.description}</p>
								</div>
							)}

							{/* Category */}
							{selectedProperty.category && (
								<div>
									<h3 className="font-semibold text-sm mb-2">Category</h3>
									<p className="text-gray-700 text-sm">
										{selectedProperty.category.parent?.category} → {selectedProperty.category.category}
									</p>
								</div>
							)}

							{/* Additional Info */}
							<div className="space-y-2 text-sm text-gray-600">
								{selectedProperty.propertyCode && (
									<div>
										<span className="font-medium">Code:</span> {selectedProperty.propertyCode}
									</div>
								)}
								{selectedProperty.addedBy && (
									<div>
										<span className="font-medium">Added by:</span> {selectedProperty.addedBy.fullName}
									</div>
								)}
								{selectedProperty.dateAdded && (
									<div>
										<span className="font-medium">Added on:</span> {new Date(selectedProperty.dateAdded).toLocaleDateString()}
									</div>
								)}
							</div>
						</div>
					</DialogContent>
				</Dialog>
			)}
		</PageWrapper>
	);
}
