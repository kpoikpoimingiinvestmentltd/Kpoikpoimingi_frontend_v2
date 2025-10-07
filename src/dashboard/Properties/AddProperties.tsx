import PageTitles from "@/components/common/PageTitles";
import CustomInput from "@/components/base/CustomInput";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { inputStyle } from "@/components/common/commonStyles";
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { IconWrapper, CheckIcon } from "@/assets/icons";
import { twMerge } from "tailwind-merge";
import ImageGallery from "@/components/base/ImageGallery";

export default function AddProperties() {
	const [successOpen, setSuccessOpen] = React.useState(false);
	const [category, setCategory] = React.useState<string>("electronics");
	const [subCategory, setSubCategory] = React.useState<string>("mobile");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setSuccessOpen(true);
	};

	return (
		<div className="max-w-6xl flex flex-col gap-y-5">
			<PageTitles title="Add Property" description="Fill in the details to add property for sales" />
			<div className="bg-white max-w-5xl px-4 py-6 lg:py-12 rounded-lg">
				<div className="w-full lg:w-10/12 mx-auto">
					<ImageGallery
						mode="upload"
						placeholderText="Upload Voters card"
						uploadButtonText="Upload"
						className="min-h-28 mb-8"
						containerBorder="dashed"
						thumbBg="bg-primary/10"
						thumbVariant="dashed"
					/>

					<form className="space-y-5" onSubmit={handleSubmit}>
						<div>
							<CustomInput
								label="Property Name*"
								labelClassName="block text-sm font-medium text-gray-700 mb-2"
								type="text"
								className={twMerge(inputStyle)}
								defaultValue="25kg gas cylinder"
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Property Category*</label>
								<Select value={category} onValueChange={(v) => setCategory(v)}>
									<SelectTrigger className={twMerge(inputStyle, "w-full min-h-11")}>
										<SelectValue placeholder="Choose Category" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="electronics">Electronics</SelectItem>
										<SelectItem value="vehicles">Vehicles & Automobiles</SelectItem>
										<SelectItem value="fashion">Fashion</SelectItem>
										<SelectItem value="home">Home & Kitchen</SelectItem>
										<SelectItem value="babies">Babies, Kids & Toys</SelectItem>
										<SelectItem value="phones">Phones & Accessories</SelectItem>
										<SelectItem value="computer">Computer & Accessories</SelectItem>
										<SelectItem value="sport">Sport & Fitness</SelectItem>
										<SelectItem value="books">Books & Stationaries</SelectItem>
										<SelectItem value="properties">Properties</SelectItem>
										<SelectItem value="tools">Tools & Hardware</SelectItem>
										<SelectItem value="services">Services</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Sub Category*</label>
								<Select value={subCategory} onValueChange={(v) => setSubCategory(v)}>
									<SelectTrigger className={twMerge(inputStyle, "w-full min-h-11")}>
										<SelectValue placeholder="Select Sub Category" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="mobile">Mobile Phones & Tablets</SelectItem>
										<SelectItem value="laptops">Laptops & Computers</SelectItem>
										<SelectItem value="televisions">Televisions</SelectItem>
										<SelectItem value="audio">Home Audio & Speakers</SelectItem>
										<SelectItem value="cameras">Cameras & Drones</SelectItem>
										<SelectItem value="gaming">Gaming Consoles</SelectItem>
										<SelectItem value="accessories">Accessories (Chargers, Headphones, Power Banks)</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<CustomInput
									label="Price"
									required
									labelClassName="block text-sm font-medium text-gray-700 mb-2"
									className={twMerge(inputStyle)}
									defaultValue="300,000"
								/>
							</div>
							<div>
								<CustomInput
									label="Quantity"
									required
									labelClassName="block text-sm font-medium text-gray-700 mb-2"
									type="number"
									className={twMerge(inputStyle)}
									defaultValue={8}
								/>
							</div>
						</div>

						{/* vehicle-specific fields */}
						{category && category.toLowerCase().includes("veh") && (
							<>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<CustomInput label="Vehicle Make" required className={twMerge(inputStyle)} defaultValue={"Daihatsu"} />{" "}
									<CustomInput required label="Type" className={twMerge(inputStyle)} defaultValue={"Truck"} />
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<CustomInput label="Color" required className={twMerge(inputStyle)} defaultValue={"Custom"} />
									<CustomInput label="Registration Number" required className={twMerge(inputStyle)} defaultValue={"Kano - MJB815XA"} />
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<CustomInput required label="Chassis Number*" className={twMerge(inputStyle)} defaultValue={"S211P0085561"} />
									<CustomInput required label="Condition" className={twMerge(inputStyle)} defaultValue={"Foreign Used"} />
								</div>
							</>
						)}

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Product Description*</label>
							<Textarea className={twMerge(inputStyle, "h-auto min-h-24")} rows={8} defaultValue={"25kg gas cylinder"} />
						</div>

						<div className="flex justify-center mt-16">
							<Button type="submit" className="w-full md:w-1/2 rounded-md py-3 h-auto text-base active-scale">
								Add Property
							</Button>
						</div>
					</form>

					<Dialog open={successOpen} onOpenChange={setSuccessOpen}>
						<DialogContent className="max-w-xl">
							<div className="text-center pt-6">
								<div>
									<IconWrapper className="text-5xl text-green-600">
										<CheckIcon />
									</IconWrapper>
								</div>
								<div className="text-lg font-medium mt-4">Property Added</div>
								<div className="mt-2 text-sm text-muted-foreground">Property has been added successfully</div>
							</div>

							<footer className="flex items-center gap-6 justify-center py-4">
								<button onClick={() => setSuccessOpen(false)} className="bg-primary w-full max-w-36 mx-auto text-white px-8 py-2.5 rounded-md">
									Ok
								</button>
							</footer>
						</DialogContent>
					</Dialog>
				</div>
			</div>
		</div>
	);
}
