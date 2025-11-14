import CustomCard from "@/components/base/CustomCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EditIcon, FilterIcon, IconWrapper, PlusIcon, SearchIcon, TrashIcon } from "@/assets/icons";
import PageTitles from "@/components/common/PageTitles";
import { inputStyle, preTableButtonStyle } from "@/components/common/commonStyles";
import CustomInput from "@/components/base/CustomInput";
import CompactPagination from "@/components/ui/compact-pagination";
import React from "react";
import { useGetAllCategories, createCategory, updateCategory, deleteCategory } from "@/api/categories";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setCategories as setCategoriesAction } from "@/store/categoriesSlice";
import AddCategoryModal from "./AddCategoryModal";
import EmptyData from "../../components/common/EmptyData";
import ConfirmModal from "@/components/common/ConfirmModal";
import { TableSkeleton } from "@/components/common/Skeleton";
import { twMerge } from "tailwind-merge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { _router } from "../../routes/_router";

// (moved into component state)

export default function Categories() {
	const [isEmpty] = React.useState(false);
	const [categories, setCategories] = React.useState<any[]>([]);
	const [query, setQuery] = React.useState("");
	const [categoryFilter, setCategoryFilter] = React.useState<string | null>(null);
	const dispatch = useDispatch();
	const [page, setPage] = React.useState(1);
	const [limit] = React.useState(10);
	const { data: fetchedCategories, isLoading } = useGetAllCategories(page, limit, true);
	const queryClient = useQueryClient();

	const createMutation = useMutation<any, unknown, { category?: string; subCategories?: string[] }>({
		mutationFn: (vars: { category?: string; subCategories?: string[] }) =>
			createCategory({ category: vars.category, description: "", subcategories: vars.subCategories }),
		onMutate: async (newCat: { category?: string; subCategories?: string[] }) => {
			await queryClient.cancelQueries({ queryKey: ["categories"] });
			const prev = categories;
			const id = (newCat.category || "").toLowerCase().replace(/\s+/g, "-") || `tmp-${Date.now()}`;
			const optimistic = { id, title: newCat.category || "Untitled", subs: (newCat.subCategories || []).filter((s) => s.trim()), count: 0 };
			setCategories((prevState) => {
				const next = [...prevState, optimistic];
				dispatch(setCategoriesAction(next));
				return next;
			});
			return { prev };
		},
		onError: (_err: any, _newCat: any, context: any) => {
			if (context?.prev) {
				setCategories(context.prev);
				dispatch(setCategoriesAction(context.prev));
			}
		},
		onSettled: () => {
			// refetch to get canonical data
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});

	const updateMutation = useMutation<any, unknown, { id: string; category?: string; subCategories?: string[] }>({
		mutationFn: (vars: { id: string; category?: string; subCategories?: string[] }) => {
			console.log("Updating category with vars:", vars);
			return updateCategory(vars.id, { category: vars.category, description: "", subcategories: vars.subCategories as any });
		},
		onMutate: async ({ id, category, subCategories }: { id: string; category?: string; subCategories?: string[] }) => {
			await queryClient.cancelQueries({ queryKey: ["categories"] });
			const prev = categories;
			setCategories((prevState) => {
				const next = prevState.map((c) =>
					c.id === id ? { ...c, title: category ?? c.title, subs: (subCategories ?? c.subs).filter((s: string) => s.trim()) } : c
				);
				dispatch(setCategoriesAction(next));
				return next;
			});
			return { prev };
		},
		onError: (err: any, _vars: any, context: any) => {
			console.error("Update error:", err);
			if (context?.prev) {
				setCategories(context.prev);
				dispatch(setCategoriesAction(context.prev));
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});

	React.useEffect(() => {
		if (!fetchedCategories) return;
		console.log("fetched categories:", fetchedCategories);
		const mapped = ((fetchedCategories as any).data as any[]).map((c) => ({
			id: c.id,
			title: c.category || c.title || "",
			subs: Array.isArray(c.children) ? c.children.map((ch: any) => ch.category || ch.title) : [],
			count: c._count?.properties ?? c.count ?? 0,
		}));
		setCategories(mapped);
		dispatch(setCategoriesAction(mapped));
	}, [fetchedCategories, dispatch]);

	const [modalOpen, setModalOpen] = React.useState(false);
	const [modalMode, setModalMode] = React.useState<"add" | "edit">("add");
	const [editing, setEditing] = React.useState<{ id?: string; title?: string; subs?: string[] } | null>(null);

	// delete confirmation modal state
	const [confirmOpen, setConfirmOpen] = React.useState(false);
	const [toDelete, setToDelete] = React.useState<{ id?: string; title?: string } | null>(null);

	const deleteMutation = useMutation<any, unknown, string>({
		mutationFn: (id: string) => {
			return deleteCategory(id);
		},
		onMutate: async (id: string) => {
			await queryClient.cancelQueries({ queryKey: ["categories"] });
			const prev = categories;
			setCategories((prevState) => {
				const next = prevState.filter((c) => c.id !== id);
				dispatch(setCategoriesAction(next));
				return next;
			});
			return { prev };
		},
		onError: (_err: any, context: any) => {
			if (context?.prev) {
				setCategories(context.prev);
				dispatch(setCategoriesAction(context.prev));
			}
			toast.error("Failed to delete category");
		},
		onSuccess: () => {
			toast.success("Category deleted");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});

	return (
		<div className="flex flex-col gap-y-6">
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="All Categories" description="Manage your product categories" />
				<div className="flex items-center gap-3">
					<button type="button" className="flex items-center gap-2 bg-primary/10 rounded-sm px-4 py-2.5 active-scale transition text-primary">
						<span className="text-sm">Export</span>
					</button>

					<button
						type="button"
						onClick={() => {
							setModalMode("add");
							setEditing(null);
							setModalOpen(true);
						}}
						className="flex items-center gap-2 bg-primary rounded-sm px-4 py-2.5 active-scale transition text-white">
						<IconWrapper className="text-lg">
							<PlusIcon />
						</IconWrapper>
						<span className="text-sm">Add Category</span>
					</button>
				</div>
			</div>
			<div className="min-h-96 flex">
				{!isEmpty ? (
					<CustomCard className="bg-white flex-grow w-full rounded-lg p-4 border border-gray-100">
						<div className="w-full">
							<div className="flex items-center justify-between flex-wrap gap-6">
								<h2 className="font-medium">Product Categories</h2>
								<div className="flex items-center gap-2">
									<div className="relative md:w-80">
										<CustomInput
											placeholder="Search categories"
											aria-label="Search categories"
											className={twMerge(inputStyle, `max-w-[320px] h-10 pl-9`)}
											iconLeft={<SearchIcon />}
											value={query}
											onChange={(e) => setQuery(e.target.value)}
										/>

										{/* Confirm delete modal */}
										<ConfirmModal
											open={confirmOpen}
											onOpenChange={(o) => {
												setConfirmOpen(o);
												if (!o) setToDelete(null);
											}}
											title={toDelete ? `Delete ${toDelete.title}?` : "Delete category"}
											subtitle={toDelete ? `Are you sure you want to delete ${toDelete.title}? This action cannot be undone.` : undefined}
											actions={[
												{
													label: "Cancel",
													onClick: () => true,
													variant: "ghost",
												},
												{
													label: deleteMutation.isPending ? "Deleting..." : "Delete",
													onClick: async () => {
														if (!toDelete?.id) return false;
														await deleteMutation.mutateAsync(toDelete.id);
														return true;
													},
													loading: deleteMutation.isPending,
													variant: "destructive",
												},
											]}
										/>
									</div>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<button type="button" className={`${preTableButtonStyle} text-white bg-primary ml-auto`}>
												<IconWrapper className="text-base">
													<FilterIcon />
												</IconWrapper>
												<span className="hidden sm:inline">Filter</span>
											</button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="start" sideOffset={6} className="w-56">
											<DropdownMenuItem
												className="cursor-pointer capitalize"
												onSelect={() => {
													setCategoryFilter(null);
													setPage(1);
												}}>
												All
											</DropdownMenuItem>
											<div className="h-1" />
											{categories.map((c) => (
												<DropdownMenuItem
													key={c.id}
													className={"capitalize cursor-pointer"}
													onSelect={() => {
														setCategoryFilter(c.title ?? "");
														setPage(1);
													}}>
													{c.title}
												</DropdownMenuItem>
											))}
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</div>
							<div className="overflow-x-auto w-full mt-8">
								{isLoading ? (
									<TableSkeleton rows={6} cols={4} />
								) : (
									<Table>
										<TableHeader className="[&_tr]:border-0">
											<TableRow className="bg-[#EAF6FF] h-12 overflow-hidden py-4 rounded-lg">
												<TableHead>Product Categories</TableHead>
												<TableHead>Sub Categories</TableHead>
												<TableHead>Number Of Products</TableHead>
												<TableHead>Action</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{(() => {
												// apply search & filter locally
												const q = String(query ?? "")
													.trim()
													.toLowerCase();
												const filtered = categories.filter((row) => {
													if (categoryFilter) {
														if ((row.title || "").toLowerCase() !== categoryFilter.toLowerCase()) return false;
													}
													if (!q) return true;
													if ((row.title || "").toLowerCase().includes(q)) return true;
													if (Array.isArray(row.subs) && row.subs.join(" ").toLowerCase().includes(q)) return true;
													return false;
												});
												return filtered.map((row) => (
													<TableRow key={row.id} className="hover:bg-[#F6FBFF]">
														<TableCell className="text-[#13121280] align-top capitalize">{row.title}</TableCell>
														<TableCell className="text-[#13121280] align-top">
															<div className="text-balance w-80">{row.subs.join(", ")}</div>
														</TableCell>
														<TableCell className="text-[#13121280] align-top">{row.count}</TableCell>
														<TableCell className="flex items-center gap-1">
															<button
																type="button"
																className="p-2 flex items-center text-slate-600"
																onClick={() => {
																	setEditing({ id: row.id, title: row.title, subs: row.subs });
																	setModalMode("edit");
																	setModalOpen(true);
																}}>
																<IconWrapper className="text-xl">
																	<EditIcon />
																</IconWrapper>
															</button>
															<button
																type="button"
																className="text-red-500 bg-transparent p-2 flex items-center"
																onClick={() => {
																	setToDelete({ id: row.id, title: row.title });
																	setConfirmOpen(true);
																}}>
																<IconWrapper>
																	<TrashIcon />
																</IconWrapper>
															</button>
														</TableCell>
													</TableRow>
												));
											})()}
										</TableBody>
									</Table>
								)}
							</div>

							<AddCategoryModal
								open={modalOpen}
								onOpenChange={(open) => {
									setModalOpen(open);
									if (!open) setEditing(null);
								}}
								mode={modalMode}
								initial={editing ? { category: editing.title, subCategories: editing.subs } : undefined}
								onSave={async (payload) => {
									try {
										if (modalMode === "add") {
											await createMutation.mutateAsync({ category: payload.category, subCategories: payload.subCategories });
											toast.success("Category added");
											setTimeout(() => setModalOpen(false), 500);
										} else if (modalMode === "edit") {
											if (!editing?.id) {
												toast.error("No category selected for editing");
												return;
											}
											await updateMutation.mutateAsync({ id: editing.id, category: payload.category, subCategories: payload.subCategories });
											toast.success("Category updated");
											setTimeout(() => {
												setModalOpen(false);
												setEditing(null);
											}, 500);
										}
									} catch (e: any) {
										console.error("Save error:", e);
										const serverMessage = e?.data?.message || e?.message || String(e);
										toast.error(serverMessage || "Failed to save category");
									}
								}}
								savingStatus={(modalMode === "add" ? createMutation.status : updateMutation.status) as "idle" | "pending" | "success" | "error"}
							/>
						</div>

						<div className="mt-8">
							<CompactPagination
								page={page}
								pages={(fetchedCategories as any)?.pagination?.totalPages ?? 1}
								onPageChange={(p) => setPage(p)}
								total={(fetchedCategories as any)?.pagination?.total}
								perPage={limit}
							/>
						</div>
					</CustomCard>
				) : (
					<div className="flex-grow flex items-center justify-center">
						<EmptyData text="No Customers at the moment" />
					</div>
				)}
			</div>
		</div>
	);
}
