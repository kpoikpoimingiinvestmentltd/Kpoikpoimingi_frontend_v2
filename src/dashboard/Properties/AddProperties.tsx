import PageTitles from "@/components/common/PageTitles";
import CustomInput from "@/components/base/CustomInput";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { inputStyle } from "@/components/common/commonStyles";
import { twMerge } from "tailwind-merge";
import { IconWrapper, UploadCloudIcon } from "../../assets/icons";

export default function AddProperties() {
	return (
		<div className="max-w-6xl flex flex-col gap-y-5">
			<PageTitles title="Add Property" description="Fill in the details to add property for sales" />
			<div className="bg-white max-w-5xl px-4 py-6 lg:py-12 rounded-lg">
				<div className="w-full lg:w-10/12 mx-auto">
					<div className="border-2 border-dashed border-gray-200 min-h-36 flex items-center justify-center rounded-md p-6 mb-6 bg-[#f3fbff] relative">
						<div className="flex items-center justify-center gap-y-3 flex-col text-center text-black">
							<IconWrapper className="text-2xl rotate-y-180">
								<UploadCloudIcon />
							</IconWrapper>
							<p className="text-sm">Upload Voters card</p>
						</div>
						<button className="absolute top-4 right-4 bg-primary text-white px-3 py-1.5 rounded-sm text-sm flex items-center gap-2">
							<span>Upload</span>
							<IconWrapper>
								<UploadCloudIcon />
							</IconWrapper>
						</button>
					</div>

					<form className="space-y-5">
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
								<Select defaultValue="electronics">
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
								<Select defaultValue="mobile">
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
									label="Price *"
									labelClassName="block text-sm font-medium text-gray-700 mb-2"
									className={twMerge(inputStyle)}
									defaultValue="300,000"
								/>
							</div>
							<div>
								<CustomInput
									label="Quantity*"
									labelClassName="block text-sm font-medium text-gray-700 mb-2"
									type="number"
									className={twMerge(inputStyle)}
									defaultValue={8}
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Product Description*</label>
							<Textarea className={twMerge(inputStyle, "h-auto min-h-24")} rows={8} defaultValue={"25kg gas cylinder"} />
						</div>

						<div className="flex justify-center mt-16">
							<Button type="submit" className="w-full md:w-1/2 rounded-md py-3 sm:!py-4 h-auto text-base active-scale">
								Add Property
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
