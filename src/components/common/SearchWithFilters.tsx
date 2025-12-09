import React from "react";
import CustomInput from "@/components/base/CustomInput";
import ActionButton from "@/components/base/ActionButton";
import { inputStyle, preTableButtonStyle } from "@/components/common/commonStyles";
import { IconWrapper, SearchIcon, FilterIcon } from "@/assets/icons";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export type FilterOption = { value: string; label: string };
export type FilterField =
	| { key: string; label: string; type: "text"; placeholder?: string }
	| { key: string; label: string; type: "date" }
	| { key: string; label: string; type: "select"; options: FilterOption[] }
	| { key: string; label: string; type: "sortBy"; options?: FilterOption[] }
	| { key: string; label: string; type: "sortOrder" }
	| { key: string; label: string; type: "boolean" };

type Props = {
	search: string;
	onSearchChange: (v: string) => void;
	setPage?: (p: number) => void;
	placeholder?: string;
	showFilter?: boolean;
	fields?: FilterField[];
	initialValues?: Record<string, string>;
	onApply: (filters: Record<string, string>) => void;
	onReset?: () => void;
};

export default function SearchWithFilters({
	search,
	onSearchChange,
	setPage,
	placeholder = "Search...",
	showFilter = true,
	fields = [],
	initialValues = {},
	onApply,
	onReset,
}: Props) {
	const [open, setOpen] = React.useState(false);
	const [values, setValues] = React.useState<Record<string, string>>(initialValues || {});

	React.useEffect(() => setValues(initialValues || {}), [initialValues]);

	const handleChange = (k: string, v: string) => setValues((s) => ({ ...s, [k]: v }));

	const handleReset = () => {
		setValues({});
		if (onReset) onReset();
	};

	const handleApply = () => {
		const cleaned: Record<string, string> = {};
		Object.entries(values).forEach(([k, v]) => {
			if (v != null && String(v).trim() !== "" && String(v) !== "__NONE__") cleaned[k] = String(v).trim();
		});
		onApply(cleaned);
		setOpen(false);
	};

	return (
		<div className="flex items-center gap-2">
			<div className="relative md:w-80">
				<CustomInput
					placeholder={placeholder}
					aria-label={placeholder}
					className={`max-w-[320px] ${inputStyle} h-10 pl-9`}
					iconLeft={<SearchIcon />}
					value={search}
					onChange={(e) => {
						onSearchChange(e.target.value);
						if (typeof setPage === "function") setPage(1);
					}}
				/>
			</div>

			{showFilter && (
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<ActionButton type="button" className={`${preTableButtonStyle} text-white bg-primary`}>
							<IconWrapper className="text-base">
								<FilterIcon />
							</IconWrapper>
							<span className="hidden sm:inline">Filter</span>
						</ActionButton>
					</PopoverTrigger>

					<PopoverContent className="w-[320px] max-h-[400px] overflow-y-auto px-3.5 py-3">
						<div className="mb-4">
							<h5 className="text-sm text-gray-600">Filter Options</h5>
						</div>
						<div className="space-y-3">
							{fields.map((f) => (
								<div key={f.key}>
									<Label className="text-xs">{f.label}</Label>
									<div className="mt-1">
										{f.type === "text" && (
											<input
												className="w-full rounded-md border px-3 py-2 text-sm"
												value={values[f.key] || ""}
												onChange={(e) => handleChange(f.key, e.target.value)}
												placeholder={(f as any).placeholder || ""}
											/>
										)}

										{f.type === "date" && (
											<input
												type="date"
												className="w-full rounded-md border px-3 py-2 text-sm"
												value={values[f.key] || ""}
												onChange={(e) => handleChange(f.key, e.target.value)}
											/>
										)}

										{f.type === "select" && (
											<Select value={values[f.key] || ""} onValueChange={(v) => handleChange(f.key, v)}>
												<SelectTrigger className="text-sm w-full mt-0 cursor-pointer">
													<SelectValue placeholder={`Select ${f.label}`} />
												</SelectTrigger>
												<SelectContent>
													<SelectItem className="text-xs cursor-pointer" value="__NONE__">
														--
													</SelectItem>
													{(f.options || []).map((o) => (
														<SelectItem className="text-xs cursor-pointer" key={o.value} value={o.value}>
															{o.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										)}

										{f.type === "sortBy" && (
											<Select value={values[f.key] || ""} onValueChange={(v) => handleChange(f.key, v)}>
												<SelectTrigger className="text-sm w-full mt-0 cursor-pointer">
													<SelectValue placeholder={`Select ${f.label}`} />
												</SelectTrigger>
												<SelectContent>
													<SelectItem className="text-xs cursor-pointer" value="__NONE__">
														--
													</SelectItem>
													{(f.options || []).map((o) => (
														<SelectItem className="text-xs cursor-pointer" key={o.value} value={o.value}>
															{o.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										)}

										{f.type === "sortOrder" && (
											<Select value={values[f.key] || ""} onValueChange={(v) => handleChange(f.key, v)}>
												<SelectTrigger className="text-sm w-full mt-0 cursor-pointer">
													<SelectValue placeholder={`Select ${f.label}`} />
												</SelectTrigger>
												<SelectContent>
													<SelectItem className="text-xs cursor-pointer" value="__NONE__">
														--
													</SelectItem>
													<SelectItem className="text-xs cursor-pointer" value="asc">
														asc
													</SelectItem>
													<SelectItem className="text-xs cursor-pointer" value="desc">
														desc
													</SelectItem>
												</SelectContent>
											</Select>
										)}

										{f.type === "boolean" && (
											<Select value={values[f.key] || ""} onValueChange={(v) => handleChange(f.key, v)}>
												<SelectTrigger className="text-sm w-full mt-0 cursor-pointer">
													<SelectValue placeholder={`Select ${f.label}`} />
												</SelectTrigger>
												<SelectContent>
													<SelectItem className="text-xs cursor-pointer" value="__NONE__">
														--
													</SelectItem>
													<SelectItem className="text-xs cursor-pointer" value="true">
														true
													</SelectItem>
													<SelectItem className="text-xs cursor-pointer" value="false">
														false
													</SelectItem>
												</SelectContent>
											</Select>
										)}
									</div>
								</div>
							))}

							<div className="flex bg-white sticky -bottom-3 py-2 items-center justify-between gap-2 pt-2">
								<ActionButton type="button" variant="ghost" className="px-3 py-2 text-xs" onClick={handleReset}>
									Reset
								</ActionButton>
								<div className="flex gap-2">
									<ActionButton type="button" variant="outline" className="px-3 py-2 text-xs" onClick={() => setOpen(false)}>
										Close
									</ActionButton>
									<ActionButton type="button" className="px-3 py-2 text-xs" onClick={handleApply}>
										Apply
									</ActionButton>
								</div>
							</div>
						</div>
					</PopoverContent>
				</Popover>
			)}
		</div>
	);
}
