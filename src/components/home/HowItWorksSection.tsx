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
    <section className="py-20 border-t border-border/70 bg-secondary/30 transition-colors">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/70 px-3.5 py-1 text-xs font-medium text-muted-foreground">
            <Cpu className="size-3.5 text-primary" />
            <span>Alur Kerja & Teknologi</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            Bagaimana Cara Kerja Isyara?
          </h2>

          <p className="mt-3 text-base text-muted-foreground">
            Tiga tahapan komputasi cerdas yang terjadi sepenuhnya di browser Anda tanpa ketergantungan server.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between transition-colors hover:border-primary/50"
              >
                <div>
                  {/* Step Number & Tech Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl font-black text-muted-foreground/40 group-hover:text-primary transition-colors">
                      {item.step}
                    </span>
                    <span className="rounded-md bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {item.badge}
                    </span>
                  </div>

                  {/* Icon Box */}
                  <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>

                  <h3 className="font-bold text-base text-foreground mb-2">
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
