import { Camera, Cpu, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ArchitectureStep {
  step: string;
  icon: typeof Camera;
  title: string;
  description: string;
  badge: string;
}

export const HOW_IT_WORKS_STEPS: ArchitectureStep[] = [
  {
    step: "01",
    icon: Camera,
    title: "Tangkap Pose Tangan via Webcam",
    description:
      "Aktifkan kamera browsermu. Sistem WebRTC membaca aliran video real-time hingga 30 FPS secara lokal tanpa mengirim byte gambar apapun ke internet.",
    badge: "WebRTC On-Device",
  },
  {
    step: "02",
    icon: Cpu,
    title: "Ekstraksi 126 Koordinat Fitur",
    description:
      "MediaPipe Tasks Vision melacak 21 sendi jari per tangan. Sistem menormalkan koordinat relatif terhadap wrist untuk konsistensi jarak dan sudut pandang.",
    badge: "MediaPipe Vision WASM",
  },
  {
    step: "03",
    icon: Sparkles,
    title: "Klasifikasi & Smoothing Anti-Flicker",
    description:
      "Model TensorFlow.js memprediksi alfabet BISINDO dalam < 50ms. Algoritma smoothing buffer memastikan huruf tidak berkedip dan nyaman dibaca.",
    badge: "TensorFlow.js WebGL",
  },
];

export function HowItWorksSection() {
  const steps = HOW_IT_WORKS_STEPS;

  return (
    <section className="py-20 border-t border-border/50">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-3">
            <Cpu className="size-3.5" />
            <span>Arsitektur & Alur Kerja</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            Bagaimana Cara Kerja{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-300 dark:to-violet-400">
              Isyara?
            </span>
          </h2>

          <p className="mt-4 text-base text-muted-foreground">
            Tiga langkah komputasi cerdas yang terjadi sepenuhnya di browser Anda dalam hitungan milidetik.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div>
                  {/* Step Number Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-3xl font-black text-muted-foreground/30 group-hover:text-primary/40 transition-colors">
                      {item.step}
                    </span>
                    <span className="rounded-full bg-muted/60 px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      {item.badge}
                    </span>
                  </div>

                  {/* Icon Box */}
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                    <Icon className="size-6" />
                  </div>

                  <h3 className="font-bold text-lg text-foreground mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Try it out callout */}
        <div className="mt-12 text-center">
          <Link
            href="/translate"
            className={cn(
              buttonVariants({ size: "default" }),
              "gap-2 font-semibold shadow-xs"
            )}
          >
            <span>Uji Coba Langsung di Kamera</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
