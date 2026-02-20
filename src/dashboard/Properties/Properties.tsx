import CustomCard from "@/components/base/CustomCard";
import { IconWrapper, ThreeDotsIcon, EditIcon, TrashIcon, CloseIcon, EyeIcon } from "@/assets/icons";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Image from "@/components/base/Image";
import { media } from "@/resources/images";
import { checkboxStyle, tabListStyle, tabStyle } from "@/components/common/commonStyles";
import SearchWithFilters from "@/components/common/SearchWithFilters";
import type { FilterField } from "@/components/common/SearchWithFilters";
import CompactPagination from "@/components/ui/compact-pagination";
import React from "react";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";
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
import { RectangleSkeleton } from "@/components/common/Skeleton";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/utils";
import { useSearchParams } from "react-router";
import { useCanPerformAction } from "@/hooks/usePermissions";

export default function Properties() {
	const [searchParams, setSearchParams] = useSearchParams();
	const canDelete = useCanPerformAction("delete");

	// Initialize state from URL params
	const [page, setPage] = React.useState(() => {
		const pageParam = searchParams.get("page");
		return pageParam ? parseInt(pageParam, 10) : 1;
	});
	const [limit, setLimit] = React.useState(() => {
		const limitParam = searchParams.get("limit");
		return limitParam ? parseInt(limitParam, 10) : 10;
	});
	const [searchQuery, setSearchQuery] = React.useState(() => {
		return searchParams.get("search") || "";
	});
	const [sortBy, setSortBy] = React.useState(() => {
		return searchParams.get("sortBy") || "createdAt";
	});
	const [sortOrder, setSortOrder] = React.useState(() => {
		return searchParams.get("sortOrder") || "desc";
	});
	const [isPublicFilter, setIsPublicFilter] = React.useState(() => {
		return searchParams.get("isPublic") || "";
	});
	const [activeTab, setActiveTab] = React.useState(() => {
		const statusParam = searchParams.get("status");
		const stockStatusParam = searchParams.get("stockStatus");
		if (statusParam === "sold") return "out";
		if (stockStatusParam === "low_stock") return "low";
		return "available";
	});

	const debouncedSearch = useDebounceSearch(searchQuery, 400);
	const [, setIsMounted] = React.useState(false);

	// Sync state when URL params change (e.g., browser back/forward, refresh)
	React.useEffect(() => {
		const pageParam = searchParams.get("page");
		const newPage = pageParam ? parseInt(pageParam, 10) : 1;
		setPage(newPage);

		const limitParam = searchParams.get("limit");
		const newLimit = limitParam ? parseInt(limitParam, 10) : 10;
		setLimit(newLimit);

		setSearchQuery(searchParams.get("search") || "");
		setSortBy(searchParams.get("sortBy") || "createdAt");
		setSortOrder(searchParams.get("sortOrder") || "desc");
		setIsPublicFilter(searchParams.get("isPublic") || "");
		// derive active tab from status / stockStatus params
		const statusParam = searchParams.get("status");
		const stockStatusParam = searchParams.get("stockStatus");
		if (statusParam === "sold") setActiveTab("out");
		else if (stockStatusParam === "low_stock") setActiveTab("low");
		else setActiveTab("available");
	}, [searchParams]);

	// Initialize URL params on mount if not present
	React.useEffect(() => {
		const hasParams =
			searchParams.has("page") ||
			searchParams.has("limit") ||
			searchParams.has("search") ||
			searchParams.has("sortBy") ||
			searchParams.has("sortOrder") ||
			searchParams.has("isPublic") ||
			searchParams.has("status") ||
			searchParams.has("stockStatus");
		if (!hasParams) {
			const params = new URLSearchParams();
			params.set("page", "1");
			params.set("limit", "10");
			params.set("sortBy", "createdAt");
			params.set("sortOrder", "desc");
			// default to available (no status/stockStatus param)
			setSearchParams(params, { replace: true });
		}
		setIsMounted(true);
	}, []);

	// Update URL when state changes
	React.useEffect(() => {
		const params = new URLSearchParams(searchParams);
		params.set("page", page.toString());
		params.set("limit", limit.toString());
		params.set("search", searchQuery);
		params.set("sortBy", sortBy);
		params.set("sortOrder", sortOrder);
		params.set("isPublic", isPublicFilter);
		// map activeTab to appropriate url param keys
		params.delete("status");
		params.delete("stockStatus");
		if (activeTab === "out") {
			params.set("status", "sold");
		} else if (activeTab === "low") {
			params.set("stockStatus", "low_stock");
		}
		setSearchParams(params, { replace: true });
	}, [page, limit, searchQuery, sortBy, sortOrder, isPublicFilter, activeTab, setSearchParams]);

	const {
		data: propertiesData,
		isLoading,
		refetch,
	} = useGetAllProperties(
		page,
		limit,
		debouncedSearch || undefined,
		sortBy,
		sortOrder,
		isPublicFilter || undefined,
		activeTab === "available" ? "available" : activeTab === "out" ? "sold" : undefined,
		activeTab === "low" ? "low_stock" : undefined,
	);

	const [selected, setSelected] = React.useState<Record<string, boolean>>({});
	const [confirmOpen, setConfirmOpen] = React.useState(false);
	const [deleteType, setDeleteType] = React.useState<"single" | "bulk">("single");
	const [propertyToDelete, setPropertyToDelete] = React.useState<PropertyData | null>(null);
	const [editOpen, setEditOpen] = React.useState(false);
	const [propertyToEdit, setPropertyToEdit] = React.useState<PropertyData | null>(null);

	const updateProperty = useUpdateProperty(
		() => {
			toast.success("Property updated successfully");
			setPropertyToEdit(null);
			setEditOpen(false);
			refetch();
		},
		(err) => {
			console.error("Error updating property:", err);
			toast.error(extractErrorMessage(err, "Failed to update property"));
		},
	);

	const selectedCount = Object.values(selected).filter(Boolean).length;

	const toggleSelect = (id: string) => {
		setSelected((prev) => {
			const isNowSelected = !prev[id];
			if (isNowSelected) {
				return { ...prev, [id]: true };
			}
			// remove the key when deselecting
			const { [id]: _removed, ...rest } = prev;
			return rest;
		});
	};

	const handleDelete = async () => {
		try {
			if (deleteType === "single" && propertyToDelete) {
				await deletePropertyRequest(propertyToDelete.id);
				toast.success("Property deleted successfully");
			} else if (deleteType === "bulk") {
				await Promise.all(Object.keys(selected).map((id) => deletePropertyRequest(id)));
				toast.success("Properties deleted successfully");
			}
			setConfirmOpen(false);
			setSelected({});
			setPropertyToDelete(null);
			refetch();
		} catch (err) {
			console.error("Error deleting property:", err);
			toast.error(extractErrorMessage(err, "Failed to delete property"));
		}
	};

	const isDeleting = false;

	const properties = React.useMemo((): PropertyData[] => {
		if (!propertiesData || typeof propertiesData !== "object") return [];
		const pd = propertiesData as { data?: unknown[] };
		const raw = Array.isArray(pd.data) ? pd.data : [];
		return raw.map((item) => item as PropertyData);
	}, [propertiesData]);

	const formatMoney = (v?: string | number | null) => {
		if (v === undefined || v === null || v === "") return "0";
		const n = Number(v);
		if (Number.isNaN(n)) return String(v);
		return n.toLocaleString();
	};
	const isEmpty = !isLoading && properties.length === 0;

	const filteredItems = React.useMemo(() => {
		return properties.filter((prod: PropertyData) => {
			switch (activeTab) {
				case "available":
					return true;
				case "low":
					return prod.quantityAvailable > 0 && prod.quantityAvailable <= 10;
				case "out":
					return prod.quantityAvailable === 0;
				default:
					return true;
			}
		});
	}, [properties, activeTab]);

	const paginatedItems = React.useMemo(() => {
		return filteredItems;
	}, [filteredItems]);

	const pages = Math.ceil(filteredItems.length / limit);

	React.useEffect(() => {
		if (propertiesData) {
			const totalPages = (propertiesData as any)?.pagination?.totalPages ?? 1;
			if (page > totalPages) {
				setPage(1);
			}
		}
	}, [propertiesData, page]);

	return (
		<div className="flex flex-col gap-y-6">
			<div className="min-h-96 flex">
				<CustomCard className="bg-white flex-grow w-full rounded-lg p-4 border border-gray-100">
					<div className="flex items-center justify-between flex-wrap gap-6">
						<div className="flex items-center gap-4">
							<Tabs
								value={activeTab}
								onValueChange={(value) => {
									setActiveTab(value);
									setPage(1);
								}}>
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
							<SearchWithFilters
								search={searchQuery}
								onSearchChange={(v) => {
									setSearchQuery(v);
									setPage(1);
								}}
								setPage={setPage}
								placeholder="Search by id, name or contact"
								fields={
									[
										{
											key: "limit",
											label: "Items per page",
											type: "select",
											options: [
												{ value: "5", label: "5" },
												{ value: "10", label: "10" },
												{ value: "20", label: "20" },
												{ value: "50", label: "50" },
											],
										},
										{
											key: "isPublic",
											label: "Visibility",
											type: "select",
											options: [
												{ value: "true", label: "Public" },
												{ value: "false", label: "Private" },
											],
										},
										{
											key: "sortBy",
											label: "Sort By",
											type: "sortBy",
											options: [
												{ value: "name", label: "name" },
												{ value: "price", label: "price" },
												{ value: "createdAt", label: "createdAt" },
												{ value: "updatedAt", label: "updatedAt" },
											],
										},
										{ key: "sortOrder", label: "Sort Order", type: "sortOrder" },
									] as FilterField[]
								}
								initialValues={{
									limit: String(limit),
									sortBy: sortBy || "",
									sortOrder: sortOrder || "",
									...(isPublicFilter && { isPublic: isPublicFilter }),
								}}
								onApply={(filters) => {
									setLimit(filters.limit ? Number(filters.limit) : 10);
									setSortBy(filters.sortBy || "createdAt");
									setSortOrder(filters.sortOrder || "desc");
									setIsPublicFilter(filters.isPublic || "");
									setPage(1);
								}}
								onReset={() => {
									setSearchQuery("");
									setIsPublicFilter("");
								}}
							/>
						</div>
					</div>

					<div className="w-full mt-8">
						{isLoading ? (
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
								{Array.from({ length: 10 }).map((_, i) => (
									<div key={i} className="bg-white dark:bg-neutral-700 rounded-md p-4">
										<RectangleSkeleton className="h-32 w-full mb-3" />
										<RectangleSkeleton className="h-4 w-3/4 mb-2" />
										<RectangleSkeleton className="h-4 w-1/2" />
									</div>
								))}
							</div>
						) : isEmpty ? (
							<EmptyData text="No Properties at the moment" />
						) : (
							<>
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
									{paginatedItems.map((prod: PropertyData) => {
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
														<p className="text-sm font-semibold text-primary mt-1">₦{formatMoney(prod.price)}</p>
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
																{canDelete && (
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
																)}
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
							</>
						)}
					</div>
					<CompactPagination
						page={page}
						pages={(propertiesData as any)?.pagination?.totalPages ?? pages}
						onPageChange={setPage}
						showRange
						total={(propertiesData as any)?.pagination?.total ?? filteredItems.length}
						perPage={limit}
					/>

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
										quantityTotal: propertyToEdit.quantityAvailable ?? propertyToEdit.quantityTotal ?? 0,
										quantityAssigned: propertyToEdit.quantityAssigned ?? 0,
										status: propertyToEdit.status?.status ?? "",
										condition: propertyToEdit.condition ?? "",
										description: propertyToEdit.description ?? "",
										category: propertyToEdit.category?.category ?? "",
										categoryId: propertyToEdit.category?.id ?? "",
										addedOn: new Date(propertyToEdit.dateAdded).toLocaleDateString("en-US", {
											year: "numeric",
											month: "long",
											day: "numeric",
										}),
										media: propertyToEdit.media || [media.images._product1],
										vehicleMake: propertyToEdit.vehicleMake ?? "",
										vehicleModel: propertyToEdit.vehicleModel ?? "",
										vehicleYear: propertyToEdit.vehicleYear ?? undefined,
										vehicleColor: propertyToEdit.vehicleColor ?? "",
										vehicleChassisNumber: propertyToEdit.vehicleChassisNumber ?? "",
										vehicleType: propertyToEdit.vehicleType ?? "",
										vehicleRegistrationNumber: propertyToEdit.vehicleRegistrationNumber ?? "",
										isPublic: propertyToEdit.isPublic,
									}
								: {
										id: "",
										name: "",
										price: "",
										quantityTotal: 0,
										quantityAssigned: 0,
										status: "",
										condition: "",
										description: "",
										category: "",
										categoryId: "",
										addedOn: "",
										media: [media.images._product1],
										vehicleMake: "",
										vehicleModel: "",
										vehicleYear: undefined,
										vehicleColor: "",
										vehicleChassisNumber: "",
										vehicleType: "",
										vehicleRegistrationNumber: "",
										isPublic: true,
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
									isPublic: typedFormData?.isPublic,
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
			</div>
		</div>
	);
}
