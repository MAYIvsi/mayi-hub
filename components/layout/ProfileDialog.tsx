"use client";

import { useState } from "react";

import { Modal } from "@/components/ui/Modal";
import { ProfileClient } from "@/components/profile/ProfileClient";

export function ProfileDialog({
  trigger,
  initialDisplayName,
  initialAvatarUrl,
  initialSteamId,
}: {
  trigger: React.ReactNode;
  initialDisplayName: string | null;
  initialAvatarUrl: string | null;
  initialSteamId: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        className="w-full cursor-pointer rounded-xl text-left outline-none focus:ring-2 focus:ring-border-pink/60"
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setOpen(true);
        }}
      >
        {trigger}
      </div>
      <Modal
        open={open}
        title="身份识别"
        onClose={() => setOpen(false)}
        panelClassName="w-[92vw] max-w-4xl aspect-video h-[min(450px,90vh)] p-6"
      >
        <ProfileClient
          initialDisplayName={initialDisplayName}
          initialAvatarUrl={initialAvatarUrl}
          initialSteamId={initialSteamId}
          layout="modal"
        />
      </Modal>
    </>
  );
}

