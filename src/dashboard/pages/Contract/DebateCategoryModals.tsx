import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

export function ViewCategoryModal({ open, onOpenChange, category }: { open: boolean; onOpenChange: (o: boolean) => void; category: any | null }) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>View Category</DialogTitle>
				</DialogHeader>
				<div className="py-2">
					<p className="text-sm">
						Name: <strong>{category?.name}</strong>
					</p>
					<p className="text-sm">Slug: {category?.slug}</p>
					<p className="text-sm">Created: {category?.date}</p>
				</div>
				<DialogFooter>
					<Button onClick={() => onOpenChange(false)}>Close</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export function EditCategoryModal({
	open,
	onOpenChange,
	category,
	onSave,
}: {
	open: boolean;
	onOpenChange: (o: boolean) => void;
	category: any | null;
	onSave: (c: any) => void;
}) {
	const [name, setName] = useState(category?.name ?? "");

	// Keep name in sync when category changes
	useEffect(() => {
		if (open && category) setName(category.name ?? "");
	}, [open, category]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Category</DialogTitle>
				</DialogHeader>
				<div className="py-2">
					<Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" />
				</div>
				<DialogFooter>
					<Button variant="ghost" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button
						onClick={() => {
							if (category) onSave({ ...category, name });
							onOpenChange(false);
						}}>
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export function DeleteCategoryModal({
	open,
	onOpenChange,
	category,
	onDelete,
}: {
	open: boolean;
	onOpenChange: (o: boolean) => void;
	category: any | null;
	onDelete: (id: string) => void;
}) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete Category</DialogTitle>
				</DialogHeader>
				<div className="py-2">
					<p>
						Are you sure you want to delete <strong>{category?.name}</strong>?
					</p>
				</div>
				<DialogFooter>
					<Button variant="ghost" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button
						className="text-destructive"
						onClick={() => {
							if (category) onDelete(category.id);
							onOpenChange(false);
						}}>
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
