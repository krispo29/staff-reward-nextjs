"use client";

import { Layout } from "@/components/Layout";
import { StartScreen } from "@/components/StartScreen";
import { DrawScreen } from "@/components/DrawScreen";
import { AdminPanel } from "@/components/AdminPanel";
import { useDrawStore } from "@/store/drawStore";

export default function Home() {
  const { drawStatus, currentDraw } = useDrawStore();

  const isDrawing = drawStatus !== "idle" || currentDraw > 0;

  return (
    <Layout>
      <AdminPanel />
      {isDrawing ? <DrawScreen /> : <StartScreen />}
    </Layout>
  );
}
