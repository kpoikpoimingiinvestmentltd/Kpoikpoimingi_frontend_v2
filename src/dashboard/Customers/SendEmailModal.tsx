import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { modalContentStyle, tabListStyle, tabStyle, labelStyle, inputStyle } from "@/components/common/commonStyles";
import CustomInput from "@/components/base/CustomInput";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { twMerge } from "tailwind-merge";

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	customers?: Array<{ id: string; email: string; name?: string }>;
	onSend?: (data: SendEmailData) => void | Promise<void>;
};

export type SendEmailData = {
	tab: "specific" | "all";
	emailAddresses: string[];
	subject: string;
	details: string;
};

export default function SendEmailModal({ open, onOpenChange, customers = [], onSend }: Props) {
	const [activeTab, setActiveTab] = useState<"specific" | "all">("specific");
	const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
	const [subject, setSubject] = useState("");
	const [details, setDetails] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [showEmailDropdown, setShowEmailDropdown] = useState(false);

	const handleSelectEmail = (email: string) => {
		if (!selectedEmails.includes(email)) {
			setSelectedEmails([...selectedEmails, email]);
		}
		setShowEmailDropdown(false);
	};

	const handleRemoveEmail = (email: string) => {
		setSelectedEmails(selectedEmails.filter((e) => e !== email));
	};

	const handleSend = async () => {
		try {
			setIsLoading(true);
			const data: SendEmailData = {
				tab: activeTab,
				emailAddresses: activeTab === "all" ? customers.map((c) => c.email) : selectedEmails,
				subject,
				details,
			};
			await onSend?.(data);
			// Reset form
			setSelectedEmails([]);
			setSubject("");
			setDetails("");
			onOpenChange(false);
		} catch (error) {
			console.error("Error sending email:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const getAvailableEmails = () => {
		return customers.filter((c) => !selectedEmails.includes(c.email));
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className={modalContentStyle("md:max-w-2xl")}>
				<DialogHeader>
					<DialogTitle className="text-center">Send Email</DialogTitle>
				</DialogHeader>

				<div className="max-w-lg w-full mt-5 mx-auto">
					<Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
						<TabsList className={twMerge(tabListStyle, "justify-center w-full")}>
							<TabsTrigger value="specific" className={twMerge(tabStyle, "justify-center")}>
								Send One /Specific Customers
							</TabsTrigger>
							<TabsTrigger value="all" className={twMerge(tabStyle, "justify-center")}>
								Send All Customers
							</TabsTrigger>
						</TabsList>

						<div className="mt-6">
							{/* Specific Customers Tab */}
							<TabsContent value="specific" className="space-y-4">
								<div>
									<label className={labelStyle()}>User Email Addresses*</label>
									<div className="relative">
										<DropdownMenu open={showEmailDropdown} onOpenChange={setShowEmailDropdown}>
											<DropdownMenuTrigger asChild>
												<div className={twMerge(inputStyle, "cursor-pointer flex flex-wrap gap-2 items-start min-h-16 p-2")}>
													{selectedEmails.length === 0 ? (
														<span className="text-stone-400 text-sm">Select email addresses</span>
													) : (
														selectedEmails.map((email) => (
															<div key={email} className="bg-primary/20 text-primary px-2 py-1 rounded text-xs flex items-center gap-2">
																{email}
																<button
																	type="button"
																	onClick={(e) => {
																		e.stopPropagation();
																		handleRemoveEmail(email);
																	}}
																	className="text-primary hover:text-primary/80">
																	×
																</button>
															</div>
														))
													)}
												</div>
											</DropdownMenuTrigger>
											{getAvailableEmails().length > 0 && (
												<DropdownMenuContent className="w-full min-w-80">
													{getAvailableEmails().map((customer) => (
														<DropdownMenuItem key={customer.id} onClick={() => handleSelectEmail(customer.email)}>
															{customer.email}
														</DropdownMenuItem>
													))}
												</DropdownMenuContent>
											)}
										</DropdownMenu>
									</div>
								</div>

								<div>
									<label className={labelStyle()}>Input Email Sub Heading*</label>
									<CustomInput
										placeholder="Enter Here"
										value={subject}
										onChange={(e) => setSubject(e.target.value)}
										className={twMerge(inputStyle)}
									/>
								</div>

								<div>
									<label className={labelStyle()}>Input Email Details*</label>
									<Textarea
										placeholder="Enter Here"
										value={details}
										onChange={(e) => setDetails(e.target.value)}
										className={twMerge(inputStyle, "min-h-24")}
									/>
								</div>
							</TabsContent>

							{/* All Customers Tab */}
							<TabsContent value="all" className="space-y-4">
								<div>
									<label className={labelStyle()}>Input Email Sub Heading*</label>
									<CustomInput
										placeholder="Enter Here"
										value={subject}
										onChange={(e) => setSubject(e.target.value)}
										className={twMerge(inputStyle)}
									/>
								</div>

								<div>
									<label className={labelStyle()}>Input Email Details*</label>
									<Textarea
										placeholder="Enter Here"
										value={details}
										onChange={(e) => setDetails(e.target.value)}
										className={twMerge(inputStyle, "min-h-24")}
									/>
								</div>
							</TabsContent>
						</div>
					</Tabs>
					<div className="mt-10 mb-8 flex justify-center">
						<Button
							onClick={handleSend}
							disabled={isLoading || !subject || !details || (activeTab === "specific" && selectedEmails.length === 0)}
							className="w-full bg-primary text-white min-h-11 hover:bg-primary/90 py-2 h-auto">
							Send Email Now
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
