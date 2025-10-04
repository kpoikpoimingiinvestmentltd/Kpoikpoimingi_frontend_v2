import CustomCard from "@/components/base/CustomCard";
import { IconWrapper, PlusIcon, SearchIcon, ThreeDotsIcon, EditIcon, TrashIcon } from "@/assets/icons";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Image from "@/components/base/Image";
import { media } from "@/resources/images";
import PageTitles from "@/components/common/PageTitles";
import { inputStyle, tabListStyle, tabStyle } from "@/components/common/commonStyles";
import CustomInput from "@/components/base/CustomInput";
import CompactPagination from "@/components/ui/compact-pagination";
import React from "react";
import EmptyData from "@/components/common/EmptyData";
import { Link } from "react-router";
import { _router } from "../../routes/_router";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";

const users = [
	{
		name: "Kenny Banks James",
		phone: "+234812345678",
		role: "Admin",
		assigned: 0,
		salary: "500,000",
	},
	{
		name: "Kenny Banks James",
		phone: "+234812345678",
		role: "Admin",
		assigned: 0,
		salary: "500,000",
	},
	{
		name: "Kenny Banks James",
		phone: "+234812345678",
		role: "Sales Person",
		assigned: 8,
		salary: "500,000",
	},
	{
		name: "Kenny Banks James",
		phone: "+234812345678",
		role: "Sales Person",
		assigned: 0,
		salary: "500,000",
	},
];

export default function Properties() {
	const [isEmpty] = React.useState(false);
	const [page, setPage] = React.useState(1);
	const pages = Math.max(1, Math.ceil(users.length / 10));

	return (
		<div className="flex flex-col gap-y-6">
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="Properties" description="All properties listed for sell" />
				<div className="flex items-center gap-3">
					<Link
						to={_router.dashboard.addUser}
						className="flex items-center gap-2 bg-primary rounded-sm px-8 py-2.5 active-scale transition text-white">
						<IconWrapper className="text-lg">
							<PlusIcon />
						</IconWrapper>
						<span className="text-sm">Add User</span>
					</Link>
				</div>
			</div>

			<div className="min-h-96 flex">
				{!isEmpty ? (
					<CustomCard className="bg-white flex-grow w-full rounded-lg p-4 border border-gray-100">
						<>
							<div className="w-full">
								<div className="flex items-center justify-between flex-wrap gap-6">
									<div className="flex items-center gap-4">
										<Tabs defaultValue="available">
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
												aria-label="Search payments"
												className={`max-w-[320px] ${inputStyle} h-10 pl-9`}
												iconLeft={<SearchIcon />}
											/>
										</div>
									</div>
								</div>
								<div className="w-full mt-8">
									<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
										{[
											{ id: "p1", title: "25 kg Gas Cylinder", price: "₦ 50,000", img: media.images._product1 },
											{ id: "p2", title: "Hp 12 inches laptop", price: "₦ 50,000", img: media.images._product2 },
											{ id: "p3", title: "LG two space Fridge", price: "₦ 50,000", img: media.images._product3 },
											{ id: "p4", title: "Medium tiger generator", price: "₦ 50,000", img: media.images._product4 },
											{ id: "p5", title: "25 kg Gas Cylinder", price: "₦ 50,000", img: media.images._product5 },
											{ id: "p6", title: "Hp 12 inches laptop", price: "₦ 50,000", img: media.images._product1 },
											{ id: "p7", title: "LG two space Fridge", price: "₦ 50,000", img: media.images._product2 },
											{ id: "p8", title: "Medium tiger generator", price: "₦ 50,000", img: media.images._product3 },
											{ id: "p9", title: "25 kg Gas Cylinder", price: "₦ 50,000", img: media.images._product4 },
											{ id: "p10", title: "Hp 12 inches laptop", price: "₦ 50,000", img: media.images._product5 },
											{ id: "p11", title: "LG two space Fridge", price: "₦ 50,000", img: media.images._product1 },
											{ id: "p12", title: "Medium tiger generator", price: "₦ 50,000", img: media.images._product2 },
										].map((prod) => (
											<div key={prod.id} className="bg-white rounded-md p-4 relative">
												<div className="h-24 md:h-32 flex items-center justify-center overflow-hidden">
													<Image src={prod.img} alt={prod.title} className="max-h-full object-contain" />
												</div>
												<div className="mt-3">
													<div className="text-sm font-medium">{prod.title}</div>
													<div className="flex items-center justify-between gap-2">
														<div className="text-sm mt-1">{prod.price}</div>{" "}
														<DropdownMenu>
															<DropdownMenuTrigger asChild>
																<button className="text-primary">
																	<IconWrapper>
																		<ThreeDotsIcon />
																	</IconWrapper>
																</button>
															</DropdownMenuTrigger>
															<DropdownMenuContent align="end" sideOffset={6} className="w-44 shadow-md px-2">
																<DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
																	<IconWrapper className="text-base">
																		<EditIcon />
																	</IconWrapper>
																	<span>Edit details</span>
																</DropdownMenuItem>
																<DropdownMenuItem className="flex items-center gap-2 text-red-600 cursor-pointer">
																	<IconWrapper className="text-base">
																		<TrashIcon />
																	</IconWrapper>
																	<span>Delete</span>
																</DropdownMenuItem>
															</DropdownMenuContent>
														</DropdownMenu>
													</div>
													<div className="text-xs text-amber-600 mt-1">3 Items Left.</div>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</>

						<CompactPagination page={page} pages={pages} onPageChange={setPage} showRange />
					</CustomCard>
				) : (
					<EmptyData text="No Payments at the moment" />
				)}
			</div>
		</div>
	);
}
