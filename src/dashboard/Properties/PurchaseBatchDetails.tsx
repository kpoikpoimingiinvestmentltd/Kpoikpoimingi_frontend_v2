import CustomCard from "@/components/base/CustomCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PageTitles from "@/components/common/PageTitles";
import KeyValueRow from "@/components/common/KeyValueRow";
import EmptyData from "@/components/common/EmptyData";
import { useGetPurchaseBatchById } from "@/api/purchase";
import { Link, useParams } from "react-router";
import { _router } from "@/routes/_router";
import { TableSkeleton } from "@/components/common/Skeleton";

function formatMoney(value: string | number | undefined | null) {
	if (value == null || value === "") return "₦0";
	const n = Number(value);
	if (Number.isNaN(n)) return `₦${value}`;
	return `₦${n.toLocaleString()}`;
}

function formatDate(value: string | Date | undefined | null) {
	if (!value) return "—";
	return new Date(value).toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}

function allocationLabel(method: string | undefined) {
	if (method === "EQUAL") return "Equal split";
	if (method === "MANUAL") return "Manual amounts";
	if (method === "PURCHASE_PRICE_WEIGHTED") return "By purchase price";
	return method || "—";
}

export default function PurchaseBatchDetails() {
	const { id } = useParams<{ id: string }>();
	const { data, isLoading, isError, error } = useGetPurchaseBatchById(id);
	const batch = data as Record<string, unknown> | undefined;
	const purchases = (batch?.purchases as Array<Record<string, unknown>>) || [];
	const supplierName = (batch?.supplier as { name?: string } | undefined)?.name;

	return (
		<div className="flex flex-col gap-y-6">
			<PageTitles
				title={batch ? String(batch.reference || "Purchase Batch") : "Purchase Batch"}
				description="Batch procurement details"
			/>

			{isLoading ? (
				<CustomCard className="bg-white flex-grow w-full rounded-lg p-4 border border-gray-100">
					<TableSkeleton rows={6} cols={4} />
				</CustomCard>
			) : isError || !batch ? (
				<div className="min-h-96 flex flex-col">
					<EmptyData text={(error as { message?: string })?.message || "Batch not found"} />
				</div>
			) : (
				<>
					{/* Batch identity */}
					<CustomCard className="bg-white rounded-lg p-4 md:px-6 border border-gray-100">
						<section className="space-y-3">
							<KeyValueRow leftClassName="text-black" label="Batch Reference" value={String(batch.reference)} />
							<KeyValueRow leftClassName="text-black" label="Supplier" value={supplierName || "—"} />
							<KeyValueRow leftClassName="text-black" label="Purchase Date" value={formatDate(batch.purchaseDate as string)} />
							<KeyValueRow
								leftClassName="text-black"
								label="Number of Properties"
								value={String(batch.propertyCount ?? purchases.length)}
							/>
							<KeyValueRow
								leftClassName="text-black"
								label="Allocation Method"
								value={allocationLabel(batch.allocationMethod as string)}
							/>
							{batch.notes ? <KeyValueRow leftClassName="text-black" label="Notes" value={String(batch.notes)} /> : null}
						</section>
					</CustomCard>

					{/* Overall procurement cost — batch is the place for this picture */}
					<CustomCard className="bg-white rounded-lg p-4 md:px-6 border border-gray-100">
						<h2 className="font-medium mb-4">Cost Summary</h2>
						<section className="space-y-3">
							<KeyValueRow
								leftClassName="text-black"
								label="Total Purchase Price"
								value={formatMoney(batch.purchaseAmount as string)}
							/>
							<KeyValueRow
								leftClassName="text-black"
								label="Total Transportation"
								value={formatMoney(batch.transportationCost as string)}
							/>
							<KeyValueRow
								leftClassName="text-black"
								label="Total Miscellaneous"
								value={formatMoney(batch.miscellaneousCost as string)}
							/>
							<KeyValueRow
								leftClassName="text-black"
								label="Total Acquisition Cost"
								value={formatMoney(batch.totalAcquisitionCost as string)}
							/>
						</section>
					</CustomCard>

					{/* How those costs were allocated per property */}
					<CustomCard className="bg-white rounded-lg p-4 md:px-6 border border-gray-100">
						<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
							<h2 className="font-medium">Properties in Batch</h2>
						</div>
						{purchases.length === 0 ? (
							<p className="text-sm text-muted-foreground text-center py-8">No properties in this batch yet.</p>
						) : (
							<div className="overflow-x-auto w-full">
								<Table>
									<TableHeader className="[&_tr]:border-0">
										<TableRow className="bg-[#EAF6FF] dark:bg-neutral-900/80 h-12 overflow-hidden py-4 rounded-lg">
											<TableHead>Property</TableHead>
											<TableHead>Qty</TableHead>
											<TableHead>Purchase Price / Unit</TableHead>
											<TableHead>Allocated Transport</TableHead>
											<TableHead>Allocated Misc.</TableHead>
											<TableHead>Total Acquisition</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{purchases.map((p) => {
											const property = p.property as {
												id?: string;
												name?: string;
												propertyCode?: string;
											} | undefined;
											return (
												<TableRow key={p.id as string}>
													<TableCell>
														{property?.id ? (
															<Link
																to={_router.dashboard.propertiesDetails(property.id)}
																className="text-primary underline underline-offset-2 font-medium">
																{property.name || property.propertyCode}
															</Link>
														) : (
															"—"
														)}
													</TableCell>
													<TableCell>{String(p.quantity ?? "—")}</TableCell>
													<TableCell>{formatMoney(p.purchasePrice as string)}</TableCell>
													<TableCell>{formatMoney(p.allocatedTransportation as string)}</TableCell>
													<TableCell>{formatMoney(p.allocatedMiscellaneous as string)}</TableCell>
													<TableCell>{formatMoney(p.totalAcquisitionCost as string)}</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
							</div>
						)}
					</CustomCard>
				</>
			)}
		</div>
	);
}
