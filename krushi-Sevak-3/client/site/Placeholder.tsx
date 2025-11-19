import { useI18n } from "./i18n";

export default function Placeholder({ title }: { title?: string }) {
  const { t } = useI18n();
  return (
    <section className="container py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          {title ?? t.placeholder_title}
        </h1>
        <p className="text-muted-foreground">
          {t.placeholder_desc}
        </p>
      </div>
    </section>
  );
}
