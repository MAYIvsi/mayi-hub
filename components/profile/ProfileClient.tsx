"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Cropper, { type Area } from "react-easy-crop";

import { Button } from "@/components/ui/Button";
import { GlowContainer } from "@/components/ui/GlowContainer";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/cn";
import { createClient } from "@/lib/supabase/client";
import { cropImageToBlob } from "@/lib/imageCrop";

type Props = {
  initialDisplayName: string | null;
  initialAvatarUrl: string | null;
  initialSteamId: string | null;
  layout?: "page" | "modal";
};

export function ProfileClient({
  initialDisplayName,
  initialAvatarUrl,
  initialSteamId,
  layout = "page",
}: Props) {
  const router = useRouter();

  const [displayName, setDisplayName] = useState(initialDisplayName ?? "");
  const [steamId, setSteamId] = useState(initialSteamId ?? "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [rawImageUrl, setRawImageUrl] = useState<string | null>(null);
  const rawObjectUrlRef = useRef<string | null>(null);

  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState<string | null>(null);
  const croppedObjectUrlRef = useRef<string | null>(null);

  const [cropOpen, setCropOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    return () => {
      if (rawObjectUrlRef.current) URL.revokeObjectURL(rawObjectUrlRef.current);
      if (croppedObjectUrlRef.current)
        URL.revokeObjectURL(croppedObjectUrlRef.current);
    };
  }, []);

  const openFilePicker = () => fileInputRef.current?.click();

  const onSelectFile = (file: File | null) => {
    setError(null);
    if (!file) return;
    setSelectedFile(file);

    if (rawObjectUrlRef.current) URL.revokeObjectURL(rawObjectUrlRef.current);
    const url = URL.createObjectURL(file);
    rawObjectUrlRef.current = url;
    setRawImageUrl(url);

    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setCropOpen(true);
  };

  const onCropComplete = (_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  };

  const confirmCrop = async () => {
    if (!rawImageUrl || !croppedAreaPixels) return;
    setLoading(true);
    setError(null);
    try {
      const blob = await cropImageToBlob(rawImageUrl, croppedAreaPixels, {
        mimeType: "image/jpeg",
        quality: 0.92,
        size: 512,
      });
      setCroppedBlob(blob);

      if (croppedObjectUrlRef.current)
        URL.revokeObjectURL(croppedObjectUrlRef.current);
      const preview = URL.createObjectURL(blob);
      croppedObjectUrlRef.current = preview;
      setCroppedPreviewUrl(preview);

      setCropOpen(false);
    } catch (e) {
      setError("裁切失败了捏…再来一次（咬笔头）");
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    setLoading(true);
    setError(null);
    setToast(null);

    let uploadedAvatarUrl: string | null = avatarUrl;

    if (croppedBlob) {
      const supabase = createClient();
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) {
        setLoading(false);
        setError("未授权访客请先登录捏（");
        return;
      }

      const path = `${authData.user.id}/${Date.now()}.jpg`;
      const uploadFile = new File([croppedBlob], "avatar.jpg", {
        type: "image/jpeg",
      });

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, uploadFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        setLoading(false);
        setError(uploadError.message);
        return;
      }

      const { data: publicData } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);

      uploadedAvatarUrl = publicData.publicUrl ?? null;
      setAvatarUrl(uploadedAvatarUrl);
      setCroppedBlob(null);
    }

    const res = await fetch("/api/profile/update", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        display_name: displayName.trim(),
        avatar_url: uploadedAvatarUrl,
        steam_id: steamId.trim(),
      }),
    });

    setLoading(false);

    const payload = (await res.json().catch(() => null)) as
      | { ok?: boolean; error?: string }
      | null;

    if (!res.ok) {
      setError(payload?.error ?? "保存失败（未知错误）");
      return;
    }

    setToast("档案已保存 · 绿光确认中…");
    router.refresh();
  };

  return (
    <div
      className={cn(
        layout === "modal"
          ? "h-full w-full"
          : "mx-auto w-full max-w-3xl space-y-4",
      )}
    >
      {layout === "page" ? (
        <GlowContainer variant="pink" className="p-6">
          <div className="text-xs font-black tracking-[0.28em] text-text-muted">
            档案资料
          </div>
          <div className="mt-2 text-2xl font-black tracking-tight text-text-primary">
            探员个人中心
          </div>
          <div className="mt-1 text-sm text-text-muted">
            改档案别乱来捏…档案室是会记仇的（
          </div>
        </GlowContainer>
      ) : null}

      <div
        className={cn(
          layout === "modal"
            ? "grid h-full gap-4 lg:grid-cols-[1.1fr_1fr]"
            : "grid gap-4 lg:grid-cols-2",
        )}
      >
        <GlowContainer variant="green" className={cn(layout === "modal" ? "p-6" : "p-5")}>
          <div className="flex items-center justify-between">
            <div className="text-xs font-black tracking-[0.28em] text-text-muted">
              头像档案
            </div>
            <div className="text-xs text-text-muted">点击更换 · 自动裁切 1:1</div>
          </div>

          <div className={cn("mt-5", layout === "modal" ? "space-y-5" : "space-y-3")}>
            <div className={cn("flex items-center gap-4", layout === "modal" ? "justify-center" : "")}>
              <Avatar
                variant="green"
                avatarUrl={croppedPreviewUrl ?? avatarUrl ?? null}
                className={cn(layout === "modal" ? "h-40 w-40" : "h-14 w-14")}
              />
              {layout === "modal" ? (
                <div className="min-w-0">
                  <div className="text-xs font-black tracking-[0.28em] text-text-muted">
                    探员代号
                  </div>
                  <div className="mt-2 truncate text-2xl font-black tracking-tight text-text-primary">
                    {displayName || "未命名探员"}
                  </div>
                </div>
              ) : (
                <div className="min-w-0">
                  <div className="text-sm font-black tracking-tight text-text-primary">
                    头像预览
                  </div>
                  <div className="text-xs text-text-muted">
                    正方形裁切 · 圆形展示（1:1）
                  </div>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onSelectFile(e.target.files?.[0] ?? null)}
            />

            <div className={cn(layout === "modal" ? "flex justify-center" : "")}>
              <Button
                variant="pink"
                type="button"
                onClick={openFilePicker}
                className="whitespace-nowrap"
              >
                上传新头像
              </Button>
            </div>
          </div>
        </GlowContainer>

        <GlowContainer variant="pink" className={cn(layout === "modal" ? "p-6" : "p-5")}>
          <div className="text-xs font-black tracking-[0.28em] text-text-muted">
            身份识别
          </div>

          <div className="mt-4 space-y-3">
            <label className="block">
              <div className="mb-1 text-xs font-semibold text-text-muted">
                探员代号（display_name）
              </div>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="比如：MAYI / NightDetective / 鬼畜逻辑兽…"
                className={cn(
                  "h-11 w-full rounded-xl border border-white/10 bg-bg-app/60 px-3 text-sm text-text-primary outline-none",
                  "placeholder:text-text-muted/70 focus:border-accent-pink focus:shadow-glow-pink",
                )}
              />
            </label>

            <label className="block">
              <div className="mb-1 text-xs font-semibold text-text-muted">
                Steam ID
              </div>
              <input
                value={steamId}
                onChange={(e) => setSteamId(e.target.value)}
                placeholder="7656119xxxxxxxxxx 或自定义 ID"
                className={cn(
                  "h-11 w-full rounded-xl border border-white/10 bg-bg-app/60 px-3 text-sm text-text-primary outline-none",
                  "placeholder:text-text-muted/70 focus:border-accent-pink focus:shadow-glow-pink",
                )}
              />
            </label>
          </div>

          {error ? (
            <div className="mt-4 rounded-xl border border-border-pink bg-bg-app/50 p-3 text-sm text-accent-pink">
              {error}
            </div>
          ) : null}

          <div className="mt-5">
            <Button variant="green" onClick={save} disabled={loading}>
              {loading ? "正在上传档案..." : "保存档案"}
            </Button>
          </div>
        </GlowContainer>
      </div>

      <Modal
        open={cropOpen}
        title="裁切头像（1:1）"
        onClose={() => setCropOpen(false)}
      >
        <div className="space-y-3">
          <div className="relative h-80 overflow-hidden rounded-2xl border border-white/10 bg-bg-app/60">
            {rawImageUrl ? (
              <Cropper
                image={rawImageUrl}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                cropShape="round"
                showGrid={false}
              />
            ) : null}
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs font-semibold text-text-muted">缩放</div>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-accent-green"
            />
          </div>

          {error ? (
            <div className="rounded-xl border border-border-pink bg-bg-app/50 p-3 text-sm text-accent-pink">
              {error}
            </div>
          ) : null}

          <div className="flex flex-wrap justify-end gap-2">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setCropOpen(false)}
              disabled={loading}
            >
              取消
            </Button>
            <Button
              variant="green"
              type="button"
              onClick={confirmCrop}
              disabled={loading || !rawImageUrl}
            >
              确认裁切
            </Button>
          </div>
        </div>
      </Modal>

      {toast ? (
        <div className="fixed bottom-24 left-1/2 z-50 w-[92vw] max-w-md -translate-x-1/2">
          <div className="rounded-2xl border border-border-green bg-bg-surface/90 p-4 shadow-glow-green backdrop-blur-sm">
            <div className="text-sm font-semibold text-accent-green text-glow-green">
              {toast}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

