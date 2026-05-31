import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useI18n } from "@/lib/i18n";
import { getCalcDict } from "@/lib/calc-i18n";

export type FAQItem = { q: string; a: string };

export function FAQ({ items, title }: { items: FAQItem[]; title?: string }) {
  const { lang } = useI18n();
  const heading = title ?? getCalcDict(lang).common.faqTitle;
  return (
    <section className="px-5 pb-16">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-6 text-center font-display text-2xl text-foreground/90">{heading}</h2>
        <div className="glass-strong rounded-3xl px-6 py-2 md:px-8">
          <Accordion type="single" collapsible className="w-full">
            {items.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-white/10">
                <AccordionTrigger className="text-left text-base text-foreground hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

export function faqJsonLd(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}