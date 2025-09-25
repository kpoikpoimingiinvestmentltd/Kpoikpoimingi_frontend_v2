import PageTitles from "../../../components/common/PageTitles";
import ReceiptTable from "@/dashboard/pages/Receipt/ReceiptTable";

export default function Receipt() {
	return (
		<div>
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="Receipt" description="This contains all the receipt of all payment done for kpoi kpoi mingi product" />
				<div className="flex items-center gap-3">
					<button type="button" className="flex items-center gap-2 bg-primary rounded-sm px-8 py-2.5 active-scale transition text-white">
						<span className="text-sm">Generate Receipt</span>
					</button>
				</div>
			</div>
			<ReceiptTable />
		</div>
	);
}
