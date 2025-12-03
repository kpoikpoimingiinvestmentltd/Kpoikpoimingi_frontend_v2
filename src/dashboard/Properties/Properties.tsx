import CustomCard from "@/components/base/CustomCard";
import { IconWrapper, PlusIcon, SearchIcon, ThreeDotsIcon, EditIcon, TrashIcon, CloseIcon, EyeIcon } from "@/assets/icons";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Image from "@/components/base/Image";
import { media } from "@/resources/images";
import PageTitles from "@/components/common/PageTitles";
import { checkboxStyle, inputStyle, tabListStyle, tabStyle } from "@/components/common/commonStyles";
import CustomInput from "@/components/base/CustomInput";
import CompactPagination from "@/components/ui/compact-pagination";
import React from "react";
import { useGetAllProperties, useUpdateProperty } from "@/api/property";
import type { PropertyData } from "@/types/property";
import { deletePropertyRequest } from "@/api/property";
import EditPropertyDetailsModal from "./EditPropertyDetailsModal";
import EmptyData from "@/components/common/EmptyData";
import { Link } from "react-router";
import { _router } from "../../routes/_router";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Dialog, DialogContent } from "../../components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { twMerge } from "tailwind-merge";
import ActionButton from "../../components/base/ActionButton";
import { toast } from "sonner";
import { RectangleSkeleton } from "@/components/common/Skeleton";

export default function Properties() {
	const [editOpen, setEditOpen] = React.useState(false);
	const [propertyToEdit, setPropertyToEdit] = React.useState<PropertyData | null>(null);
	const [activeTab, setActiveTab] = React.useState("available");
	const [page, setPage] = React.useState(1);
	const [searchQuery, setSearchQuery] = React.useState("");
	const [selected, setSelected] = React.useState<Record<string, boolean>>({});
	const [confirmOpen, setConfirmOpen] = React.useState(false);
	const [deleteType, setDeleteType] = React.useState<"single" | "bulk">("bulk");
	const [propertyToDelete, setPropertyToDelete] = React.useState<PropertyData | null>(null);
	const ITEMS_PER_PAGE = 10;

	const { data: propertiesData, isLoading, refetch } = useGetAllProperties();
	const [isDeleting, setIsDeleting] = React.useState(false);
	const updateProperty = useUpdateProperty(
		(data: unknown) => {
			refetch();
			setEditOpen(false);
			setPropertyToEdit(null);
			const d = data as { message?: string };
			const message = d?.message || "Property updated successfully";
			toast.success(message);
		},
		(error: unknown) => {
			const err = error as { message?: string };
			toast.error(err?.message || "Failed to update property");
			console.error("Update failed:", error);
		}
	);
	const allProperties = ((propertiesData as Record<string, unknown>)?.data || []) as PropertyData[];

	const filteredByStatus = allProperties.filter((prop) => {
		if (activeTab === "available") return true;
		if (activeTab === "low") return prop.isLowStock;
		if (activeTab === "out") return prop.isOutOfStock;
		return true;
	});

	const filteredItems = filteredByStatus.filter(
		(prop) =>
			prop.propertyCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			prop.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			prop.addedBy?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const pages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
	const paginatedItems = filteredItems.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
	const isEmpty = allProperties.length === 0;

	const toggleSelect = (id: string) => setSelected((s) => ({ ...s, [id]: !s[id] }));
	const selectedCount = Object.values(selected).filter(Boolean).length;

	const handleDelete = async () => {
		try {
			setIsDeleting(true);

			if (deleteType === "single" && propertyToDelete) {
				const data = await deletePropertyRequest(propertyToDelete.id);
				refetch();
				setConfirmOpen(false);
				setPropertyToDelete(null);
				const d = data as { message?: string };
				const message = d?.message || "Property deleted successfully";
				toast.success(message);
			} else if (deleteType === "bulk") {
				const idsToDelete = Object.entries(selected)
					.filter(([_, v]) => v)
					.map(([k]) => k);

				// Use Promise.all for concurrent deletion of multiple properties
				if (idsToDelete.length > 0) {
					const deletePromises = idsToDelete.map((id) => deletePropertyRequest(id));

					await Promise.all(deletePromises);
					refetch();
					setConfirmOpen(false);
					setSelected({});
					toast.success(`${idsToDelete.length} properties deleted successfully`);
				}
			}
		} catch (error) {
			const message = deleteType === "single" ? "Failed to delete property" : "Failed to delete some properties";
			toast.error(message);
			console.error("Delete failed:", error);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<div className="flex flex-col gap-y-6">
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="Properties" description="All properties listed for sell" />
				<div className="flex items-center gap-3">
					<Link
						to={_router.dashboard.addProperties}
						className="flex items-center gap-2 bg-primary rounded-sm px-8 py-2.5 active-scale transition text-white">
						<IconWrapper className="text-lg">
							<PlusIcon />
						</IconWrapper>
						<span className="text-sm">Add Property</span>
					</Link>
				</div>
			</div>

			<div className="min-h-96 flex">
				{isLoading ? (
					<CustomCard className="bg-white flex-grow w-full rounded-lg p-4 border border-gray-100">
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
							{Array.from({ length: 10 }).map((_, i) => (
								<div key={i} className="bg-white rounded-md p-4">
									<RectangleSkeleton className="h-32 w-full mb-3" />
									<RectangleSkeleton className="h-4 w-3/4 mb-2" />
									<RectangleSkeleton className="h-4 w-1/2" />
								</div>
							))}
						</div>
					</CustomCard>
				) : !isEmpty ? (
					<CustomCard className="bg-white flex-grow w-full rounded-lg p-4 border border-gray-100">
						<>
							<div className="w-full">
								<div className="flex items-center justify-between flex-wrap gap-6">
									<div className="flex items-center gap-4">
										<Tabs value={activeTab} onValueChange={setActiveTab}>
											<TabsList className={tabListStyle}>
												<TabsTrigger className={tabStyle} value="available">
													Available
												</TabsTrigger>
												<TabsTrigger className={tabStyle} value="low">
													Low In Stock
												</TabsTrigger>
												<TabsTrigger className={tabStyle} value="out">
													Out Of Stock
												</TabsTrigger>
											</TabsList>
										</Tabs>
									</div>
									<div className="flex items-center gap-2">
										<div className="relative md:w-80">
											<CustomInput
												placeholder="Search by id, name or contact"
												aria-label="Search properties"
												value={searchQuery}
												onChange={(e) => {
													setSearchQuery(e.target.value);
													setPage(1); // Reset to first page on search
												}}
												className={`max-w-[320px] ${inputStyle} h-10 pl-9`}
												iconLeft={<SearchIcon />}
											/>
										</div>
									</div>
								</div>
								<div className="w-full mt-8">
									{selectedCount > 0 && (
										<div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4 flex items-center justify-between">
											<div className="flex items-center gap-2">
												<button
													type="button"
													className="bg-red-200 p-1 flex items-center justify-center rounded-full active-scale"
													onClick={() => setSelected({})}>
													<IconWrapper className="text-[.95rem]">
														<CloseIcon />
													</IconWrapper>
												</button>
												<div className="text-sm text-red-700">{selectedCount} Items selected</div>
											</div>
											<div>
												<button
													type="button"
													onClick={() => {
														setDeleteType("bulk");
														setConfirmOpen(true);
													}}
													className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md flex items-center gap-1.5 text-sm active-scale">
													<IconWrapper>
														<TrashIcon />
													</IconWrapper>
													<span>Delete</span>
												</button>
											</div>
										</div>
									)}
									<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
										{paginatedItems.map((prod) => {
											const checked = !!selected[prod.id];
											const imgSrc = prod.media?.[0] || media.images._product1;
											return (
												<div key={prod.id} className={twMerge("bg-white rounded-md p-4 relative", checked ? "bg-primary/10" : "bg-transparent")}>
													<div className="absolute top-2 right-2">
														<Checkbox
															checked={checked}
															onCheckedChange={() => toggleSelect(prod.id)}
															className={twMerge("rounded-full !border-primary/50", checkboxStyle)}
														/>
													</div>
													<div className="h-24 md:h-32 flex items-center justify-center overflow-hidden bg-gray-50 rounded">
														<Image src={imgSrc} alt={prod.name} className="max-h-full object-contain" />
													</div>
													<div className="mt-3">
														<h5 className="text-sm font-medium truncate">{prod.name}</h5>
														<div className="flex items-center justify-between gap-2">
															<p className="text-sm font-semibold text-primary mt-1">₦{prod.price}</p>
															<DropdownMenu>
																<DropdownMenuTrigger asChild>
																	<button className="text-primary">
																		<IconWrapper>
																			<ThreeDotsIcon />
																		</IconWrapper>
																	</button>
																</DropdownMenuTrigger>
																<DropdownMenuContent align="end" sideOffset={6} className="w-44 shadow-md px-2">
																	<DropdownMenuItem>
																		<Link to={_router.dashboard.propertiesDetails(prod.id)} className="flex w-full items-center gap-2 cursor-pointer">
																			<IconWrapper className="text-base">
																				<EyeIcon />
																			</IconWrapper>
																			<span>View details</span>
																		</Link>
																	</DropdownMenuItem>
																	<DropdownMenuItem>
																		<button
																			type="button"
																			onClick={() => {
																				setPropertyToEdit(prod);
																				setEditOpen(true);
																			}}
																			className="flex items-center gap-2 w-full">
																			<IconWrapper className="text-base">
																				<EditIcon />
																			</IconWrapper>
																			<span>Edit details</span>
																		</button>
																	</DropdownMenuItem>
																	<DropdownMenuItem
																		onClick={() => {
																			setDeleteType("single");
																			setPropertyToDelete(prod);
																			setConfirmOpen(true);
																		}}
																		className="flex items-center gap-2 text-red-600 cursor-pointer">
																		<IconWrapper className="text-base">
																			<TrashIcon />
																		</IconWrapper>
																		<span>Delete</span>
																	</DropdownMenuItem>
																</DropdownMenuContent>
															</DropdownMenu>
														</div>
														<div className="text-xs text-amber-600 mt-1">{prod.quantityAvailable} Items Available</div>
													</div>
												</div>
											);
										})}
									</div>
									{paginatedItems.length === 0 && (
										<div className="text-center py-12">
											<p className="text-muted-foreground">No properties found</p>
										</div>
									)}
								</div>
							</div>
						</>

						<CompactPagination page={page} pages={pages} onPageChange={setPage} showRange />

						{/* Success dialog moved to AddProperties.tsx */}

						{/* Confirm delete dialog */}
						<Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
							<DialogContent className="max-w-xl">
								<div className="text-center flex flex-col gap-y-2 py-6">
									<h5 className="text-lg font-medium">Delete Property</h5>
									<p className="mt-6 text-sm font-medium">{deleteType === "single" ? propertyToDelete?.name : `${selectedCount} Selected items`}</p>
									<span className="mt-2 text-sm text-muted-foreground">
										{deleteType === "single" ? "This action cannot be undone." : "Do you want to delete these items?"}
									</span>
								</div>

								<footer className="max-w-sm mx-auto mb-5 grid grid-cols-1 min-[480px]:grid-cols-2 gap-3">
									<ActionButton
										variant="danger"
										onClick={handleDelete}
										disabled={isDeleting}
										className="bg-red-600 text-sm text-white px-8 py-3 rounded-md disabled:opacity-50">
										{isDeleting ? "Deleting..." : "Yes, Delete this"}
									</ActionButton>
									<ActionButton
										variant="outline"
										onClick={() => setConfirmOpen(false)}
										disabled={isDeleting}
										className="border border-primary text-primary px-8 py-3 text-sm rounded-md disabled:opacity-50">
										Cancel
									</ActionButton>
								</footer>
							</DialogContent>
						</Dialog>

						{/* Edit property modal (reused for editing a single item) */}
						<EditPropertyDetailsModal
							open={editOpen}
							onOpenChange={setEditOpen}
							initial={
								propertyToEdit
									? {
											id: propertyToEdit.id,
											name: propertyToEdit.name,
											price: propertyToEdit.price,
											quantity: String(propertyToEdit.quantityTotal ?? ""),
											status: propertyToEdit.status?.status ?? "",
											numberAssigned: String(propertyToEdit.quantityAssigned ?? ""),
											category: propertyToEdit.category?.category ?? "",
											categoryId: propertyToEdit.category?.id ?? "",
											addedOn: new Date(propertyToEdit.dateAdded).toLocaleDateString("en-US", {
												year: "numeric",
												month: "long",
												day: "numeric",
											}),
											images: propertyToEdit.media || [media.images._product1],
									  }
									: {
											id: "",
											name: "",
											price: "",
											quantity: "",
											status: "",
											numberAssigned: "",
											category: "",
											addedOn: "",
											images: [media.images._product1],
									  }
							}
							onSave={(formData: unknown) => {
								if (propertyToEdit?.id) {
									const typedFormData = formData as Record<string, unknown>;
									const mediaKeysArray = (typedFormData?.mediaKeys || []) as string[];
									const mediaKeysObject = mediaKeysArray.reduce((acc: Record<string, string>, key: string, idx: number) => {
										acc[`media_${idx}`] = key;
										return acc;
									}, {});

									const isVehicle = propertyToEdit?.category?.parent?.category?.toLowerCase().includes("vehicle") || false;

									const payload: Record<string, unknown> = {
										name: typedFormData?.name,
										categoryId: typedFormData?.categoryId,
										price: Number(typedFormData?.price),
										quantityTotal: Number(typedFormData?.quantityTotal),
										condition: typedFormData?.condition || propertyToEdit?.description || "Good",
										description: typedFormData?.description || "",
										mediaKeys: mediaKeysObject || {},
									};

									if (isVehicle) {
										payload.vehicleMake = typedFormData?.vehicleMake;
										payload.vehicleModel = typedFormData?.vehicleModel;
										payload.vehicleYear = typedFormData?.vehicleYear ? Number(typedFormData?.vehicleYear) : undefined;
										payload.vehicleColor = typedFormData?.vehicleColor;
										payload.vehicleChassisNumber = typedFormData?.vehicleChassisNumber;
										payload.vehicleType = typedFormData?.vehicleType;
										payload.vehicleRegistrationNumber = typedFormData?.vehicleRegistrationNumber;
									}

									updateProperty.mutate({
										id: propertyToEdit.id,
										payload,
									});
								}
							}}
							isLoading={updateProperty.isPending}
						/>
					</CustomCard>
				) : (
					<EmptyData text="No Payments at the moment" />
				)}
			</div>
		</div>
	);
}
