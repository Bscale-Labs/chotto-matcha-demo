"use client";

import { clsx } from "clsx";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { unstable_rethrow } from "next/navigation";
import { useEffect, useId, useRef, useState, useTransition, type DragEvent } from "react";
import { createReward, deleteImageAsset, updateReward, uploadOrgAsset } from "@/app/manager/actions";
import { Button } from "@/components/shared/button";
import {
  DirtyFieldsProvider,
  DirtySaveButton,
  TrackedInput,
  TrackedSelect,
  TrackedTextarea,
  useDirtyFields
} from "@/components/shared/dirty-form";
import { Modal } from "@/components/shared/modal";
import { getToastErrorMessage, useToast } from "@/components/shared/toast-provider";

type RewardDetailsFormProps =
  | {
      mode: "create";
      assetPool: ImageAsset[];
    }
  | {
      mode: "edit";
      reward: {
        id: string;
        name: string;
        description: string;
        pointCost: number;
        type: "item" | "merch";
        active: boolean;
        imageAssetId: string | null;
        imageUrl: string | null;
      };
      assetPool: ImageAsset[];
    };

type ImageAsset = {
  id: string;
  filename: string;
  imageUrl: string;
};

function setRoundedDragPreview(event: DragEvent<HTMLDivElement>) {
  const source = event.currentTarget;
  const rect = source.getBoundingClientRect();
  const preview = source.cloneNode(true) as HTMLElement;

  preview.style.position = "fixed";
  preview.style.top = "-1000px";
  preview.style.left = "-1000px";
  preview.style.width = `${rect.width}px`;
  preview.style.height = `${rect.height}px`;
  preview.style.overflow = "hidden";
  preview.style.borderRadius = "8px";
  preview.style.pointerEvents = "none";

  document.body.appendChild(preview);
  event.dataTransfer.setDragImage(preview, rect.width / 2, rect.height / 2);
  window.setTimeout(() => preview.remove(), 0);
}

export function RewardDetailsForm(props: RewardDetailsFormProps) {
  const { showSuccess, showError } = useToast();
  const imageInputId = useId();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const isEdit = props.mode === "edit";
  const reward = isEdit ? props.reward : null;
  const initialAssetId = props.mode === "edit" ? props.reward.imageAssetId ?? "" : "";
  const [selectedAssetId, setSelectedAssetId] = useState(initialAssetId);
  const [draggedImageId, setDraggedImageId] = useState<string | null>(null);
  const [galleryOrder, setGalleryOrder] = useState<string[]>([]);
  const [availableAssets, setAvailableAssets] = useState(props.assetPool);
  const [isDeletingAsset, startAssetDelete] = useTransition();
  const [isUploading, startUpload] = useTransition();
  const { ctx, report } = useDirtyFields(props.mode);
  const assetPool = availableAssets;
  const selectedAsset = assetPool.find((asset) => asset.id === selectedAssetId);

  // Image choice/order isn't a form field, so it reports its own dirtiness.
  useEffect(() => {
    report("reward-image", selectedAssetId !== initialAssetId || galleryOrder.length > 0);
  }, [selectedAssetId, galleryOrder, initialAssetId, report]);

  const usesCurrentRewardImage = Boolean(
    reward?.imageUrl &&
    reward.imageAssetId &&
    selectedAssetId === reward.imageAssetId
  );
  const primaryImageUrl = selectedAsset?.imageUrl ?? (usesCurrentRewardImage ? reward?.imageUrl : null);
  const galleryItems = (selectedAsset || usesCurrentRewardImage
    ? [{
        id: selectedAsset ? `asset-${selectedAsset.id}` : "current",
        assetId: selectedAsset?.id ?? reward?.imageAssetId ?? null,
        imageUrl: selectedAsset?.imageUrl ?? reward?.imageUrl ?? null,
        label: selectedAsset?.filename ?? "Current image"
      }]
    : []
  ).sort((left, right) => {
    const leftIndex = galleryOrder.indexOf(left.id);
    const rightIndex = galleryOrder.indexOf(right.id);
    return (leftIndex === -1 ? 999 : leftIndex) - (rightIndex === -1 ? 999 : rightIndex);
  });

  // Upload straight into the org asset pool. This is independent of the reward's
  // save state: it does NOT select the image or mark the form dirty. Choosing it
  // from the pool (or reordering) is the separate step that enables Save.
  function uploadToPool(file: File) {
    startUpload(async () => {
      try {
        const formData = new FormData();
        formData.append("image", file);
        const asset = await uploadOrgAsset(formData);
        setAvailableAssets((assets) => [asset, ...assets.filter((existing) => existing.id !== asset.id)]);
        showSuccess("Image added to pool", "Choose it below to use it for this reward.");
      } catch (error) {
        showError("Could not upload image", getToastErrorMessage(error));
      }
    });
  }

  function deselectImage() {
    setSelectedAssetId("");
  }

  function deleteAssetFromPool(assetId: string) {
    startAssetDelete(async () => {
      try {
        await deleteImageAsset(assetId);
        setAvailableAssets((assets) => assets.filter((asset) => asset.id !== assetId));
        if (selectedAssetId === assetId) {
          setSelectedAssetId("");
        }
        showSuccess("Image deleted", "The asset pool was updated.");
      } catch (error) {
        showError("Could not delete image", getToastErrorMessage(error));
      }
    });
  }

  // The action redirects on success (toast shown via the URL param on the next
  // page). We catch failures — oversized images, validation, network — into a
  // toast, and re-throw the redirect so navigation still happens.
  async function submit(formData: FormData) {
    try {
      await (isEdit ? updateReward(formData) : createReward(formData));
    } catch (error) {
      unstable_rethrow(error);
      showError(isEdit ? "Could not save reward" : "Could not create reward", getToastErrorMessage(error));
    }
  }

  return (
    <DirtyFieldsProvider value={ctx}>
      <form
        action={submit}
        className="surface-paper grid max-w-2xl gap-4 rounded-lg p-6"
      >
        {reward ? <input type="hidden" name="id" value={reward.id} /> : null}
        <input type="hidden" name="imageAssetId" value={selectedAssetId} />
        <input
          ref={imageInputRef}
          id={imageInputId}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            // Reset so re-picking the same file fires change again.
            event.target.value = "";
            if (file) uploadToPool(file);
          }}
        />
        <div className="grid items-stretch gap-4 sm:grid-cols-[196px_1fr]">
          <button
            type="button"
            className="grid min-h-[204px] place-items-center overflow-hidden rounded-md border border-line bg-stone text-center text-sm font-medium text-ink-muted sm:h-full"
            onClick={() => setGalleryOpen(true)}
          >
            {primaryImageUrl ? (
              <Image src={primaryImageUrl} alt="" width={196} height={204} className="h-full w-full object-cover" />
            ) : (
              <span className="px-4">Reward image</span>
            )}
          </button>
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-charcoal">
              Title
              <TrackedInput
                name="name"
                required
                defaultValue={reward?.name}
                placeholder="Reward title"
                className="h-12 rounded-md border border-line bg-cream px-4 text-base font-normal focus:border-matcha-deep focus:outline-none focus:shadow-focus"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-charcoal">
              Description
              <TrackedTextarea
                name="description"
                required
                defaultValue={reward?.description}
                placeholder="Description"
                className="min-h-[104px] rounded-md border border-line bg-cream px-4 py-3 text-base font-normal focus:border-matcha-deep focus:outline-none focus:shadow-focus"
              />
            </label>
          </div>
        </div>
        <div className={isEdit ? "grid gap-4 sm:grid-cols-3" : "grid gap-4 sm:grid-cols-2"}>
          <label className="grid gap-2 text-sm font-medium text-charcoal">
            Type
            <TrackedSelect
              name="type"
              defaultValue={reward?.type ?? "item"}
              options={[
                { value: "item", label: "Item" },
                { value: "merch", label: "Merch" }
              ]}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-charcoal">
            Points price
            <TrackedInput
              name="pointCost"
              required
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              defaultValue={reward?.pointCost}
              placeholder="Point cost"
              className="h-12 rounded-md border border-line bg-cream px-4 focus:border-matcha-deep focus:outline-none focus:shadow-focus"
              sanitize={(value) => value.replace(/\D/g, "")}
            />
          </label>
          {isEdit ? (
            <label className="grid gap-2 text-sm font-medium text-charcoal">
              Status
              <TrackedSelect
                name="active"
                defaultValue={reward?.active ? "true" : "false"}
                options={[
                  { value: "true", label: "Active" },
                  { value: "false", label: "Inactive" }
                ]}
              />
            </label>
          ) : null}
        </div>
        {isEdit ? null : (
          <input
            name="stockCount"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Initial branch stock; leave blank for always available"
            className="rounded-md border border-line bg-cream px-4 py-3 focus:border-matcha-deep focus:outline-none focus:shadow-focus"
            onInput={(event) => {
              event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "");
            }}
          />
        )}
        <div className="flex justify-end gap-3">
          <Button href="/manager/rewards" variant="secondary">Cancel</Button>
          <DirtySaveButton pendingLabel={isEdit ? "Saving…" : "Creating…"}>
            {isEdit ? "Save reward" : "Create reward"}
          </DirtySaveButton>
        </div>
        <Modal
          open={galleryOpen}
          onClose={() => setGalleryOpen(false)}
          title="Reward gallery"
          description="Images for this reward."
          className="max-w-[520px]"
        >
          <div className="grid gap-6">
            <section className="grid gap-3">
              <h3 className="text-sm font-semibold text-charcoal">Reward image array</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {galleryItems.length > 0 ? (
                  galleryItems.map((item) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(event) => {
                        setDraggedImageId(item.id);
                        setRoundedDragPreview(event);
                      }}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={() => {
                        if (!draggedImageId || draggedImageId === item.id) return;
                        const currentOrder = galleryItems.map((galleryItem) => galleryItem.id);
                        const fromIndex = currentOrder.indexOf(draggedImageId);
                        const toIndex = currentOrder.indexOf(item.id);
                        if (fromIndex === -1 || toIndex === -1) return;
                        const nextOrder = [...currentOrder];
                        const [moved] = nextOrder.splice(fromIndex, 1);
                        nextOrder.splice(toIndex, 0, moved);
                        setGalleryOrder(nextOrder);
                      }}
                      className="relative cursor-grab overflow-hidden rounded-md border border-line bg-stone active:cursor-grabbing"
                    >
                      <button
                        type="button"
                        className="absolute right-2 top-2 z-10 rounded-pill border border-line bg-cream px-3 py-1 text-xs font-medium text-charcoal hover:border-matcha-deep hover:text-matcha-deep"
                        onClick={deselectImage}
                      >
                        Remove
                      </button>
                      <div className="grid aspect-square place-items-center text-sm font-medium text-ink-muted">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt=""
                            width={220}
                            height={220}
                            draggable={false}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="px-4 text-center">{item.label}</span>
                        )}
                      </div>
                      <div className="border-t border-line-soft px-3 py-2 text-xs font-medium text-ink-muted">
                        {item.label}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-md border border-line bg-stone p-5 text-sm text-ink-muted">
                    No reward images yet.
                  </div>
                )}
              </div>
            </section>
            <section className="grid gap-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-charcoal">Org asset pool</h3>
                <label
                  htmlFor={imageInputId}
                  aria-disabled={isUploading}
                  aria-busy={isUploading}
                  className={clsx(
                    "inline-flex min-h-tap items-center justify-center gap-2 rounded-pill border border-line bg-cream px-5 py-2.5 text-sm font-medium tracking-tight text-charcoal hover:border-matcha-deep hover:text-matcha-deep",
                    isUploading ? "pointer-events-none opacity-60" : "cursor-pointer"
                  )}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Uploading…
                    </>
                  ) : (
                    "Upload image"
                  )}
                </label>
              </div>
              <div className="grid max-h-[260px] gap-3 overflow-y-auto overscroll-contain pr-1 sm:grid-cols-3">
                {assetPool.length > 0 ? (
                  assetPool.map((asset) => (
                    <div
                      key={asset.id}
                      className="overflow-hidden rounded-md border border-line bg-stone text-left"
                    >
                      <button
                        type="button"
                        className="block w-full text-left"
                        onClick={() => {
                          setSelectedAssetId(asset.id);
                        }}
                      >
                        <Image src={asset.imageUrl} alt="" width={160} height={160} className="aspect-square w-full object-cover" />
                        <span className="block truncate border-t border-line-soft px-3 py-2 text-xs font-medium text-ink-muted">
                          {asset.filename}
                        </span>
                      </button>
                      <div className="border-t border-line-soft px-3 py-2">
                        <button
                          type="button"
                          disabled={isDeletingAsset}
                          className="text-xs font-medium text-error-text disabled:text-ink-faint"
                          onClick={() => deleteAssetFromPool(asset.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-md border border-line bg-stone p-5 text-sm text-ink-muted sm:col-span-3">
                    No org assets yet.
                  </div>
                )}
              </div>
            </section>
          </div>
        </Modal>
      </form>
    </DirtyFieldsProvider>
  );
}
