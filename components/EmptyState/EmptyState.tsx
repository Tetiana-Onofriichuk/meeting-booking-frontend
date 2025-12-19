import css from "./EmptyState.module.css";

type Props = {
  title?: string;
  description?: string;
};

export default function EmptyState({
  title = "Nothing to show yet",
  description = "Please select or create a user to continue.",
}: Props) {
  return (
    <section className={css.wrapper}>
      <h1 className={css.title}>{title}</h1>
      <p className={css.description}>{description}</p>
    </section>
  );
}
