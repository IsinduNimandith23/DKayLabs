"use client";

import { useCallback, useState } from "react";
import ServiceCard from "@/components/ui/ServiceCard";
import ServiceModal from "@/components/ui/ServiceModal";
import { SERVICES, type Service } from "@/lib/constants";

/**
 * Owns the "which service is open" state so Services stays a server component.
 */
export default function ServicesGrid() {
  const [selected, setSelected] = useState<Service | null>(null);

  // Stable identity keeps the modal's Escape/scroll-lock effect from re-running.
  const close = useCallback(() => setSelected(null), []);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((service, i) => (
          <ServiceCard
            key={service.title}
            service={service}
            index={i}
            onSelect={setSelected}
          />
        ))}
      </div>

      <ServiceModal service={selected} onClose={close} />
    </>
  );
}
