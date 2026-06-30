import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-margin-mobile text-center">
      <Icon name="ramen_dining" className="text-6xl text-primary" />
      <h1 className="font-headline-lg text-headline-lg-mobile text-on-surface md:text-headline-lg">
        Страница не найдена
      </h1>
      <p className="max-w-sm font-body-md text-secondary">
        Похоже, такой страницы нет. Вернитесь в меню и выберите любимые роллы.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-full bg-primary px-8 py-4 font-label-md text-label-md text-on-primary transition-all active:scale-95"
      >
        В меню
      </Link>
    </div>
  );
}
