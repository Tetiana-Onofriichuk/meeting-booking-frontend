import Image from "next/image";
import Button from "@/components/Button/Button";
import css from "./HomeHero.module.css";

export default function HomeHero() {
  return (
    <section className={css.hero}>
      <div className="container">
        <div className={css.grid}>
          <div className={css.content}>
            <h1 className={css.title}>
              Book meetings <br /> without the chaos
            </h1>

            <p className={css.description}>
              A simple meeting booking system that helps you schedule, manage
              and organize meetings effortlessly.
            </p>

            <div className={css.actions}>
              <Button variant="primary">Create meeting</Button>
              <Button variant="secondary">View schedule</Button>
            </div>
          </div>

          <div className={css.imageWrap}>
            <Image
              src="/images/hero.png"
              alt="Calendar and meeting schedule illustration"
              width={768}
              height={512}
              priority
              className={css.image}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
